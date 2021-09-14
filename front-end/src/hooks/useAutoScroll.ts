import React, { useCallback, useLayoutEffect, useRef } from 'react';


export interface AutoScrollOptions {
    scrollBehaviour?: ScrollToOptions['behavior'];
}

export const useAutoScroll = <C extends HTMLElement>(containerRef: React.RefObject<C>, deps: unknown[], {
    scrollBehaviour = 'smooth',
}: AutoScrollOptions = {}) => {
    const scrolledBottomRef = useRef<boolean | undefined>();

    useLayoutEffect(() => {
        if (deps === undefined || !containerRef.current) {
            return;
        }

        const scrollTop = containerRef.current.scrollHeight - containerRef.current.clientHeight;

        if (scrolledBottomRef.current === undefined) {
            containerRef.current.scrollTo({ top: scrollTop, behavior: 'auto' });
            scrolledBottomRef.current = true;
        } else if (scrolledBottomRef.current) {
            containerRef.current.scrollTo({ top: scrollTop, behavior: scrollBehaviour });
        }
    }, [containerRef, deps, scrollBehaviour]);

    return useCallback(({ currentTarget: { scrollTop, scrollHeight, clientHeight } }: React.UIEvent) => {
        scrolledBottomRef.current = scrollTop > scrollHeight - clientHeight - 10;
    }, []);
};
