import { checkTypesByKeys } from '../../utils/checkTypesByKeys';
import { isUser, User } from './User';
import { isArrayOf } from '../../utils/isArrayOf';

export enum BattleStage {
    ARRANGEMENT = 'ARRANGEMENT',
    BATTLE = 'BATTLE',
    END = 'END',
}

export enum CellState {
    EMPTY = 'EMPTY',
    SHIP = 'SHIP',
    MISS = 'MISS',
    SHOT = 'SHOT',
}

export enum StepStatus {
    MISS = 'MISS',
    SHOT = 'SHOT',
}

export type FieldRow = [CellState, CellState, CellState, CellState, CellState,
                        CellState, CellState, CellState, CellState, CellState];

export type Field = [FieldRow, FieldRow, FieldRow, FieldRow, FieldRow,
                    FieldRow, FieldRow, FieldRow, FieldRow, FieldRow];

export interface Step {
    username: string;
    x: number;
    y: number;
    status: StepStatus;
}

export interface Battle {
    stage: BattleStage;
    myField: Field;
    enemyField: Field;
    enemy: User;
    whoseTurn: string;
    playerCommitted: boolean;
    stepsHistory: Step[];
}

export const isBattle = (battle: unknown): battle is Battle => {
    if (typeof battle !== 'object' || battle === null) {
        return false;
    }

    if (!checkTypesByKeys(battle, {
        stage: 'string',
        myField: 'object',
        enemyField: 'object',
        enemy: 'object',
        whoseTurn: 'string',
        playerCommitted: 'boolean',
        stepsHistory: 'object',
    })) {
        return false;
    }

    if (!isUser(battle.enemy)) {
        return false;
    }

    if (!isField(battle.myField) || !isField(battle.enemyField)) {
        return false;
    }

    if (!isArrayOf(battle.stepsHistory, isStep)) {
        return false;
    }

    return true;
};

export const isCellState = (cell: unknown): cell is CellState =>
    typeof cell === 'string' && Object.keys(CellState).includes(cell);

const isFieldRow = (row: unknown): row is FieldRow => isArrayOf(row, isCellState);
export const isField = (field: unknown): field is Field => isArrayOf(field, isFieldRow);

export const isStep = (step: unknown): step is Step => {
    if (typeof step !== 'object' || step === null) {
        return false;
    }

    if (!checkTypesByKeys(step, {
        username: 'string',
        x: 'number',
        y: 'number',
        status: 'string',
    })) {
        return false;
    }

    return Object.keys(StepStatus).includes(step.status as string);
};