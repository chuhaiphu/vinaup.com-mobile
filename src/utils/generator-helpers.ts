import dayjs from 'dayjs';
import { ImageManipulator } from 'expo-image-manipulator';

/**
 *
 * @param start Start date.
 * @param end End date.
 * @returns {dayjs.Dayjs[]} Array of Dayjs objects including both start and end dates.
 * @example
 * const dates = generateDayJsDateRange(new Date('2026-04-10'), new Date('2026-04-13'));
 * // dates: [Dayjs(2026-04-10), Dayjs(2026-04-11), Dayjs(2026-04-12), Dayjs(2026-04-13)]
 * const output = dates.map((d) => d.format('YYYY-MM-DD'));
 * // output: ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13']
 */
export function generateDayJsDateRange(
  start: Date | string,
  end: Date | string
): dayjs.Dayjs[] {
  const result: dayjs.Dayjs[] = [];
  let current = dayjs(start);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    result.push(current);
    current = current.add(1, 'day');
  }
  return result;
}

export const generateLocalePriceFormat = (
  price: number,
  locale: Intl.LocalesArgument = 'vi-VN'
): string => {
  return price.toLocaleString(locale);
};

export async function generateBase64FromUrl(url?: string | null): Promise<string> {
  if (!url) return '';

  const context = ImageManipulator.manipulate(url);
  try {
    const imageRef = await context.renderAsync();
    const result = await imageRef.saveAsync({
      compress: 0.8,
      base64: true,
    });

    return `data:image/jpeg;base64,${result.base64}`;
  } catch (error) {
    console.warn('Loi khi convert image sang base64', error);
    return '';
  }
}
