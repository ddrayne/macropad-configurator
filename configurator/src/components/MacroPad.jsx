import React from 'react';
import './MacroPad.css';

const MacroPad = ({ macros, selectedKeyIndex, onKeySelect }) => {
    return (
        <div className="macropad-device">

            {/* Top Section: Screen + Encoder */}
            <div className="device-header">
                {/* OLED Screen (Top Left & Middle) */}
                <div className="oled-screen">
                    <div className="oled-content">
                        <div className="oled-header">ADAFRUIT MACROPAD</div>
                        <div className="oled-grid">
                            {macros.slice(0, 12).map((macro, i) => (
                                <div key={i} className="oled-label">
                                    {macro.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rotary Encoder (Top Right) */}
                <div className="encoder-section">
                    <div className="knob-container">
                        <div className="knob-top"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: 12 Keys */}
            <div className="key-grid">
                {macros.slice(0, 12).map((macro, i) => (
                    <div
                        key={i}
                        className={`key-slot ${selectedKeyIndex === i ? 'selected' : ''}`}
                        onClick={() => onKeySelect(i)}
                    >
                        {/* The glowing LED underneath */}
                        <div
                            className="led-diffuse"
                            style={{
                                backgroundColor: macro.color === '#000000' ? 'transparent' : macro.color,
                                boxShadow: macro.color === '#000000' ? 'none' : `0 0 30px ${macro.color}, 0 0 10px ${macro.color}`
                            }}
                        />

                        {/* The Frosted Clear Keycap */}
                        <div className="key-cap-clear">
                            {/* Subtle physical details of a keycap */}
                            <div className="key-cap-concave"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Screw holes / PCB details for realism */}
            <div className="screw top-left"></div>
            <div className="screw top-right"></div>
            <div className="screw bottom-left"></div>
            <div className="screw bottom-right"></div>
        </div>
    );
};

export default MacroPad;
