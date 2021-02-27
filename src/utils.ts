/**
 * Thousands comma separator
 */
export const comma = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Asynchronous sleep
 * @param ms - Time in milliseconds to sleep
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
