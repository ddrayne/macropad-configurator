import React, { useState } from 'react';
import { KEYCODES, CONSUMER_CODES } from '../utils/constants';

const KeyEditor = ({ macro, onUpdate }) => {
    if (!macro) return <div className="panel flex items-center justify-center p-8 text-muted">Select a key to edit</div>;

    const [actionType, setActionType] = useState('key');
    const [actionValue, setActionValue] = useState('');

    const handleColorChange = (e) => onUpdate({ ...macro, color: e.target.value });
    const handleLabelChange = (e) => onUpdate({ ...macro, label: e.target.value });

    const addAction = () => {
        if (!actionValue && actionType !== 'delay') return; // Delay might default

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
        <div className="panel flex flex-col gap-md h-full">
            <h3>Key Properties</h3>

            {/* Label and Color Row */}
            <div className="flex gap-md">
                <div className="input-group flex-1">
                    <label className="input-label">Label (OLED)</label>
                    <input
                        className="input-field"
                        value={macro.label}
                        onChange={handleLabelChange}
                        maxLength={10}
                        placeholder="Ex. COPY"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">LED Color</label>
                    <input
                        type="color"
                        className="input-field"
                        style={{ height: '38px', width: '50px', padding: 0, cursor: 'pointer' }}
                        value={macro.color}
                        onChange={handleColorChange}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Sequence (Executed in order)</label>
                <div className="sequence-list flex flex-col gap-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {macro.sequence.length === 0 && <span className="text-muted text-sm italic">No actions defined</span>}

                    {macro.sequence.map((step, idx) => (
                        <div key={idx} className="sequence-item flex justify-between items-center p-2 bg-surface rounded">
                            <span className="font-mono text-sm">
                                <span className="text-dim mr-2 uppercase">{step.type}</span>
                                {step.value}
                            </span>
                            <button className="btn-icon text-red-500 hover:text-red-400" onClick={() => removeAction(idx)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="add-action-box p-4 bg-surface rounded border border-subtle flex flex-col gap-sm">
                <label className="input-label">Add Action</label>
                <div className="flex gap-sm">
                    <select
                        className="input-field"
                        value={actionType}
                        onChange={(e) => { setActionType(e.target.value); setActionValue(''); }}
                    >
                        <option value="key">Key Press</option>
                        <option value="text">Type Text</option>
                        <option value="delay">Delay (sec)</option>
                        <option value="consumer">Media/Control</option>
                    </select>

                    {/* Dynamic Input based on Type */}
                    {actionType === 'key' && (
                        <select className="input-field flex-1" value={actionValue} onChange={e => setActionValue(e.target.value)}>
                            <option value="">Select Key...</option>
                            {Object.keys(KEYCODES).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    )}
                    {actionType === 'consumer' && (
                        <select className="input-field flex-1" value={actionValue} onChange={e => setActionValue(e.target.value)}>
                            <option value="">Select Control...</option>
                            {Object.keys(CONSUMER_CODES).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    )}
                    {actionType === 'text' && (
                        <input className="input-field flex-1" placeholder="String to type..." value={actionValue} onChange={e => setActionValue(e.target.value)} />
                    )}
                    {actionType === 'delay' && (
                        <input className="input-field flex-1" type="number" step="0.1" placeholder="0.1" value={actionValue} onChange={e => setActionValue(e.target.value)} />
                    )}
                </div>
                <button className="btn btn-primary w-full" onClick={addAction}>Add to Sequence</button>
            </div>

        </div>
    );
};

export default KeyEditor;
