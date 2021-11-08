
import {types} from './ArgumentTypes';
import KConsoleCommand from './KConsoleCommand';

var commands = [
  {
    scheme: "help",
    args:[],
    pointer: null,
    handler: ({input}) => {
      return ("Usage: ");
    }
  },
  {
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
  constructor () {
    this.addCommand ("echo $input",[{name: "input",type: "string"}]);
  } 

  /**
   * 
   */
  addCommand (aScheme,argsObject) {
    let newCommand=new KConsoleCommand ();
    newCommand.scheme=aScheme;
    newCommand.args=argsObject;
    commands.push (newCommand);
  }

  /**
   * 
   */
  splitParts (input) {
    let matches= input.match(/[^"]*|"[^"]*"/g);
    let parts=[];

    console.log (matches);

    for (let i=0;i<matches.length;i++) {
      let quoteless=matches [i].replace(/['"]+/g,'');
      let clean=quoteless.toLowerCase ();
      if (clean === "") {
        // we might need this for something
      } else {
        parts.push (clean);
      }
    }

    console.log (parts);

    return (parts);
  }

  /**
   * 
   */
  cmd (input) {
    console.log ("cmd ("+input+")");
 
    let parts=this.splitParts (input);

    if (parts.length==0) {
      return ("no matching command found");
    }

    let command=parts [0];

    parts.splice (0,1);

    console.log ("Command is: " + command);

    return ("no matching command found");
  }

  /**
   * 
   */
  /* 
	cmd (input) {
    console.log ("cmd ("+input+")");
 
    var parts=this.splitParts (input);

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
  */
}

export default KCommandParser;
