
import KConsoleTools from './KConsoleTools';

/**
 * 
 */
class KAbstractConsoleLine {
  
  /**
   * 
   */
  constructor() {    
    this.timestamp="";
    this.line="";
  }

  /**
   * 
   */
  setLine (aLine) {
    let consoleTools=new KConsoleTools ();
    this.timestamp=consoleTools.getTimestamp ();
    this.line=aLine;
  }
}

export default KAbstractConsoleLine;