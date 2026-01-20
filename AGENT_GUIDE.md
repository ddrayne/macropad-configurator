# MacroPad Agent Guide

Deep context for a coding agent working on this MacroPad repo.

## Runtime environment
- CircuitPython on Adafruit MacroPad. Entry point is `code.py` at the drive root.
- Macro definitions live in `macros/*.py`; files are imported in sorted order, each providing an `app` dict.
- Display: 12-key grid plus encoder with OLED labels and per-key NeoPixels. Encoder rotates to switch apps; encoder button can be a 13th macro.
- Auto-refresh is disabled; LEDs and display are updated explicitly.

## Macro schema
Each macro entry in `app["macros"]` is a 3-tuple `(color, label, sequence)`:
- `color`: 24-bit RGB (e.g., `0x00FF00`) for the key LED when idle.
- `label`: short OLED label; empty string hides a key.
- `sequence`: list of actions processed on press and partially on release.

Sequence item types (mixable, ordered):
- `int >= 0`: press keycode.
- `int < 0`: release keycode.
- `float`: delay in seconds.
- `str`: type literal text via `macropad.keyboard_layout.write()`.
- `list`: consumer control codes (media/brightness) iterated as press/release.
- `dict`: mouse/tone/audio:
  - `buttons`: press (>=0) or release (<0) mouse buttons bitmask.
  - `x`/`y`/`wheel`: relative motion/scroll.
  - `tone`: start tone at frequency, or `0` to stop.
  - `play`: play a WAV file via `macropad.play_file()`.

## Press vs release behavior
- On press: runs the full sequence in order. For consumer codes in a list, it releases then presses each code.
- On release: releases any positive keycodes seen in the sequence, releases mouse `buttons`, stops tones, and calls `consumer_control.release()`. Motion, delays, and audio playback are not undone.
- Key LED flashes white on press (keys 0–11) and reverts to macro color on release; encoder button has no LED.

## App switching
- Encoder rotation changes `app_index = encoder % len(apps)`; wraps around.
- `App.switch()` sets labels/colors, releases any held keyboard/mouse/consumer codes, stops tones, and refreshes display/LEDs.

## Error handling and file loading
- On startup, `code.py` lists `MACRO_FOLDER` (default `/macros`), imports `.py` files, and collects `app` dicts.
- Import errors (syntax, missing keys, etc.) are printed to the serial console with traceback; problematic files are skipped.
- If no valid macro files load, the display shows “NO MACRO FILES FOUND” and the device idles.

## Extensibility notes
- Additional capabilities would require extending the `sequence` handler in `code.py` to accept new item types or dict keys.
- Keep tuple shape `(color, label, sequence)` to stay compatible with existing macros.
- Maintain backward compatibility: new dict keys should not break existing mouse/tone/play handling.

## Testing and validation tips
- Use existing macro files (`media.py`, `mouse.py`, `tones.py`, `claude*.py`) as behavior references.
- Verify press/release semantics when adding multi-key or mouse-hold macros.
- Ensure labels fit the display; avoid long strings.
- Confirm new imports (e.g., additional HID classes) are available in the CircuitPython bundle used on the device.
