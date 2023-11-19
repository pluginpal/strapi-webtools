export const isObject = (
  value: any,
): value is Record<string | number | symbol, any> => typeof value === 'object' && value !== null && !Array.isArray(value);
