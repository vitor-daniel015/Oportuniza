export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function maskCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
export function maskPhone(value: string) {
  const n = onlyDigits(value).slice(0, 11);
  if (n.length <= 10)
    return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}
export function maskCep(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}
export function isValidCpf(value: string) {
  const n = onlyDigits(value);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
  const digit = (size: number) => {
    let sum = 0;
    for (let i = 0; i < size; i++) sum += Number(n[i]) * (size + 1 - i);
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };
  return digit(9) === Number(n[9]) && digit(10) === Number(n[10]);
}
