# SPDX-FileCopyrightText: 2021 Phillip Burgess for Adafruit Industries
#
# SPDX-License-Identifier: MIT

# MACROPAD Hotkeys example: Adobe Photoshop for Windows

from adafruit_hid.keycode import Keycode # REQUIRED if using Keycode.* values

app = {                       # REQUIRED dict, must be named 'app'
    'name' : 'Beam.NG', # Application name
    'macros' : [              # List of button macros...
        # COLOR    LABEL    KEY SEQUENCE
        # 1st row ----------
        (0x004000, 'Trailer', 'L'),
        (0x000040, 'Horn', 'H'),   # Horn
        (0x000040, 'Doors', 'O'),  
        # 2nd row ----------
        (0x101010, 'Lights', 'M'),     # Default colors
        (0x101010, 'P Brake', 'P'), # Cycle rect/ellipse marquee (select)
        (0x400000, 'Reload', [Keycode.CONTROL, 'r']),
        # 3rd row ----------
        (0xE6E6FA, 'Extend', [Keycode.CONTROL, Keycode.PAGE_UP]),
        (0x101010, 'Retract', [Keycode.CONTROL, Keycode.PAGE_DOWN]),    
        (0x101010, 'Bed Up', Keycode.PAGE_DOWN), 
        # 4th row ----------
        (0x101010, 'Bed Up', Keycode.PAGE_UP), 
        #(0x101010, 'Wand', 'W'),    # Cycle "magic wand" (selection) modes
        #(0x000040, 'Heal', 'J'),    # Cycle "healing" modes
        # Encoder button ---
        #(0x000000, '', [Keycode.CONTROL, Keycode.ALT, 'S']) # Save for web
    ]
}
