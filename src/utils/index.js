export const mergeStringIntoObjArr = (someString, ...keys) => {
  const merged = {};
  return someString.split(/,(?!\s)/).map(str => {
    const values = str.split(/&(?!\s)/);
    let localMerged = {};
    localMerged = keys.reduce(
      (obj, key, i) => ({ ...obj, [key]: values[i] }),
      {}
    );
    return { ...merged, ...localMerged };
  });
};

export const stringToArr = someString => {
  const result = someString.split(/\|(?!\s)/);
  return result;
};
