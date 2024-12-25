const useFormatDateISO = (inputDate) => {
  if (inputDate.indexOf("/", 1) !== -1) {
    const dateParts = inputDate.split("/");
    const year = dateParts[2];
    const month = dateParts[1];
    const day = dateParts[0];
    return `${year}-${month}-${day}`;
  } else {
    return inputDate;
  }
}

export { useFormatDateISO }
