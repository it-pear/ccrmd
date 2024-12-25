export const useFindElement = (id, arr) => {
  if (id && arr.length) {
    const currentIndex = arr.findIndex((el) => el.id === id);
    const currentElement = arr[currentIndex];
    return currentElement;
  }
  return false;
}

