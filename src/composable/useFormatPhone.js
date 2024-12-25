const formatPhone = (phoneNumber) => {
  if (phoneNumber?.length === 12 || phoneNumber?.length === 11) {
    const pattern =
      /(\+7|7|8)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g;

    return phoneNumber?.replace(pattern, "+7 ($2) $3-$4-$5");
  } else if (phoneNumber?.length === 10) {
    const pattern =
      /[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g;

    return phoneNumber?.replace(pattern, "+7 ($1) $2-$3-$4");
  } else {
    return phoneNumber;
  }
}

const extractPhone = (str) => {
  let newStr = '';

  if (str) {
    for (const index in str) {
      if (parseInt(str[index]) === 0 || !!parseInt(str[index])) {
        newStr += str[index];
      }
    }
  } else {
    return '';
  }

  return str[0] === '+' ? `+${newStr}`
    : str[0] === '9' ? `+7${newStr}`
      : str[0] === '8' ? `+7${newStr.slice(1)}`
        : newStr;
}

export { formatPhone, extractPhone };
