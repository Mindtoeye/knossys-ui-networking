
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
  },
  {
    type: "boolean",
    replace: "(true|false|TRUE|FALSE|True|False)",
    transform: (arg) => {
      switch(arg.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(arg);
      }
    }
  }
];

export { types };
