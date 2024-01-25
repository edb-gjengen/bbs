export function formatCurrency(value: number) {
  if (isNaN(value)) {
    return "";
  } else {
    return value.toFixed(2).replace(/\.00$/, '');
  }
}
