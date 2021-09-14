import React from 'react';
import { cn } from '@bem-react/classname';

import { Field } from '../../api/data/Battle';

import './BattleField.css';


export interface BattleFieldProps {
    className?: string;
    field: Field;
    onCellClick?: (x: number, y: number) => void;
}

const cnBattleField = cn('BattleField');

export const BattleField: React.FC<BattleFieldProps> = ({ className, field, onCellClick }) => (
    <div className={cnBattleField(null, [className])}>
        {field.map((row, rowIdx) => (
            <div key={rowIdx} className={cnBattleField('Row')}>
                {row.map((cell, idx) => (
                    <button key={`${idx}_${rowIdx}`} className={cnBattleField('Cell', { type: cell, active: onCellClick !== undefined })}
                            onClick={() => onCellClick && onCellClick(idx, rowIdx)}/>
                ))}
            </div>
        ))}
    </div>
);