export function getFormatDate(inputDateStr) {
  if (inputDateStr.length <= 10) {
    return inputDateStr;
  }
  const [timeStr, dateStr] = inputDateStr.split(' ');
  const [day, month, year] = dateStr.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  const isSameDate = inputDate.getDate() === today.getDate()
    && inputDate.getMonth() === today.getMonth()
    && inputDate.getFullYear() === today.getFullYear();

  if (isSameDate) {
    if (timeStr.length > 5) return timeStr.slice(0, 5);
    return timeStr;
  }

  return dateStr;
}

export function checkIsNew(inputDateStr) {
  const [, dateStr] = inputDateStr.split(' ');
  const [day, month, year] = dateStr.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  const isSameDate = inputDate.getDate() === today.getDate()
    && inputDate.getMonth() === today.getMonth()
    && inputDate.getFullYear() === today.getFullYear();

  if (isSameDate) {
    return 'Новая';
  }

  return null;
}
