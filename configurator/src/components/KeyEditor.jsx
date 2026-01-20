import React, { useState } from 'react';
import { KEYCODES, CONSUMER_CODES } from '../utils/constants';

const KeyEditor = ({ macro, onUpdate }) => {
    if (!macro) return <div className="h-full flex flex-col items-center justify-center text-muted font-mono text-xs text-center p-8 border-2 border-dashed border-subtle opacity-50">NO KEY SELECTED<br />SELECT A KEY ON THE DEVICE</div>;

    const [actionType, setActionType] = useState('key');
    const [actionValue, setActionValue] = useState('');

    const handleColorChange = (e) => onUpdate({ ...macro, color: e.target.value });
    const handleLabelChange = (e) => onUpdate({ ...macro, label: e.target.value });

    const addAction = () => {
        if (!actionValue && actionType !== 'delay') return;
        const newAction = { type: actionType, value: actionValue };
        onUpdate({ ...macro, sequence: [...macro.sequence, newAction] });
        setActionValue('');
    };

    const removeAction = (index) => {
        const newSeq = [...macro.sequence];
        newSeq.splice(index, 1);
        onUpdate({ ...macro, sequence: newSeq });
    };

    return (
        <div className="flex flex-col h-full">
            <h3>KEY PARAMETERS</h3>

            {/* Row 1: Label & Color */}
            <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
                <div className="input-group">
                    <label className="input-label">OLED LABEL</label>
                    <input
                        className="input-field"
                        value={macro.label}
                        onChange={handleLabelChange}
                        maxLength={10}
                        placeholder="LABEL"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">LED</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            className="input-field p-0"
                            style={{ height: '34px', width: '100%', cursor: 'pointer' }}
                            value={macro.color}
                            onChange={handleColorChange}
                        />
                    </div>
                </div>
            </div>

            {/* Sequence Editor */}
            <h3 className="mt-2">SEQUENCE</h3>
            <div className="flex-1 border border-subtle bg-bg-deep p-2 overflow-y-auto min-h-[120px] mb-4">
                <ul className="flex flex-col gap-1 m-0 p-0 list-none">
                    {macro.sequence.length === 0 && <li className="text-xs font-mono text-muted p-2">EMPTY SEQUENCE</li>}

                    {macro.sequence.map((step, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white border border-subtle p-2 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="bg-black text-white px-1 text-[9px]">{step.type.toUpperCase()}</span>
                                <span>{step.value}</span>
                            </div>
                            <button
                                className="text-red-500 hover:text-black font-bold px-2"
                                onClick={() => removeAction(idx)}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add New Action */}
            <div className="bg-bg-surface p-3 border border-subtle">
                <label className="input-label mb-2 block">APPEND ACTION</label>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <select
                            className="input-field w-1/3"
                            value={actionType}
                            onChange={(e) => { setActionType(e.target.value); setActionValue(''); }}
                        >
                            <option value="key">KEY</option>
                            <option value="text">TEXT</option>
                            <option value="delay">DELAY</option>
                            <option value="consumer">MEDIA</option>
                        </select>

                        <div className="flex-1">
                            {actionType === 'key' && (
                                <select className="input-field w-full" value={actionValue} onChange={e => setActionValue(e.target.value)}>
                                    <option value="">SELECT...</option>
                                    {Object.keys(KEYCODES).map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            )}
                            {actionType === 'consumer' && (
                                <select className="input-field w-full" value={actionValue} onChange={e => setActionValue(e.target.value)}>
                                    <option value="">SELECT...</option>
                                    {Object.keys(CONSUMER_CODES).map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            )}
                            {actionType === 'text' && (
                                <input className="input-field w-full" placeholder="TYPE..." value={actionValue} onChange={e => setActionValue(e.target.value)} />
                            )}
                            {actionType === 'delay' && (
                                <input className="input-field w-full" type="number" step="0.1" placeholder="SEC" value={actionValue} onChange={e => setActionValue(e.target.value)} />
                            )}
                        </div>
                    </div>

                    <button className="btn btn-primary w-full" onClick={addAction}>
                        ADD STEP +
                    </button>
                </div>
            </div>

        </div>
    );
};

export default KeyEditor;
