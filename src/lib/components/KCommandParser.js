
import {types} from './ArgumentTypes';

var commands = [
  {
    name: "help",
    scheme: "help",
    args:[],
    pointer: null,
    handler: ({input}) => {
      return ("Usage: ");
    }
  },
  {
    name: "connect",
    scheme: "connect",
    args:[],
    pointer: null,
    handler: ({input}) => {
      return ("Connecting ...");
    }
  },
  {
    name: "disconnect",
    scheme: "disconnect",
    args:[],
    pointer: null,
    handler: ({input}) => {
      return ("Disconnecting ...");
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
    pointer: null,
    handler: ({input}) => {
      return (input);
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
    pointer: null,
    handler: ({val1, val2}) => {
      return (val1 + val2);
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
    	var reg = c.scheme;

    	for(let arg of c.args) {
    		argumentType = types.argumentTypes.find(a => a.type === arg.type);

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
    			argumentType = types.argumentTypes.find(a => a.type === c.args[i].type);
    			paramObj[c.args[i].name] = argumentType.transform(match[i]);
    		}

    		return c.handler(paramObj);
    	}
    }

    return ("no matching command found");
  }
}

export default KCommandParser;
