
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES_DIR = path.join(__dirname, '../../examples');
const OUTPUT_FILE = path.join(__dirname, '../src/utils/presets.json');

// Map of common Keycodes to readable strings
// This is a simplified map, assuming the code generator handles the reverse
const KEYCODE_MAP = {
    'Keycode.ENTER': 'ENTER',
    'Keycode.ESCAPE': 'ESCAPE',
    'Keycode.BACKSPACE': 'BACKSPACE',
    'Keycode.TAB': 'TAB',
    'Keycode.SPACE': 'SPACE',
    'Keycode.UP_ARROW': 'UP_ARROW',
    'Keycode.DOWN_ARROW': 'DOWN_ARROW',
    'Keycode.LEFT_ARROW': 'LEFT_ARROW',
    'Keycode.RIGHT_ARROW': 'RIGHT_ARROW',
    'Keycode.SHIFT': 'LEFT_SHIFT',
    'Keycode.CONTROL': 'LEFT_CONTROL',
    'Keycode.ALT': 'LEFT_ALT',
    'Keycode.GUI': 'LEFT_GUI',
    'Keycode.COMMAND': 'LEFT_GUI',
    // Numpad
    'Keycode.ONE': 'ONE', 'Keycode.TWO': 'TWO', 'Keycode.THREE': 'THREE',
    'Keycode.FOUR': 'FOUR', 'Keycode.FIVE': 'FIVE', 'Keycode.SIX': 'SIX',
    'Keycode.SEVEN': 'SEVEN', 'Keycode.EIGHT': 'EIGHT', 'Keycode.NINE': 'NINE',
    'Keycode.ZERO': 'ZERO', 'Keycode.PERIOD': 'PERIOD',
    // F-Keys
    'Keycode.F1': 'F1', 'Keycode.F2': 'F2', 'Keycode.F3': 'F3', 'Keycode.F4': 'F4',
    'Keycode.F5': 'F5', 'Keycode.F6': 'F6', 'Keycode.F7': 'F7', 'Keycode.F8': 'F8',
    'Keycode.F9': 'F9', 'Keycode.F10': 'F10', 'Keycode.F11': 'F11', 'Keycode.F12': 'F12',
};

const CONSUMER_MAP = {
    'ConsumerControlCode.VOLUME_INCREMENT': 'VOLUME_INCREMENT',
    'ConsumerControlCode.VOLUME_DECREMENT': 'VOLUME_DECREMENT',
    'ConsumerControlCode.MUTE': 'MUTE',
    'ConsumerControlCode.PLAY_PAUSE': 'PLAY_PAUSE',
    'ConsumerControlCode.SCAN_NEXT_TRACK': 'SCAN_NEXT_TRACK',
    'ConsumerControlCode.SCAN_PREVIOUS_TRACK': 'SCAN_PREVIOUS_TRACK',
    'ConsumerControlCode.BRIGHTNESS_INCREMENT': 'BRIGHTNESS_INCREMENT',
    'ConsumerControlCode.BRIGHTNESS_DECREMENT': 'BRIGHTNESS_DECREMENT',
};

function parseValue(val) {
    val = val.trim();

    // Check for Consumer Control (List inside list logic in python, but here likely string)
    // E.g. [ConsumerControlCode.VOLUME_INCREMENT]
    if (val.startsWith('[ConsumerControlCode.')) {
        const inner = val.replace('[', '').replace(']', '').trim();
        if (CONSUMER_MAP[inner]) {
            return { type: 'consumer', value: CONSUMER_MAP[inner] };
        }
    }

    // Check for Mouse Dict
    // E.g. {'buttons':Mouse.LEFT_BUTTON}
    if (val.startsWith('{')) {
        // Limitation: We don't fully support mouse parsing in this quick script yet
        // defaulting to empty/unknown or trying basic extraction
        return { type: 'text', value: 'MOUSE_MACRO(UNSUPPORTED)' };
    }

    // Check for Keycode
    if (val.startsWith('Keycode.')) {
        if (KEYCODE_MAP[val]) {
            return { type: 'key', value: KEYCODE_MAP[val] };
        }
        // Fallback for unknown keycodes
        return { type: 'key', value: val.replace('Keycode.', '') };
    }

    // Check for String Literal
    if (val.startsWith("'") || val.startsWith('"')) {
        // Remove quotes
        return { type: 'text', value: val.slice(1, -1) };
    }

    // Check for Numbers (Delay)
    if (!isNaN(parseFloat(val))) {
        return { type: 'delay', value: parseFloat(val) };
    }

    return { type: 'text', value: val }; // Fallback
}

function parseFile(content) {
    try {
        // Extract App Name
        const nameMatch = content.match(/'name'\s*:\s*'([^']+)'/);
        const appName = nameMatch ? nameMatch[1] : 'Unknown';

        // Extract Macros block
        // This is a naive regex approach. Ideally we'd use a python parser.
        // We look for content between 'macros' : [ and the ending ]
        const macrosStart = content.indexOf("'macros'");
        if (macrosStart === -1) return null;

        let sub = content.substring(macrosStart);
        const arrayStart = sub.indexOf('[');
        sub = sub.substring(arrayStart + 1);

        // Find closing bracket (simple counter)
        let balance = 1;
        let arrayEnd = 0;
        for (let i = 0; i < sub.length; i++) {
            if (sub[i] === '[') balance++;
            if (sub[i] === ']') balance--;
            if (balance === 0) {
                arrayEnd = i;
                break;
            }
        }

        const macrosBlock = sub.substring(0, arrayEnd);

        // Split by lines to process each macro tuple
        // (0x000000, 'Label', [...])
        const macros = [];
        const lines = macrosBlock.split('\n');

        lines.forEach(line => {
            line = line.trim();
            if (!line.startsWith('(')) return;

            // Extract Color
            const colorMatch = line.match(/(0x[0-9A-Fa-f]+)/);
            if (!colorMatch) return;
            const colorHex = '#' + parseInt(colorMatch[1], 16).toString(16).padStart(6, '0');

            // Extract Label
            // Matches 'Label' or "Label"
            const labelMatch = line.match(/,\s*(['"])(.*?)\1\s*,/);
            const label = labelMatch ? labelMatch[2] : '';

            // Extract Sequence List
            // Everything after the second comma until the closing )] or )
            // This is fragile.
            const seqStart = line.indexOf('[', line.indexOf(labelMatch ? labelMatch[0] : colorMatch[0]));
            if (seqStart === -1) return;

            // Find end of sequence list
            let seqEnd = -1;
            let bracketBalance = 0;
            for (let i = seqStart; i < line.length; i++) {
                if (line[i] === '[') bracketBalance++;
                if (line[i] === ']') bracketBalance--;
                if (bracketBalance === 0) {
                    seqEnd = i;
                    break;
                }
            }

            if (seqEnd === -1) return;

            const seqString = line.substring(seqStart + 1, seqEnd);
            const sequenceItems = [];

            // Split sequence by comma, ignoring commas inside brackets/quotes
            // Naive split for now
            const rawItems = seqString.split(',').map(s => s.trim()).filter(s => s);

            rawItems.forEach(item => {
                sequenceItems.push(parseValue(item));
            });

            macros.push({
                color: colorHex,
                label: label,
                sequence: sequenceItems
            });
        });

        // Pad to 12 if needed
        while (macros.length < 12) {
            macros.push({ color: '#000000', label: '', sequence: [] });
        }

        return {
            name: appName,
            macros: macros.slice(0, 12)
        };

    } catch (e) {
        console.error("Error parsing", e);
        return null;
    }
}

const presets = [];
const files = fs.readdirSync(EXAMPLES_DIR);

files.forEach(file => {
    if (file.endsWith('.py')) {
        const content = fs.readFileSync(path.join(EXAMPLES_DIR, file), 'utf8');
        console.log(`Parsing ${file}...`);
        const result = parseFile(content);
        if (result) {
            presets.push(result);
        }
    }
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(presets, null, 2));
console.log(`Generated ${presets.length} presets to ${OUTPUT_FILE}`);
