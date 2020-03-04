export const mergeStringIntoObjArr = (longString, ...keys) => {
  const merged = {};
  return longString.split(/,(?!\s)/).map(str => {
    const values = str.split(/\^(?!\s)/);
    let localMerged = {};
    localMerged = keys.reduce(
      (obj, key, i) => ({ ...obj, [key]: values[i] }),
      {}
    );
    return { ...merged, ...localMerged };
  });
};

export const stringToArr = longString => {
  const result = longString.split(/\|(?!\s)/);
  return result;
};
