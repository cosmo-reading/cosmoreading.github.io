import { Children, type ReactNode, isValidElement } from 'react';

export const findChildByTypeNames = (children: ReactNode, typeNames: string[]) => {
    const childrenArray = Children.toArray(children);
    const targetIdxList: number[] = [];

    const results = typeNames.map(typeName => {
        const targetIdx = childrenArray.findIndex(child => {
            return isValidElement(child) && child.type && (child.type as any).typeName === typeName;
        });
        if (targetIdx > -1) {
            targetIdxList.push(targetIdx);
            return childrenArray[targetIdx];
        }
    });
    const remains = childrenArray.filter((_, idx) => !targetIdxList.includes(idx));

    return [...results, ...remains];
};
