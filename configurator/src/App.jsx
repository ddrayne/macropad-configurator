
import React, { useState, useEffect } from 'react';
import MacroPad from './components/MacroPad';
import KeyEditor from './components/KeyEditor';
import PRESETS_DATA from './utils/presets.json';
import { generateCode } from './utils/codeGenerator';

const PRESETS = [
  { name: "Empty", macros: Array(12).fill(null).map(() => ({ color: "#000000", label: "", sequence: [] })) },
  ...PRESETS_DATA
];

function App() {
  const [appName, setAppName] = useState('My MacroPad');
  const [macros, setMacros] = useState(PRESETS[0].macros);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCode, setShowCode] = useState(false);

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

  const downloadPyFile = () => {
    const blob = new Blob([generatedCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-16 bg-bg-deep">

      {/* Top Bar: Title & Presets */}
      <header className="w-full max-w-[1200px] mb-12 flex justify-between items-center px-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-text-main">MacroPad Configurator</h1>
          <span className="text-sm text-muted font-medium mt-1">RP2040 // FLUID STUDIO</span>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="input-field w-[200px] cursor-pointer"
            value={appName}
            onChange={(e) => loadPreset(e.target.value)}
          >
            {PRESETS.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Control Center */}
      <main className="flex gap-12 items-start justify-center w-full max-w-[1400px] px-8">

        {/* Left Column: The Device */}
        <div className="flex flex-col gap-6 items-center">
          <div className="p-12 bg-white rounded-[32px] shadow-float border border-border-strong relative">
            <div className="absolute top-6 left-8 text-xs font-bold text-gray-200 tracking-widest pointer-events-none">
              HARDWARE
            </div>
            <MacroPad
              macros={macros}
              selectedKeyIndex={selectedKeyIndex}
              onKeySelect={setSelectedKeyIndex}
            />
          </div>
        </div>

        {/* Right Column: Configuration & Code */}
        <div className="w-[400px] flex flex-col gap-8">

          {/* Box 1: App Settings */}
          <div className="panel">
            <h3>GLOBAL SETTINGS</h3>
            <div className="input-group m-0 mt-4">
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
          <div className="panel flex-1 min-h-[400px] flex flex-col">
            <KeyEditor
              macro={selectedKeyIndex !== null ? macros[selectedKeyIndex] : null}
              onUpdate={updateMacro}
            />
          </div>

          {/* Box 3: Download / Code Toggle */}
          <div className="flex flex-col gap-3">
            <button
              className="btn btn-primary w-full py-4 text-base"
              onClick={downloadPyFile}
            >
              Download .py File
            </button>

            <button
              className="btn w-full text-xs opacity-70"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide Code Preview' : 'Show Code Preview'}
            </button>

            {showCode && (
              <div className="bg-text-main text-white p-6 rounded-[16px] font-mono text-xs shadow-card relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                  <span className="text-gray-400 font-bold">~/OUTPUT.PY</span>
                  <button
                    className="text-[10px] bg-white text-black px-3 py-1 rounded-sm uppercase font-bold hover:bg-accent-primary hover:text-white transition-colors"
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
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 text-xs font-mono text-muted text-center pb-8 opacity-50">
        DESIGNED FOR ADAFRUIT MACROPAD RP2040 // 2026
      </footer>
    </div>
  );
}

export default App;
