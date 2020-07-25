// Speed up calls to hasOwnProperty
const { hasOwnProperty } = Object.prototype;

const isEmpty = (obj) => {
  if (obj === undefined) {
    return true;
  }

  if (obj === null) {
    return true;
  }

  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }
  if (typeof obj !== 'object') {
    return true;
  }

  // Otherwise, does it have any properties of its own?
  return Object.keys(obj).reduce(
    (acc, curr, index) => hasOwnProperty.call(obj, index) && acc,
    true
  );
};

export default isEmpty;
