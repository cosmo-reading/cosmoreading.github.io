import { useEnhancedEffect, useGenerateImgAttrs } from '@app/utils/utils';
import { Avatar, type AvatarProps } from '@mui/material';
import { type SyntheticEvent, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';

//#region : Main component

/**
 * Custom.
 *
 * Main component parameters type
 */
export type LazyAvatarProps = AvatarProps & {
    height?: number;
    width?: number;
    imageRenderSize: number;
    fallbackImage?: string;
};

/**
 * Custom helper component.
 *
 * Use it to load avatar image with fallback image on - error or while lazy loading.
 * Real image src is only set when the avatar comes in view.
 */
export default function LazyAvatar({
    src,
    height,
    width,
    imageRenderSize,
    fallbackImage,
    imgProps,
    ...rest
}: LazyAvatarProps) {
    //#region : Variables, functions and api calls

    //InView should be triggered only once
    //as we do not want to load the image multiple times
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    //State to keep track of image src
    const [imgSrc, setImgSrc] = useState(fallbackImage);

    //Before rendering, if the image is in view, set the src
    const imgAttributes = useGenerateImgAttrs({
        src: src ?? '',
        layout: 'fill',
        quality: 75,
        width: imageRenderSize * EXPECTED_MAX_PIXEL_DENSITY,
        unoptimized: false,
    });

    useEnhancedEffect(() => {
        if (inView) {
            setImgSrc(imgAttributes.src);
        }
    }, [inView, imgAttributes]);

    //If there was an error loading the image, use the fallback image
    const onImageError = useCallback(
        (e: SyntheticEvent<HTMLImageElement>) => {
            if (fallbackImage) {
                e.currentTarget.src = fallbackImage;
            }
        },
        [fallbackImage]
    );

    //#endregion : Variables, functions and api calls

    return (
        <div ref={ref}>
            <Avatar
                {...rest}
                src={imgSrc}
                onError={onImageError}
                imgProps={{
                    loading: 'lazy',
                    width,
                    height,
                    ...(imgProps || {}),
                }}
            />
        </div>
    );
}
//#endregion : Main component

const EXPECTED_MAX_PIXEL_DENSITY = 3;
