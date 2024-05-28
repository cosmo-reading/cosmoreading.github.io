import { ReactComponent as DefaultFallback } from '@app/assets/generic-cover.svg';
import type { ImageProps } from '@app/components/image';
import BlurComponent from '@app/domains/common/components/BlurComponent';
import type { BlurHashOptions } from '@app/domains/common/hooks/useBlurhash';
import { ABSOLUTE_FULL } from '@app/domains/common/styles';
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

type Props = ImageProps & {
    blurHash?: string | null;
    blurHashOptions?: BlurHashOptions;
    className?: string;
    innerClassName?: string;
    width?: number;
    height?: number;
    srcWidth: number;
    srcHeight: number;
    priority?: boolean;
    layout?: LayoutValue;
    quality?: number;
    unoptimized?: boolean;
};

/**
 * almost same as common/components/BlurImg.
 * layout:fill did not work as desired, so components were separately designed to fit the size of the parent.
 * TODO: COZE: refactor with syncing BlurImg
 */

export default function NovelBlurImg({
    blurHash,
    style,
    src,
    alt,
    fallbackImage,
    width,
    height,
    srcWidth,
    srcHeight,
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
}: Props) {
    layout = layout || (sizes ? 'responsive' : 'intrinsic');

    const {
        width: blurWidth,
        height: blurHeight,
        punch,
    } = blurHashOptions || {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
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
            <div ref={ref} {...rest} className={className} style={{ willChange: 'auto' }}>
                {isVisible && !error ? (
                    <>
                        <img
                            ref={setImgRef}
                            style={{
                                ...style,
                                display: isVisible ? 'inline-block' : 'none',
                            }}
                            width={width}
                            height={height}
                            className={twMerge(
                                ABSOLUTE_FULL,
                                'overflow-hidden whitespace-nowrap object-cover indent-[100%]',
                                innerClassName
                            )}
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
                                width={width || srcWidth}
                                height={height || srcHeight}
                                fitsToParent
                            />
                        ) : !imgLoaded ? (
                            <FallbackCover className={innerClassName} />
                        ) : null}
                    </>
                ) : error || (!imgLoaded && !blurHash) ? (
                    <FallbackCover className={innerClassName} />
                ) : undefined}
            </div>
        </>
    );
}

const DEFAULT_WIDTH = 16;
const DEFAULT_HEIGHT = 16;

const LazySupported = isBrowser() && 'loading' in document.createElement('img');

const defaultImgAttributes: GenImgAttrsResult = {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    srcSet: undefined,
    sizes: undefined,
};

export const FallbackCover = ({ className }: { className?: string }) => {
    return (
        <div className={twMerge('dark:bg-gray-850 absolute top-0 left-0 h-full w-full bg-[#e6e6e6]', className)}>
            <DefaultFallback className="scale-[0.3] fill-current text-white" width="100%" height="100%" />
        </div>
    );
};
