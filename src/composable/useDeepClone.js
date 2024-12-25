export const useDeepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let clonedObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = useDeepClone(obj[key]);
    }
  }

  return clonedObj;
}
