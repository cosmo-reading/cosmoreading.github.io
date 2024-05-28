import { ReactComponent as ArrowFilledUpIcon } from '@app/assets/arrow-filled-up.svg';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

type Option<T> = {
    value: T;
    text: string;
};
interface Props<T> {
    options: Option<T>[];
    onChange: (value: Option<T>) => void;
    defaultValue?: T;
    classNames?: object;
}

export default function Select<T extends string | number>({ onChange, defaultValue, options }: Props<T>) {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [selected, setSelected] = useState<Option<T>>(
        () => options.find(option => option.value === defaultValue && defaultValue !== undefined) || options[0]
    );

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const defaultOption = options.find(option => option.value === defaultValue);
        if (defaultOption) {
            setSelected(defaultOption);
        }
    }, [defaultValue, options]);

    useClickAway(ref, () => {
        setIsOpened(false);
    });

    const handleChange = (option: Option<T>) => {
        setIsOpened(false);
        setSelected(option);
        onChange(option);
    };

    return (
        <div
            ref={ref}
            className="relative inline-block rounded-[6px] bg-gray-container-base ring-transparent transition-shadow hover:shadow-md hover:ring-1 hover:ring-inset hover:ring-blue-600"
        >
            <button onClick={() => setIsOpened(prev => !prev)}>
                <div className="font-set-sb14 flex items-center px-[12px] py-[8px] text-gray-t1">
                    {selected.text}
                    <ArrowFilledUpIcon
                        className={clsx('ml-[6px] text-gray-800 dark:text-gray-500', !isOpened && 'rotate-180')}
                    />
                </div>
            </button>

            {isOpened && (
                <div className="absolute top-[calc(100%+8px)] right-0 z-10 w-[160px] rounded-[8px] bg-white py-[4px] shadow-ww-text-container dark:bg-gray-850">
                    <div>
                        {options.map(option => (
                            <div
                                key={option.value}
                                onClick={() => handleChange(option)}
                                className="font-set-sb14 py-[10px] px-[12px] text-gray-t1 hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                                {option.text}
                                {option.value === selected.value && null}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
