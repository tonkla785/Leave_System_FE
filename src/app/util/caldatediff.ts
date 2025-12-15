export function calDateDiff(
  start?: Date | string,
  end?: Date | string
): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - startDate.getTime();

  if (diffTime < 0) return 0;

  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
