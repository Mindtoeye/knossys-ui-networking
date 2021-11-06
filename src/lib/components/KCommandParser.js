
var argumentTypes = [
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

var commands = [
  {
    name: "help",
    scheme: "help",
    args:[],
    handler: ({input}) => {
      return "Usage: ";
    }
  },
  {
    name: "echo",
    scheme: "echo $input",
    args:[
    {
      name: "input",
      type: "string"
    }
    ],
    handler: ({input}) => {
      return input;
    }
  },
  {
    name: "sum",
    scheme: "sum $val1 $val2",
    args:[
    {
      name: "val1",
      type: "number"
    },
    {
      name: "val2",
      type: "number"
    }
    ],
    handler: ({val1, val2}) => {
      return val1 + val2;
    }
  }
];

/**
 * 
 */
class KCommandParser {

  /**
   * 
   */
	cmd (input) {
    console.log ("cmd ("+input+")");

    var argumentType = null;

    for(let c of commands) {
    	var reg = c.scheme
    	for(let arg of c.args) {
    		argumentType = argumentTypes.find(a => a.type === arg.type);
    		if(argumentType === undefined) {
    			return ("unsupported argument type");
    		}
    		reg = reg.replace("$" + arg.name, argumentType.replace)
    	}
    	var regExp = new RegExp(reg);
    	var match = input.match(regExp);

    	if(match) {
    		match.shift();
    		var paramObj = {};
    		for(var i = 0; i < c.args.length; i++) {
    			argumentType = argumentTypes.find(a => a.type === c.args[i].type);
    			paramObj[c.args[i].name] = argumentType.transform(match[i]);
    		}
    		return c.handler(paramObj);
    	}
    }

    return ("no matching command found");
  }
}

export default KCommandParser;
