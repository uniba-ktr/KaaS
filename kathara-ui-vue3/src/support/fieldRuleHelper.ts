export const requiredText = (value: string) =>
  value !== null && value.match(/^ *$/) === null;
export const minLength = (value: string, length: number) =>
  requiredText(value) && value.length >= length;
export const maxLength = (value: string, length: number) =>
  requiredText(value) && value.length <= length;
export const requiredEmail = (value: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
export const confirmPassword = (password: string) => (value: string) =>
  value === password;
export const requiredNumber = (value: string) => /^\d+$/.test(value);
