import { useEnhancedEffect } from '@app/utils/utils';
import clsx from 'clsx';
import {
    type Dispatch,
    type PropsWithChildren,
    type ReactNode,
    type SetStateAction,
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';

function TruncateDisclosure({ children }) {
    const [truncated, setTruncated] = useState(true);
    const [overflowedContent, setOverflowedContent] = useState(false);

    return (
        <TruncateDisclosureContext.Provider
            value={{ truncated, setTruncated, overflowedContent, setOverflowedContent }}
        >
            {children}
        </TruncateDisclosureContext.Provider>
    );
}

type ContextProps = {
    truncated: boolean;
    setTruncated: Dispatch<SetStateAction<boolean>>;
    overflowedContent: boolean;
    setOverflowedContent: Dispatch<SetStateAction<boolean>>;
};
const TruncateDisclosureContext = createContext<ContextProps>({} as ContextProps);

const SCROLL_THRESHOLD = 1;

const Content = ({ children, className, lines = 1 }: PropsWithChildren<{ className?: string; lines?: number }>) => {
    const { truncated, setTruncated, setOverflowedContent } = useContext(TruncateDisclosureContext);

    const contentMeasureRef = useRef<HTMLDivElement>(null);

    const updateClamped = useCallback(() => {
        if (contentMeasureRef.current) {
            setOverflowedContent(
                contentMeasureRef.current.scrollHeight - contentMeasureRef.current.clientHeight > SCROLL_THRESHOLD
            );
        }
    }, [setOverflowedContent]);

    useEnhancedEffect(() => {
        setTruncated(true);
        window.addEventListener('resize', updateClamped);
        updateClamped();
        return () => window.removeEventListener('resize', updateClamped);
    }, [updateClamped, children, setTruncated]);

    return (
        <div className="relative">
            <div
                className={clsx('absolute top-0 -z-10 line-clamp-1', className)}
                aria-hidden
                style={{ WebkitLineClamp: lines }}
                ref={contentMeasureRef}
            >
                {children}
            </div>
            <div className={clsx(truncated && 'line-clamp-1', className)} style={{ WebkitLineClamp: lines }}>
                {children}
            </div>
        </div>
    );
};

type ToggleProps = {
    showingComponent: ReactNode;
    hidingComponent: ReactNode;
    className?: string;
};
const Toggle = ({ showingComponent, hidingComponent, className }: ToggleProps) => {
    const { truncated, setTruncated, overflowedContent } = useContext(TruncateDisclosureContext);

    if (!overflowedContent) return null;
    return (
        <button className={clsx('block', className)} onClick={() => setTruncated(!truncated)}>
            {truncated ? showingComponent : hidingComponent}
        </button>
    );
};

TruncateDisclosure.Content = Content;
TruncateDisclosure.Toggle = Toggle;

export default TruncateDisclosure;
