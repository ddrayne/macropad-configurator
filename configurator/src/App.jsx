
import React, { useState, useEffect } from 'react';
import MacroPad from './components/MacroPad';
import KeyEditor from './components/KeyEditor';
import { PRESETS } from './utils/constants';
import { generateCode } from './utils/codeGenerator';

function App() {
  const [appName, setAppName] = useState('My MacroPad');
  const [macros, setMacros] = useState(PRESETS[0].macros);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    setGeneratedCode(generateCode(appName, macros));
  }, [macros, appName]);

  const loadPreset = (presetName) => {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setMacros(JSON.parse(JSON.stringify(preset.macros)));
      setAppName(preset.name);
    }
  };

  const updateMacro = (newMacro) => {
    const newMacros = [...macros];
    newMacros[selectedKeyIndex] = newMacro;
    setMacros(newMacros);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12">

      {/* Top Bar: Title & Presets */}
      <header className="w-[800px] mb-8 flex justify-between items-end border-b-2 border-black pb-4">
        <div className="flex flex-col gap-2">
          <h1>TE-MACRO.CFG</h1>
          <span className="text-xs font-mono text-muted">RP2040 CONFIGURATION UTILITY v1.0</span>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-mono self-center mr-2">PRESETS:</span>
          {PRESETS.map(p => (
            <button
              key={p.name}
              className={`btn ${appName === p.name ? 'btn-primary' : ''}`}
              onClick={() => loadPreset(p.name)}
            >
              {p.name.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Main Control Center */}
      <main className="flex gap-8 items-start relative max-w-[1200px]">

        {/* Left Column: The Device */}
        <div className="flex flex-col gap-4">
          {/* Device Label */}
          <div className="flex justify-between font-mono text-xs text-muted border-b border-subtle pb-1">
            <span>HARDWARE VIEW</span>
            <span>SCALE: 1:1</span>
          </div>

          {/* The Device Itself */}
          <div className="p-8 bg-white border border-subtle shadow-card">
            <MacroPad
              macros={macros}
              selectedKeyIndex={selectedKeyIndex}
              onKeySelect={setSelectedKeyIndex}
            />
          </div>

          <div className="text-xs font-mono text-center text-muted mt-2">
            CLICK A KEY TO CONFIGURE
          </div>
        </div>

        {/* Right Column: Configuration & Code */}
        <div className="w-[400px] flex flex-col gap-6">

          {/* Box 1: App Settings */}
          <div className="panel">
            <h3>GLOBAL SETTINGS</h3>
            <div className="input-group m-0">
              <label className="input-label">APPLICATION NAME</label>
              <input
                className="input-field font-bold"
                value={appName}
                onChange={e => setAppName(e.target.value)}
                placeholder="APP NAME"
              />
            </div>
          </div>

          {/* Box 2: Key Editor */}
          <div className="panel flex-1 min-h-[300px]">
            <KeyEditor
              macro={selectedKeyIndex !== null ? macros[selectedKeyIndex] : null}
              onUpdate={updateMacro}
            />
          </div>

          {/* Box 3: Code Output */}
          <div className="bg-black text-white p-4 font-mono text-xs border border-transparent shadow-card relative">
            <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2">
              <span className="text-gray-400">~/OUTPUT.PY</span>
              <button
                className="text-[10px] bg-white text-black px-2 py-1 uppercase font-bold hover:bg-accent-primary hover:text-white"
                onClick={() => navigator.clipboard.writeText(generatedCode)}
              >
                Copy
              </button>
            </div>
            <textarea
              className="w-full bg-transparent text-gray-300 font-mono resize-none focus:outline-none h-[150px]"
              value={generatedCode}
              readOnly
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-xs font-mono text-muted text-center">
        DESIGNED FOR ADAFRUIT MACROPAD RP2040 // 2026
      </footer>
    </div>
  );
}

export default App;
