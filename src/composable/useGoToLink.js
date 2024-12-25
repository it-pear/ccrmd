const goToLink = (link) => {
  if (!/^https?:\/\//i.test(link)) {
    link = "https://" + link;
  }
  window.open(link, "_blank");
}

export { goToLink };
