# Adafruit MacroPad Hotkeys (cross-platform)

This device runs the CircuitPython macro launcher in `code.py`. It exposes 12 keys plus the encoder button (optional 13th macro) and cycles between macro sets stored in `macros/*.py`.

## How it works
- Each macro file defines an `app` dict with a `name` and `macros` list; files load alphabetically.
- Each macro entry is `(color, label, sequence)`. `color` is a 24-bit hex LED value, `label` shows on the OLED, `sequence` is processed on press/release.
- Rotate the encoder to switch apps; pressing the encoder runs entry 13 if present.

### Sequence anatomy
- `int >= 0`: press that keycode (e.g., `Keycode.ENTER`).
- `int < 0`: release that keycode (e.g., `-Keycode.ENTER`).
- `float`: pause for that many seconds.
- `str`: type the text literally via the current keyboard layout.
- `list`: consumer control codes (media/brightness) like `[[ConsumerControlCode.VOLUME_INCREMENT]]`; iterate and press/release as written.
- `dict`: mouse/tone/audio — any mix of `buttons`, `x`, `y`, `wheel`, `tone`, `play`.

## Actions available on all operating systems
All actions are pure USB HID or on-device audio, so they are OS-agnostic. Your key choices may still target OS-specific shortcuts.

- **Keyboard HID**: positive ints press keys (e.g., `Keycode.ENTER`), negative ints release (`-Keycode.ENTER`). Strings type literal text via `macropad.keyboard_layout.write()`.
- **Delays**: float values pause the macro in seconds (e.g., `0.25`).
- **Consumer control (media/brightness)**: wrap codes in a nested list, e.g., `[[ConsumerControlCode.VOLUME_INCREMENT]]`; use negative to release.
- **Mouse HID**: dicts with any mix of `buttons`, `x`, `y`, `wheel`; positive `buttons` presses, negative releases.
- **Audio feedback**: `{'tone': frequency}` to start a tone, `{'tone': 0}` to stop, or `{'play': 'filename.wav'}` to play a file.
- **LED/display feedback**: when pressed, a key LED flashes white; on release it returns to the macro color, and labels are updated per app.

## What happens on press vs release
- On press, the whole sequence runs in order (keys, delays, media, mouse, tones, audio files).
- On release, the firmware cleans up: it releases any keys pressed as positive integers, releases mouse buttons set via `buttons`, stops tones, and calls `consumer_control.release()`; media codes themselves should still be written with press/release semantics if you need to hold them.
- Mouse motion/wheel, delays, and audio file playback do not “undo” on release; audio files play until they finish.
- LED for the key returns to the configured color on release.

## Creating or editing macro files
1) Copy an existing file in `macros/` (e.g., `media.py`) and rename it to describe the app.
2) Update the `app` dict: set `name`, then edit the `macros` list (up to 13 entries; index 12 is the encoder button).
3) Import the HID classes you need at the top (e.g., `Keycode`, `ConsumerControlCode`, `Mouse`).
4) Save and reboot or press reset; `code.py` auto-loads all `.py` files in `macros/`.

## Sequence reference (mix and match)
- Key press and release: `[Keycode.CONTROL, -Keycode.CONTROL]`
- Type text: `['hello world']`
- Pause: `[0.1]`
- Media key: `[[ConsumerControlCode.PLAY_PAUSE]]`
- Mouse move and click: `[{'x': 20, 'y': -10}, {'buttons': Mouse.LEFT_BUTTON}, {'buttons': -Mouse.LEFT_BUTTON}]`
- Tone feedback: `[{'tone': 440}, 0.2, {'tone': 0}]`

## Example macro entry
```
(0x004000, 'Demo', [
    Keycode.CONTROL, 'c', 0.1, 'Hello',
    [ConsumerControlCode.VOLUME_INCREMENT],
    {'x': 15, 'y': -15},
    {'tone': 440}, 0.2, {'tone': 0}
])
```
This sets a green key labeled "Demo" that copies, types text, nudges volume, moves the mouse, and beeps.

## Tips
- Keep labels short so they fit the display; empty strings hide unused keys.
- Use delays between multi-step combos that need host time to react.
- Group macros by app to keep the encoder dial navigation clear.
