export const isObject = (
  value: any,
): value is Record<string | number | symbol, any> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
