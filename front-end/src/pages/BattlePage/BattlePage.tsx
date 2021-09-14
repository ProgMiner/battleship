import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@bem-react/classname';
import { useQueryClient } from 'react-query';

import { AuthenticatedGuard } from '../../components/guards/AuthenticatedGuard';
import { Page } from '../../components/Page';
import { GlobalLayout } from '../../layouts/GlobalLayout/GlobalLayout';
import { BattleField } from '../../components/BattleField/BattleField';
import { useCurrentBattle } from '../../hooks/queries/useCurrentBattle';
import { BattleStage, StepStatus } from '../../api/data/Battle';
import { useMe } from '../../hooks/queries/useMe';
import { useCellChanging } from '../../hooks/mutation/useCellChanging';
import { useShotCell } from '../../hooks/mutation/useShotCell';
import { useCommitArrangement } from '../../hooks/mutation/useCommitArrangement';
import { ApiError } from '../../api/ApiError';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { QueryKey } from '../../queryClient';

import './BattlePage.css';


export interface BattlePageProps {
    className?: undefined;
}

const cnBattlePage = cn('BattlePage');

export const BattlePage: React.FC<BattlePageProps> = ({ className }) => {
    const { battle } = useCurrentBattle();
    const { me } = useMe();

    const changeCell = useCellChanging();

    const [error, setError] = useState('');

    const onMeCellClick = useCallback(async (x: number, y: number) => {
        try {
            await changeCell(x, y);
            setError('');
        } catch (e) {
            if (e instanceof ApiError) {
                setError(e.msg);
            }
        }
    }, [changeCell]);


    const commitArrangement = useCommitArrangement();

    const onCommitClick = useCallback(async () => {
        try {
            await commitArrangement();
            setError('');
        } catch (e) {
            if (e instanceof ApiError) {
                setError(e.msg);
            }
        }
    }, [commitArrangement]);


    const shotCell = useShotCell();

    const onEnemyCellClick = useCallback(async (x: number, y: number) => {
        try {
            await shotCell(x, y);
            setError('');
        } catch (e) {
            if (e instanceof ApiError) {
                setError(e.msg);
            }
        }
    }, [shotCell]);

    const queryClient = useQueryClient();
    useEffect(() => () => {
        if (battle?.stage === BattleStage.END) {
            queryClient.removeQueries(QueryKey.CURRENT_BATTLE);
        }
    }, [battle?.stage, queryClient]);

    const historyRef = React.useRef<HTMLDivElement>(null);
    const onHistoryScroll = useAutoScroll(historyRef, [battle?.stepsHistory], { scrollBehaviour: 'auto' });

    return (
        <AuthenticatedGuard redirectUrl="/login">
            <Page className={cnBattlePage(null, [className])} title="поле боя">
                <GlobalLayout className={cnBattlePage('Layout')}>
                    {battle === undefined || me === undefined ? (
                        <div className={cnBattlePage('Loading')}>
                            Загрузка...
                        </div>
                    ) : battle === null ? (
                        <div className={cnBattlePage('Loading')}>
                            Чтобы начать бой с другим игроком,
                            кликните по его иконке в чате правой кнопкой мыши и нажмите "вызвать на бой"
                        </div>
                    ) : (
                        <>
                            <div className={cnBattlePage('BattleFields')}>
                                <div className={cnBattlePage('BattleFieldContainer')}>
                                    <div className={cnBattlePage('PlayerInfo')}>
                                        <div><strong>{battle.enemy.username}</strong></div>
                                        <div>счёт: {battle.enemy.score}, победы: {battle.enemy.wins}, поражения: {battle.enemy.loses}</div>
                                    </div>

                                    <BattleField field={battle.enemyField}
                                                 onCellClick={battle.stage === BattleStage.BATTLE
                                                 && battle.whoseTurn === 'ME' ? onEnemyCellClick : undefined} />
                                </div>

                                <div className={cnBattlePage('BattleFieldContainer')}>
                                    <div className={cnBattlePage('PlayerInfo')}>
                                        <div><strong>Вы</strong></div>
                                        <div>счёт: {me.score}, победы: {me.wins}, поражения: {me.loses}</div>
                                    </div>

                                    <BattleField field={battle.myField}
                                                 onCellClick={battle.stage === BattleStage.ARRANGEMENT
                                                    && !battle.playerCommitted
                                                    ? onMeCellClick : undefined} />
                                </div>
                            </div>

                            <div className={cnBattlePage('RightPart')}>
                                <div className={cnBattlePage('RightPartTop')}>
                                    {battle.stage === BattleStage.ARRANGEMENT && !battle.playerCommitted && (
                                        <>расставьте корабли</>
                                    )}
                                </div>

                                <div className={cnBattlePage('RightPartCenter')}>
                                    {battle.stage === BattleStage.ARRANGEMENT && (battle.playerCommitted ? (
                                        <>ожидание соперника</>
                                    ) : (
                                        <button className={cnBattlePage('ConfirmButton')} onClick={onCommitClick}>
                                            подтвердить
                                        </button>
                                    ))}

                                    {(battle.stage === BattleStage.BATTLE || battle.stage === BattleStage.END) && (
                                        <div ref={historyRef} className={cnBattlePage('StepsHistory')} onScroll={onHistoryScroll}>
                                            <div className={cnBattlePage('Step', { meta: true })}>игра началась</div>

                                            {battle.stepsHistory.map((step, index) => (
                                                <div key={index} className={cnBattlePage('Step', { shot: step.status === StepStatus.SHOT })}>
                                                    {step.username} : {step.x};{step.y} {step.status === StepStatus.SHOT ? 'попал' : 'мимо'}
                                                </div>
                                            ))}

                                            {battle.stage === BattleStage.BATTLE && (
                                                <div className={cnBattlePage('Step', { meta: true })}>
                                                    {battle.whoseTurn === 'ME' ? (
                                                        <>сейчас Ваш ход</>
                                                    ) : (
                                                        <>сейчас ход соперника</>
                                                    )}
                                                </div>
                                            )}

                                            {battle.stage === BattleStage.END && (
                                                <div className={cnBattlePage('Step', { meta: true })}>игра окончена</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={cnBattlePage('RightPartBottom')}>
                                    {error && (
                                        <div className={cnBattlePage('Error')}>
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </GlobalLayout>
            </Page>
        </AuthenticatedGuard>
    );
};