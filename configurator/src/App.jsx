
import React, { useState, useEffect } from 'react';
import MacroPad from './components/MacroPad';
import KeyEditor from './components/KeyEditor';
import { PRESETS } from './utils/constants';
import { generateCode } from './utils/codeGenerator';

function App() {
  const [appName, setAppName] = useState('My MacroPad');

  // Initialize with empty preset
  const [macros, setMacros] = useState(PRESETS[0].macros);

  const [selectedKeyIndex, setSelectedKeyIndex] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    setGeneratedCode(generateCode(appName, macros));
  }, [macros, appName]);

  const loadPreset = (presetName) => {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      // Deep copy to disconnect from const
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-subtle bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-md">
          <h1>MacroPad<span style={{ color: 'var(--accent-primary)' }}>.Config</span></h1>
          <div className="flex gap-sm ml-8">
            {PRESETS.map(p => (
              <button
                key={p.name}
                className={`btn ${appName === p.name ? 'btn-primary' : ''}`}
                onClick={() => loadPreset(p.name)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group m-0">
          <input
            className="input-field text-lg font-bold"
            value={appName}
            onChange={e => setAppName(e.target.value)}
            placeholder="App Name"
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left: Device Visualizer */}
        <section className="flex-1 flex items-center justify-center bg-deep relative">
          {/* Background decor */}
          <div style={{
            position: 'absolute',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}></div>

          <MacroPad
            macros={macros}
            selectedKeyIndex={selectedKeyIndex}
            onKeySelect={setSelectedKeyIndex}
          />
        </section>

        {/* Right: Tools & Code */}
        <section className="w-[450px] flex flex-col border-l border-subtle bg-panel/30 backdrop-blur">

          {/* Top: Editor */}
          <div className="flex-1 p-6 overflow-y-auto border-b border-subtle">
            <KeyEditor
              macro={selectedKeyIndex !== null ? macros[selectedKeyIndex] : null}
              onUpdate={updateMacro}
            />
          </div>

          {/* Bottom: Code Output */}
          <div className="h-[300px] flex flex-col p-6 bg-black">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-muted text-sm">GENERATED CODE (Python)</h3>
              <button
                className="btn btn-primary py-1 text-xs"
                onClick={() => navigator.clipboard.writeText(generatedCode)}
              >
                Copy
              </button>
            </div>
            <textarea
              className="flex-1 w-full bg-surface border border-subtle text-xs font-mono p-4 rounded text-dim resize-none focus:outline-none focus:border-accent-primary focus:text-main transition-colors"
              value={generatedCode}
              readOnly
            />
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
