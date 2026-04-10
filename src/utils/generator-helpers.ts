import dayjs from 'dayjs';

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
export function generateDayJsDateRange(start: Date, end: Date): dayjs.Dayjs[] {
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
