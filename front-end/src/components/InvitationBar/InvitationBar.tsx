import React, { useCallback } from 'react';
import { cn } from '@bem-react/classname';

import { useInvitation } from '../../hooks/queries/useInvitation';
import { useAcceptInvitation } from '../../hooks/mutation/useAcceptInvitation';
import { useRejectInvitation } from '../../hooks/mutation/useRejectInvitation';

import './InvitationBar.css';


export interface InvitationBarProps {
    className?: string;
}

const cnInvitationBar = cn('InvitationBar');

export const InvitationBar: React.FC<InvitationBarProps> = ({ className }) => {
    const { invitation } = useInvitation();

    const acceptInvitation = useAcceptInvitation();
    const rejectInvitation = useRejectInvitation();

    const onAccept = useCallback(() => acceptInvitation(), [acceptInvitation]);
    const onReject = useCallback(() => rejectInvitation(), [rejectInvitation]);

    return (
        <div className={cnInvitationBar(null, [className])}>
            {invitation && (
                <div className={cnInvitationBar('Invitation')}>
                    <div className={cnInvitationBar('Text')}>Игрок {invitation?.from} вызывает Вас на бой!</div>
                    <div className={cnInvitationBar('Buttons')}>
                        <button className={cnInvitationBar('ButtonCheckmark')} onClick={onAccept} />
                        <button className={cnInvitationBar('ButtonCross')} onClick={onReject} />
                    </div>
                </div>
            )}
        </div>
    );
};