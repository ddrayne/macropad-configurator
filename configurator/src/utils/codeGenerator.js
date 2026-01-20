
import { KEYCODES, CONSUMER_CODES } from './constants';

export const generateCode = (appName, macros) => {

    // Find used imports
    let hasKeycode = false;
    let hasConsumer = false;
    let hasMouse = false;

    macros.forEach(macro => {
        macro.sequence.forEach(step => {
            if (step.type === 'key') hasKeycode = true;
            if (step.type === 'consumer') hasConsumer = true;
            if (step.type === 'mouse') hasMouse = true;
        });
    });

    // Header
    let code = `from adafruit_hid.consumer_control_code import ConsumerControlCode\n`;
    if (hasKeycode) code += `from adafruit_hid.keycode import Keycode\n`;
    if (hasMouse) code += `from adafruit_hid.mouse import Mouse\n`;

    code += `\napp = {\n`;
    code += `    'name' : '${appName}',\n`;
    code += `    'macros' : [\n`;

    // Macros
    macros.forEach((macro, index) => {
        // Format Hex Color
        let colorHex = macro.color.replace('#', '0x');

        code += `        # Key ${index}\n`;
        code += `        (${colorHex}, '${macro.label}', [\n`;

        let sequenceParts = [];
        macro.sequence.forEach(step => {
            if (step.type === 'key') {
                sequenceParts.push(`            Keycode.${step.value}`);
            } else if (step.type === 'text') {
                sequenceParts.push(`            '${step.value}'`);
            } else if (step.type === 'delay') {
                sequenceParts.push(`            ${step.value}`);
            } else if (step.type === 'consumer') {
                sequenceParts.push(`            [ConsumerControlCode.${step.value}]`);
            }
            // Add others later
        });

        code += sequenceParts.join(',\n') + `\n        ]),\n`;
    });

    // Encoder (Placeholder for now, usually key 12/index 12 is handled as the button)
    code += `    ]\n}\n`;

    return code;
};
