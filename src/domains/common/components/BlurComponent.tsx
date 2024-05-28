import { type BlurhashEntry, useBlurhash } from '@app/domains/common/hooks/useBlurhash';
import { useEffect, useRef } from 'react';

let canvas: HTMLCanvasElement | null = null;

type Props = {
    entry: BlurhashEntry;
    width: number;
    height: number;
    fitsToParent?: boolean;
};

export default function BlurComponent({ entry, width, height, fitsToParent }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { width: blurWidth, height: blurHeight } = entry.options;

    const data = useBlurhash(entry);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;

            if (!canvas || !data) {
                return;
            }

            if (fitsToParent) {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
            }
            const context = canvas.getContext('2d')!;
            context.drawImage(getImageDataCanvas(data, blurWidth, blurHeight), 0, 0, width, height);
        };

        draw();
    }, [blurHeight, blurWidth, data, fitsToParent, height, width]);

    return (
        <span className="absolute top-0 left-0 h-full w-full">
            <canvas className="rounded-[6px]" ref={canvasRef} width={width} height={height} />
        </span>
    );
}

function getCanvas() {
    return canvas || (canvas = document.createElement('canvas'));
}

const getImageDataCanvas = (data: Uint8Array | Uint8ClampedArray, width: number, height: number) => {
    const canvas = getCanvas();

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d')!;
    const imageData = context.createImageData(width, height);
    imageData.data.set(data);

    context.putImageData(imageData, 0, 0);

    return canvas;
};
