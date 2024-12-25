const checkWhatsApp = (field) => {
  if (field === '' || field === null) {
    return '';
  } else if (field.indexOf('http') === -1) {
    return field = `https://wa.me/${field}`.replace(/[@]/gi, '');
  } else {
    return field;
  }
}

const checkTelegram = (field) => {
  if (field === '' || field === null) {
    return '';
  } else if (field.indexOf('http') === -1) {
    return field = `https://t.me/${field}`.replace(/[@]/gi, '')
  } else {
    return field;
  }
}

const checkInstagram = (field) => {
  if (field === '' || field === null) {
    return '';
  } else if (field.indexOf('http') === -1) {
    return field = `https://www.instagram.com/${field}`.replace(/[@]/gi, '')
  } else {
    return field;
  }
}

export { checkWhatsApp, checkTelegram, checkInstagram };
