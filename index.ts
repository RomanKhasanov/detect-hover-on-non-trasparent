import { loadImage } from '@/utils/loadImage';

export async function getIsTransparent(
  element: HTMLImageElement,
  src: string,
  e: MouseEvent,
  naturalWidth: number,
  naturalHeight: number,
): Promise<boolean> {
  const realSize = getRenderedSize(
    true,
    element.width,
    element.height,
    naturalWidth,
    naturalHeight,
    parseInt(
      window
        .getComputedStyle(element)
        .getPropertyValue('object-position')
        .split(' ')[0],
    ),
  );

  const rect = element.getBoundingClientRect();
  const relX = e.clientX - rect.left - (element.width - realSize.width) / 2;
  const relY = e.clientY - rect.top - (element.height - realSize.height) / 2;
  // @ts-ignore
  let canvas = element.svgHoverCanvas;
  if (!canvas) {
    // @ts-ignore
    canvas = element.svgHoverCanvas = document.createElement('canvas');
    canvas.width = realSize.width;
    canvas.height = realSize.height;
    const image = await loadImage(src);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, realSize.width, realSize.height);
  }
  const context = canvas.getContext('2d');
  const data = context.getImageData(relX, relY, 1, 1);
  return data.data[3] <= 0;
}

function getRenderedSize(
  contains: boolean,
  cWidth: number,
  cHeight: number,
  width: number,
  height: number,
  pos: number,
) {
  const oRatio = width / height,
    cRatio = cWidth / cHeight;
  const result = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
  if (contains ? oRatio > cRatio : oRatio < cRatio) {
    result.width = cWidth;
    result.height = cWidth / oRatio;
  } else {
    result.width = cHeight * oRatio;
    result.height = cHeight;
  }
  result.left = (cWidth - result.width) * (pos / 100);
  result.right = result.width + result.left;
  result.top = (cHeight - result.height) * (pos / 100);
  result.bottom = result.top + result.height;

  return result;
}
