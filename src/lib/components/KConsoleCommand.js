
/**
 *
 */
class KConsoleCommand {

  /**
   *
   */  
  constructor () {
    this.scheme="nop";
    this.args=[];
    this.pointer=null;
    this.handler=({input}) => {
      return ("Usage: ");
    }
  }  
}

export default KConsoleCommand;
