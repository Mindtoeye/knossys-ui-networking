
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
    this.error=false;
  }

  /**
   * 
   */
  setLine (aLine) {
    let consoleTools=new KConsoleTools ();
    this.timestamp=consoleTools.getTimestamp ();
    this.line=aLine;
  }

  /**
   * 
   */
  setError (aValue) {
    this.error=aValue;
  }
}

export default KAbstractConsoleLine;
