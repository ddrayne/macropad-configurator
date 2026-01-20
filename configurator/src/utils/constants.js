
// Basic Keycodes (mapped to Adafruit HID Keycode integers)
// These are not exhaustive, but cover common keys.
export const KEYCODES = {
    // Letters
    A: 0x04, B: 0x05, C: 0x06, D: 0x07, E: 0x08, F: 0x09, G: 0x0A, H: 0x0B,
    I: 0x0C, J: 0x0D, K: 0x0E, L: 0x0F, M: 0x10, N: 0x11, O: 0x12, P: 0x13,
    Q: 0x14, R: 0x15, S: 0x16, T: 0x17, U: 0x18, V: 0x19, W: 0x1A, X: 0x1B,
    Y: 0x1C, Z: 0x1D,

    // Numbers
    ONE: 0x1E, TWO: 0x1F, THREE: 0x20, FOUR: 0x21, FIVE: 0x22,
    SIX: 0x23, SEVEN: 0x24, EIGHT: 0x25, NINE: 0x26, ZERO: 0x27,

    // Functional
    ENTER: 0x28, ESCAPE: 0x29, BACKSPACE: 0x2A, TAB: 0x2B, SPACE: 0x2C,
    MINUS: 0x2D, EQUALS: 0x2E, LEFT_BRACKET: 0x2F, RIGHT_BRACKET: 0x30,
    BACKSLASH: 0x31, SEMICOLON: 0x33, QUOTE: 0x34, GRAVE_ACCENT: 0x35,
    COMMA: 0x36, PERIOD: 0x37, FORWARD_SLASH: 0x38,

    // Functions
    F1: 0x3A, F2: 0x3B, F3: 0x3C, F4: 0x3D, F5: 0x3E, F6: 0x3F,
    F7: 0x40, F8: 0x41, F9: 0x42, F10: 0x43, F11: 0x44, F12: 0x45,

    // Navigation
    PRINT_SCREEN: 0x46, SCROLL_LOCK: 0x47, PAUSE: 0x48, INSERT: 0x49,
    HOME: 0x4A, PAGE_UP: 0x4B, DELETE: 0x4C, END: 0x4D, PAGE_DOWN: 0x4E,
    RIGHT_ARROW: 0x4F, LEFT_ARROW: 0x50, DOWN_ARROW: 0x51, UP_ARROW: 0x52,

    // Modifiers (Left)
    LEFT_CONTROL: 0xE0, LEFT_SHIFT: 0xE1, LEFT_ALT: 0xE2, LEFT_GUI: 0xE3,

    // Modifiers (Right)
    RIGHT_CONTROL: 0xE4, RIGHT_SHIFT: 0xE5, RIGHT_ALT: 0xE6, RIGHT_GUI: 0xE7,
};

// Consumer Control Codes
export const CONSUMER_CODES = {
    VOLUME_INCREMENT: 0xE9,
    VOLUME_DECREMENT: 0xEA,
    MUTE: 0xE2,
    PLAY_PAUSE: 0xCD,
    SCAN_NEXT_TRACK: 0xB5,
    SCAN_PREVIOUS_TRACK: 0xB6,
    BRIGHTNESS_INCREMENT: 0x006F,
    BRIGHTNESS_DECREMENT: 0x0070
};

// PRESETS - Extracted from examples
export const PRESETS = [
    {
        name: "Empty",
        macros: Array(12).fill(null).map(() => ({ color: "#000000", label: "", sequence: [] }))
    },
    {
        name: "Media",
        macros: [
            { color: "#000000", label: "", sequence: [] },
            { color: "#000020", label: "Vol+", sequence: [{ type: 'consumer', value: 'VOLUME_INCREMENT' }] },
            { color: "#202020", label: "Bright+", sequence: [{ type: 'consumer', value: 'BRIGHTNESS_INCREMENT' }] },
            { color: "#000000", label: "", sequence: [] },
            { color: "#000020", label: "Vol-", sequence: [{ type: 'consumer', value: 'VOLUME_DECREMENT' }] },
            { color: "#202020", label: "Bright-", sequence: [{ type: 'consumer', value: 'BRIGHTNESS_DECREMENT' }] },
            { color: "#000000", label: "", sequence: [] },
            { color: "#200000", label: "Mute", sequence: [{ type: 'consumer', value: 'MUTE' }] },
            { color: "#000000", label: "", sequence: [] },
            { color: "#202000", label: "<<", sequence: [{ type: 'consumer', value: 'SCAN_PREVIOUS_TRACK' }] },
            { color: "#002000", label: "Play/Pause", sequence: [{ type: 'consumer', value: 'PLAY_PAUSE' }] },
            { color: "#202000", label: ">>", sequence: [{ type: 'consumer', value: 'SCAN_NEXT_TRACK' }] },
        ]
    },
    {
        name: "Numpad",
        macros: [
            { color: "#202000", label: "7", sequence: [{ type: 'key', value: 'SEVEN' }] },
            { color: "#202000", label: "8", sequence: [{ type: 'key', value: 'EIGHT' }] },
            { color: "#202000", label: "9", sequence: [{ type: 'key', value: 'NINE' }] },
            { color: "#202000", label: "4", sequence: [{ type: 'key', value: 'FOUR' }] },
            { color: "#202000", label: "5", sequence: [{ type: 'key', value: 'FIVE' }] },
            { color: "#202000", label: "6", sequence: [{ type: 'key', value: 'SIX' }] },
            { color: "#202000", label: "1", sequence: [{ type: 'key', value: 'ONE' }] },
            { color: "#202000", label: "2", sequence: [{ type: 'key', value: 'TWO' }] },
            { color: "#202000", label: "3", sequence: [{ type: 'key', value: 'THREE' }] },
            { color: "#101010", label: "0", sequence: [{ type: 'key', value: 'ZERO' }] },
            { color: "#101010", label: ".", sequence: [{ type: 'key', value: 'PERIOD' }] },
            { color: "#800000", label: "ENTER", sequence: [{ type: 'key', value: 'ENTER' }] },
        ]
    }
];
