const setColor = (status) => {
  return status === "Нет статуса"
    ? "bg-grey-7"
    : status === "Работаем" ? "bg-positive"
      : status === "Должник" ? "bg-negative"
        : status === "Чёрный список" ? "bg-grey-5"
          : "";
};

export { setColor };
