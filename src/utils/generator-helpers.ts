import dayjs from 'dayjs';

export function generateDateRange(start: Date, end: Date): dayjs.Dayjs[] {
  const result: dayjs.Dayjs[] = [];
  let current = dayjs(start);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    result.push(current);
    current = current.add(1, 'day');
  }
  return result;
}

export const generateLocalePriceFormat = (price: number, locale: Intl.LocalesArgument): string => {
  return price.toLocaleString(locale);
};
