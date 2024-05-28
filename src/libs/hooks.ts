import { useIsMounted } from '@app/libs/utils';
import { isBrowser } from '@app/utils/utils';
import dayjs from 'dayjs';
import { EventEmitter } from 'eventemitter3';
import { deepEqual } from 'fast-equals';
import produce, { type Draft } from 'immer';
import type React from 'react';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

type LocalStorageState<T> = T & {
    expiration?: Date;
};

type LocalStorageType<T> = T extends object ? T : T extends string ? T : T extends boolean ? T : never;

export type Updater<T> = (draft: Draft<T>) => void;

const emitter = new EventEmitter();

/**
 * Custom hook.
 *
 * Use it instead of react 'useLocalStorage'
 * when you want to save the state of the local storage.
 *
 * React 'useLocalStorage' has a bug that does not save the state of the localstorage.
 */
export const useLocalStorage = <T>(key: string, defaultValue: T, options?: { sync?: boolean; expiration?: number }) => {
    const { sync, expiration } = options || {};

    const target = isBrowser() ? window : null;

    const loaded = useIsMounted();

    const getValue = () => {
        const json = target?.localStorage.getItem(key) ?? 'null';

        let newValue = JSON.parse(json);

        if (newValue && newValue.expiration && dayjs().add(newValue.expiration, 'minute').toDate() < new Date()) {
            newValue = defaultValue;
        }

        return (newValue ?? defaultValue) as T;
    };

    const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
        const storageValue = { value: getValue() };

        return [
            cb => {
                const listener = (e: StorageEvent) => {
                    const newVal = getValue();
                    if (e.key === key && !deepEqual(storageValue.value, newVal)) {
                        storageValue.value = newVal;

                        cb();
                    }
                };

                if (sync) {
                    target?.addEventListener('storage', listener);
                } else {
                    emitter.addListener('storage', listener);
                }

                return () => {
                    if (sync) {
                        target?.removeEventListener('storage', listener);
                    } else {
                        emitter.removeListener('storage', listener);
                    }
                };
            },
            () => storageValue.value,
            () => defaultValue,
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const updateState = useCallback(
        (recipe: LocalStorageType<T> | Updater<T> | null) => {
            let newState =
                typeof recipe === 'function' ? produce<T>((state ?? defaultValue) as T, recipe as any) : recipe;

            if (typeof expiration !== 'undefined') {
                newState = produce(newState, (draft: LocalStorageState<T>) => {
                    draft.expiration = dayjs().add(expiration, 'minute').toDate();
                });
            }

            if (newState) {
                target?.localStorage.setItem(key, JSON.stringify(newState));
            } else {
                target?.localStorage.removeItem(key);
            }

            emitter.emit('storage', { key });
        },
        [defaultValue, expiration, key, state, target?.localStorage]
    );

    const remove = useCallback(() => {
        target?.localStorage.removeItem(key);

        emitter.emit('storage', defaultValue);
    }, [defaultValue, key, target?.localStorage]);

    return [state, updateState, remove, loaded] as const;
};

export const useCompareMemo = <T>(next: () => T, deps: [...any[]]): T => {
    const [obj, setObj] = useState<T>(() => next());

    const previousRef = useRef(deps);

    useEffect(() => {
        const previous = previousRef.current;
        const isEqual = deepEqual(previous, deps);

        if (!isEqual) {
            previousRef.current = deps;

            setObj(next());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    return obj;
};

type ScrollTriggerOptions = {
    getTrigger?: (store: React.MutableRefObject<number | undefined>, options: any) => boolean;
    target?: Element | Window;
    threshold?: number;
};

function defaultTrigger(store: React.MutableRefObject<number | undefined>, options: any) {
    const { disableHysteresis = false, threshold = 100, target } = options;
    const previous = store.current!;

    const newValue = target
        ? target.pageYOffset !== undefined
            ? target.pageYOffset
            : target.scrollTop
        : store.current;

    store.current = newValue;

    if (!disableHysteresis && previous !== undefined) {
        if (newValue < previous) {
            return false;
        }
    }

    return newValue > threshold;
}

export function useScrollTrigger(options?: ScrollTriggerOptions) {
    const { getTrigger = defaultTrigger, target = isBrowser() ? window : null, ...other } = options || {};

    const store = useRef<number | undefined>();
    const [trigger, setTrigger] = useState(() => getTrigger(store, other));

    useEffect(() => {
        const handleScroll = () => {
            const trigger = getTrigger(store, { target, ...other });

            startTransition(() => setTrigger(trigger));
        };

        handleScroll(); // Re-evaluate trigger when dependencies change

        target?.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            target?.removeEventListener('scroll', handleScroll);
        };
        // See Option 3. https://github.com/facebook/react/issues/14476#issuecomment-471199055
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, getTrigger, JSON.stringify(other)]);

    return trigger;
}
