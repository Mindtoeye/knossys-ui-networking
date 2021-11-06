import KGUID from './KGUID';

var KnossysSession="-1";

/**
 * 
 */
export default class KNetworkEnvironment {
	
  /**
   * 
   */	
  constructor () {
    this.systemPort="8080";
	  this.systemRoot="127.0.0.1:"+this.systemPort;
	
	  var guidGenerator=new KGUID ();  
	   
	  if (KnossysSession==="-1") {
	    KnossysSession=guidGenerator.guid;
	  }
  }

  /**
   * 
   * @param aHost
   * @returns
   */
  configWebsocket (aHost) {
    var splitter=aHost.split (":");
    this.systemRoot=splitter[0] + ":" + this.systemPort;
  }

  /**
   * 
   * @returns
   */
  getGateway () {
    return ("ws://"+this.systemRoot+"/websocket");
  }

  /**
   * 
   * @returns
   */
  getUpload () {
    return ("http://"+this.systemRoot+"/upload");
  }

  setSession (aSession) {
	  KnossysSession=aSession;
  }
  
  /**
   * 
   * @returns
   */
  getSession () {
    return (KnossysSession);	
  }
}
