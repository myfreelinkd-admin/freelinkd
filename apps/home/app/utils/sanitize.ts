export const sanitizeInput = (input: string): string => {
  const dangerousCharsPattern = /[<>\/?";:'\[{\|}\]\\`]/g;
  return input.replace(dangerousCharsPattern, "");
};
