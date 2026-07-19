const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? usdFormatter.format(amount) : 'Price not set';
};
