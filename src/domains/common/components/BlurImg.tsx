import { ReactComponent as DefaultFallback } from '@app/assets/generic-cover.svg';
import type { ImageProps } from '@app/components/image';
import BlurComponent from '@app/domains/common/components/BlurComponent';
import type { BlurHashOptions } from '@app/domains/common/hooks/useBlurhash';
import { batch } from '@app/libs/utils';
import {
    type GenImgAttrsResult,
    type LayoutValue,
    getIntForImg,
    isBrowser,
    useGenerateImgAttrs,
} from '@app/utils/utils';
import { startTransition, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { twMerge } from 'tailwind-merge';

//#region : Helper functions

const DefaultWidth = 16;
const DefaultHeight = 16;

//#endregion : Helper functions

//#region : Main component

/** Custom. Main component parameters type */
export type BlurImgProps = ImageProps & {
    blurHash?: string | null;
    blurHashOptions?: BlurHashOptions;
    className?: string;
    innerClassName?: string;
    width: number;
    height: number;
    priority?: boolean;
    layout?: LayoutValue;
    quality?: number;
    unoptimized?: boolean;
};

const LazySupported = isBrowser() && 'loading' in document.createElement('img');

const defaultImgAttributes: GenImgAttrsResult = {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    srcSet: undefined,
    sizes: undefined,
};

const FallbackCover = ({ className }: { className?: string }) => {
    return (
        <div className={twMerge('h-full w-full bg-[#e6e6e6] dark:bg-gray-850', className)}>
            <DefaultFallback className="scale-[0.3] fill-current text-white" width="100%" height="100%" />
        </div>
    );
};

/**
 * Custom helper component.
 *
 * Lazy loads an image and shows it's blurhash (if provided) in place of the image while it loads.
 */
export default function BlurImg({
    blurHash,
    style,
    src,
    alt,
    fallbackImage,
    width,
    height,
    blurHashOptions,
    className,
    innerClassName,
    priority,
    quality,
    sizes,
    layout,
    lazy,
    unoptimized,
    ...rest
}: BlurImgProps) {
    layout = layout || (sizes ? 'responsive' : 'intrinsic');

    const {
        width: blurWidth,
        height: blurHeight,
        punch,
    } = blurHashOptions || {
        width: DefaultWidth,
        height: DefaultHeight,
    };

    const [ref, inView] = useInView({
        triggerOnce: true,
        skip: LazySupported,
    });

    const [imgLoaded, setImgLoaded] = useState(LazySupported || !isBrowser());
    const [error, setError] = useState(false);

    const handleImageLoad = useCallback(() => {
        setImgLoaded(true);
    }, []);

    const setImgRef = (img: HTMLImageElement) => {
        startTransition(() => {
            if (img && !img.complete) {
                setImgLoaded(false);
            } else if (img?.complete) {
                setImgLoaded(true);
            }
        });
    };

    //If there was an error loading the image, use the fallback image
    const handleImageError = useCallback(() => {
        batch(() => {
            setImgLoaded(true);
            setError(true);
        });
    }, []);

    const isVisible = inView || imgLoaded || LazySupported || !isBrowser();

    let imgAttributes = useGenerateImgAttrs({
        src: src ?? fallbackImage!,
        layout,
        quality: quality ?? 75,
        width: getIntForImg(width),
        unoptimized: unoptimized ?? false,
    });

    if (!isVisible) {
        imgAttributes = defaultImgAttributes;
    }

    if (error) {
        imgAttributes.src = fallbackImage!;
    }

    return (
        <>
            {priority ? (
                // Note how we omit the `href` attribute, as it would only be relevant
                // for browsers that do not support `imagesrcset`, and in those cases
                // it would likely cause the incorrect image to be preloaded.
                //
                // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
                <Helmet>
                    <link
                        key={'__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes}
                        rel="preload"
                        as="image"
                        href={imgAttributes.src}
                        imageSrcSet={imgAttributes.srcSet}
                        imageSizes={imgAttributes.sizes}
                    />
                </Helmet>
            ) : null}
            <div ref={ref} {...rest} className={className} style={{ width, height, willChange: 'auto' }}>
                {isVisible && !error ? (
                    <div className="relative">
                        <img
                            ref={setImgRef}
                            style={{
                                ...style,
                                width,
                                height,
                                maxWidth: 'none',
                                display: isVisible ? 'inline-block' : 'none',
                            }}
                            className={twMerge('overflow-hidden whitespace-nowrap indent-[100%]', innerClassName)}
                            width={width}
                            height={height}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            alt={alt}
                            loading={lazy ? 'lazy' : undefined}
                            {...imgAttributes}
                        />
                        {!imgLoaded && blurHash ? (
                            <BlurComponent
                                entry={{
                                    hash: blurHash,
                                    options: {
                                        height: blurHeight,
                                        width: blurWidth,
                                        punch,
                                    },
                                }}
                                width={width}
                                height={height}
                            />
                        ) : !imgLoaded ? (
                            <FallbackCover className={twMerge('absolute top-0 left-0', innerClassName)} />
                        ) : null}
                    </div>
                ) : error || (!imgLoaded && !blurHash) ? (
                    <FallbackCover className={innerClassName} />
                ) : undefined}
            </div>
        </>
    );
}
//#endregion : Main component
