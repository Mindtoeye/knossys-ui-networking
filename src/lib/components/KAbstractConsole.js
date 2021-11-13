
import KQueue from './KQueue';
import KAbstractConsoleLine from './KAbstractConsoleLine';

/**
 * 
 */
class KAbstractConsole extends KQueue {

  /**
   * 
   */
  println (aLine) {
    let newLine=new KAbstractConsoleLine ();
    newLine.setLine (aLine);
    this.enqueue (newLine);
  }

  /**
   * 
   */
  error (aLine) {
    let newLine=new KAbstractConsoleLine ();
    newLine.setLine (aLine);
    newLine.setError (true);
    this.enqueue (newLine);
  }  
}

export default KAbstractConsole;
