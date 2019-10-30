const describeArray = arr => {
  arr = [...new Set(arr)]; // remove duplicates
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  if (arr.length >= 3) {
    let str = ``;
    arr.forEach((item, index) => {
      str = `${str}${item}`;

      if (index + 1 < arr.length - 1) {
        str = `${str}, `;
      } else if (index + 1 === arr.length - 1) {
        str = `${str} and `;
      }
    });
    return str;
  }
  return '';
};

module.exports = {
  describeArray
};
