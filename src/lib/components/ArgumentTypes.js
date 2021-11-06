
// https://stackoverflow.com/questions/34741111/exporting-importing-json-object-in-es6/39414432
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

var types = {};

types.argumentTypes = [
  {
    type: "string",
    replace: "([a-z]+)",
    transform: (arg) => {
      return arg;
    }
  },
  {
    type: "number",
    replace: "([0-9]+)",
    transform: (arg) => {
      return parseInt(arg);
    }
  }
];

export { types };
