export const getNextPaymentDate = (startDate, billingCycle) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const today = new Date();
  const next = new Date(start);
  while (next < today) {
    next.setMonth(next.getMonth() + (billingCycle === "Yearly" ? 12 : 1));
  }
  return next;
};

export const daysUntil = (date) => {
  if (!date) return Infinity;
  const today = new Date();
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
};

export const monthlyValue = (sub) => {
  const price = Number(sub.price) || 0;
  return sub.billingCycle === "Yearly" ? price / 12 : price;
};
