// Adapted from https://github.com/vercel/next.js/blob/b05719f928acc70c57c82978a9cb256bd93b0c61/packages/next/client/script.tsx

import { requestIdleCallback } from '@app/utils/request-idle-callback';
import type React from 'react';
import { type ScriptHTMLAttributes, useEffect } from 'react';

const ScriptCache = new Map();
const LoadCache = new Set();

export const DOMAttributeNames: Record<string, string> = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule',
};

export interface Props extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'afterInteractive' | 'lazyOnload';
    id?: string;
    onLoad?: () => void;
    onError?: () => void;
    children?: React.ReactNode;
    container?: HTMLElement;
}

export interface UseScriptOptions {
    strategy?: 'afterInteractive' | 'lazyOnload';
    id?: string;
    container?: HTMLElement;
    onLoad?: () => void;
    onError?: () => void;
}

const ignoreProps = ['onLoad', 'dangerouslySetInnerHTML', 'children', 'onError', 'strategy', 'container'];

export const loadScript = (props: Props): void => {
    const { src, id, onLoad = () => {}, dangerouslySetInnerHTML, children = '', container, onError } = props;

    const cacheKey = id || src;
    if (ScriptCache.has(src)) {
        if (!LoadCache.has(cacheKey)) {
            LoadCache.add(cacheKey);
            // Execute onLoad since the script loading has begun
            ScriptCache.get(src).then(onLoad, onError);
        }
        return;
    }

    const el = document.createElement('script');

    const loadPromise = new Promise<void>((resolve, reject) => {
        el.addEventListener('load', () => {
            resolve();
            if (onLoad) {
                onLoad();
            }
        });
        el.addEventListener('error', () => {
            reject();
            if (onError) {
                onError();
            }
        });
    }).catch(() => {});

    if (src) {
        ScriptCache.set(src, loadPromise);
        LoadCache.add(cacheKey);
    }

    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
    } else if (src) {
        el.src = src;
    }

    for (const [k, value] of Object.entries(props)) {
        if (value === undefined || ignoreProps.includes(k)) {
            continue;
        }

        const attr = DOMAttributeNames[k] || k.toLowerCase();
        el.setAttribute(attr, value);
    }

    if (container) {
        container.appendChild(el);
    } else {
        document.body.appendChild(el);
    }
};

export function loadLazyScript(props: Props) {
    if (document.readyState === 'complete') {
        requestIdleCallback(() => loadScript(props));
    } else {
        window.addEventListener('load', () => {
            requestIdleCallback(() => loadScript(props));
        });
    }
}

function Script(props: Props): JSX.Element | null {
    const { strategy = 'afterInteractive' } = props;

    useEffect(() => {
        if (strategy === 'afterInteractive') {
            loadScript(props);
        } else if (strategy === 'lazyOnload') {
            loadLazyScript(props);
        }
    }, [props, strategy]);

    return null;
}

export function useScript({ id, strategy = 'afterInteractive', ...rest }: UseScriptOptions) {
    const isBrowser = typeof window !== 'undefined';

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        if (strategy === 'afterInteractive') {
            loadScript({ ...rest, id });
        } else if (strategy === 'lazyOnload') {
            loadLazyScript({ ...rest, id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isBrowser, strategy]);
}

export default Script;
