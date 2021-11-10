
/**
 *
 */
class KConsoleCommand {

  /**
   *
   */  
  constructor () {
    this.scheme="nop";
    this.schemeParts=[];
    this.args=[];
    this.command="";
    this.handler=({input}) => {
      return ("Usage: ");
    }
  }  
}

export default KConsoleCommand;
