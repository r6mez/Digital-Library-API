const dateFilter = (from, to, days, defaultDays = 30) => {
  let fromDate;
  let toDate;

  if (days) {
    fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    toDate = new Date();
  } else if (from || to) {
    fromDate = from ? new Date(from) : undefined;
    toDate = to ? new Date(to) : undefined;
  } else {
    fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - defaultDays);
    toDate = new Date();
  }

  const createdAt = {};
  if (fromDate) createdAt.$gte = fromDate;
  if (toDate) createdAt.$lte = toDate;

  return Object.keys(createdAt).length ? { createdAt } : {};
};

module.exports = {
  dateFilter,
};
