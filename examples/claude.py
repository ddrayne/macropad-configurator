# SPDX-FileCopyrightText: 2021 Emma Humphries for Adafruit Industries
#
# SPDX-License-Identifier: MIT

# MACROPAD Hotkeys example: Claude Code Vibe Coder

from adafruit_hid.keycode import Keycode # REQUIRED if using Keycode.* values

app = {                # REQUIRED dict, must be named 'app'
    'name' : 'Vibe Coding Pad', # Application name
    'macros' : [       # List of button macros...
        # COLOR    LABEL    KEY SEQUENCE
        # 1st row (Nav & Exec) ----------
        (0x004040, 'Up', [Keycode.UP_ARROW]),      # Cyan
        (0x004040, 'Down', [Keycode.DOWN_ARROW]),  # Cyan
        (0x00FF00, 'Enter', [Keycode.ENTER]),      # Neon Green
        # 2nd row (Control) -------------
        (0x000080, 'Esc', [Keycode.ESCAPE]),                 # Deep Blue
        (0x8000FF, 'Dictate', [Keycode.GUI, 'h']), # Purple (Win+H)
        (0xFF0040, 'Cancel', [Keycode.CONTROL, 'c']), # Hot Pink
        # 3rd row (Git & Status) --------
        (0x404000, 'Status', ['git status', Keycode.ENTER]), # Yellow
        (0x402000, 'Shift+Tab', [Keycode.SHIFT, Keycode.TAB]),     # Orange
        (0x605000, 'Usage', ['/usage', Keycode.ENTER]),        # Gold
        # 4th row (Utils) ---------------
        (0x202020, 'Claude', ['claude', Keycode.ENTER]),     # White
        (0x000080, '/compact', ['/compact', Keycode.ENTER]), # Deep Blue
        (0x800000, 'Exit', [Keycode.CONTROL, 'd']),# Red
        # Encoder button ----------------
        (0x000000, '', [Keycode.ENTER])
    ]
}
