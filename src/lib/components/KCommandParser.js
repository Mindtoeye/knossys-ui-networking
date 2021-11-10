
import {types} from './ArgumentTypes';
import KConsoleCommand from './KConsoleCommand';
import DataTools from './KDataTools';

/**
 * 
 */
class KCommandParser {

  /**
   * 
   */
  constructor () {
    console.log ("KCommandParser ()");

    this.dataTools=new DataTools ();
    this.commands = [];
  } 

  /**
   * 
   */
  findType (aSchemeElement) {
    // remove the $
    let aScheme=aSchemeElement.substring (1).toLowerCase();

    for (let i=0;i<types.argumentTypes.length;i++) {
      let testType=types.argumentTypes[i];

      if (testType.type===aScheme) {
        return (testType);
      }
    }

    return (null);
  }

  /**
   * 
   */
  addCommand (aScheme, aHandler) {
    //console.log ("addCommand (" + aScheme + ")");

    let newCommand=new KConsoleCommand ();
    newCommand.scheme=aScheme;

    let parts=this.splitParts (aScheme);

    if (parts.length===0) {
      return;
    }

    let command=parts.splice(0,1);
    newCommand.command=command;

    let schemeParts=[];

    for (let i=0;i<parts.length;i++) {
      schemeParts.push (this.findType (parts[i]));
    }

    newCommand.schemeParts=schemeParts;    
    newCommand.handler=aHandler;

    this.commands.push (newCommand);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_with_the_sticky_flag
   */
  splitParts (input) {
    let preclean=input.trim();
    let parts=[];

    let re=/([^\s"']+|"[^"]*"|'[^']*')\s*/y;
    let match=null;
    
    while(match = re.exec(preclean)) {
      let quoteless=match[1].replace(/['"]+/g,'');
      let clean=quoteless.toLowerCase ();
      if (clean === "") {
        // we might need this for something
      } else {
        parts.push (clean);
      }      
    }

    return (parts);
  }

  /**
   * 
   */
  cmd (input) {
    console.log ("cmd ("+input+")");
 
    let parts=this.splitParts (input);

    if (parts.length===0) {
      return ("Not enough data found to construct or call a command");
    }

    // There needs to be at least a command
    let command=parts[0];

    // Remove the command
    parts.splice (0,1);

    //console.log (this.commands);

    for (let i=0;i<this.commands.length;i++) {
      let comm=this.commands[i];

      if (comm.command==command) {
        // Now that we know where we are we need to match and convert the arguments
        let parameters=[];

        let j=0;
        let matchup=true;

        while (matchup===true) {
          matchup=true;

          let variable=parts[j];
          let typematch=comm.schemeParts[j];

          if (!variable) {
            matchup=false;
          }

          if (!typematch) {
            matchup=false;
          }

          if (matchup===true) {
            console.log ("Converting " + variable + " to: " + typematch.type);
            // Convert and parse input based on type, add to list of parameters that will be
            // provided to the handler
            parameters.push (typematch.transform (variable));
            j++;
          }          
        }

        //console.log (parameters);

        if (parameters.length===0) {
          return (comm.handler ());
        }        

        if (parameters.length===1) {
          return (comm.handler (parameters[0]));
        }

        if (parameters.length===2) {
          return (comm.handler (parameters[0],parameters[1]));
        }

        if (parameters.length===3) {
          return (comm.handler (parameters[0],parameters[1],parameters[2]));
        }

        if (parameters.length===4) {
          return (comm.handler (parameters[0],parameters[1],parameters[2],parameters[3]));
        }

        if (parameters.length===5) {
          return (comm.handler (parameters[0],parameters[1],parameters[2],parameters[3],parameters[4]));
        }

        if (parameters.length===6) {
          return (comm.handler (parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5]));
        }
        
        return ("Unable to execute command");
      }
    }


    return ("No matching command found");
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
