/**
 * Formats a number as a locale-aware price string.
 *
 * @param price - Numeric value to format.
 * @param locale - BCP 47 locale. Defaults to 'vi-VN'.
 * @returns Formatted string, e.g. "1.500.000" (vi-VN) or "1,500,000" (en-US).
 * @example
 * generateLocalePriceFormat(1500000);          // "1.500.000"
 * generateLocalePriceFormat(1500000, 'en-US'); // "1,500,000"
 */
export const generateLocalePriceFormat = (
  price: number,
  locale: Intl.LocalesArgument = 'vi-VN'
): string => {
  return price.toLocaleString(locale);
};
