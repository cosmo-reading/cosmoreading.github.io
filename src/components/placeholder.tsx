import { Skeleton, type SkeletonProps } from '@mui/material';
import * as React from 'react';
import { type ReactNode, useMemo } from 'react';

//#region : Helper local function components to reduce main component code length

/** Custom. PlaceholderComponentItem parameters type */
type PlaceholderItemProps = {
    index: number;
    style?: React.CSSProperties;
    skeletonProps?: SkeletonProps | ((idx: number) => SkeletonProps);
    children?: React.ReactNode;
    className?: string;
};

/**
 * Custom.
 *
 * Wraps children in material ui Skeleton component
 */
const PlaceholderComponentItem = ({ skeletonProps, index, children, style, ...rest }: PlaceholderItemProps) => {
    const skeletonPropsMemo = useMemo(() => {
        return typeof skeletonProps === 'function' ? skeletonProps(index) : skeletonProps;
    }, [index, skeletonProps]);

    return (
        <Skeleton style={style} {...skeletonPropsMemo} {...rest}>
            {children}
        </Skeleton>
    );
};

//#endregion : Helper local function components to reduce main component code length

//#region : Main component

/** Custom. Main component parameters type */
export type PlaceholderProps<T = any> = {
    item: T;
    style?: React.CSSProperties;
    skeletonProps?: SkeletonProps | ((idx: number) => SkeletonProps);
    count?: number;
    children?: ReactNode;
    className?: string;
};

/**
 * Custom helper component.
 *
 * Use it when you want to show Material ui Skeleton component till the given object(s) is/are null.
 */
function PlaceholderComponent<T>({ item, skeletonProps, count, style, children, ...rest }: PlaceholderProps<T>) {
    const items = useMemo(() => {
        return Array(count || 1).fill(null);
    }, [count]);

    const childElements = useMemo(() => {
        return React.Children.toArray(children);
    }, [children]);

    //item is null, return Skeleton
    if (!item) {
        if (items.length === 1) {
            return (
                <PlaceholderComponentItem {...rest} style={style} index={0} skeletonProps={skeletonProps}>
                    {children}
                </PlaceholderComponentItem>
            );
        }

        return (
            <div className="flex flex-col">
                {items.map((k, idx) => (
                    <PlaceholderComponentItem
                        {...rest}
                        style={style}
                        key={idx}
                        index={idx}
                        skeletonProps={skeletonProps}
                    >
                        {childElements[idx]}
                    </PlaceholderComponentItem>
                ))}
            </div>
        );
    }

    //Item is not null. Return the children
    return <React.Fragment>{children}</React.Fragment>;
}

/**
 * Custom helper component.
 *
 * Use it when you want to show Material ui Skeleton component till the given object(s) is/are null.
 */
export default PlaceholderComponent;
//#endregion : Main component
