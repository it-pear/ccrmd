const useFormatNum = (number) => {
  if (!number) return false;
  return `${number}`.split('').reverse().map((el, index) => index % 3 !== 2 ? el : ` ${el}`).reverse().join('');
}

export { useFormatNum }
