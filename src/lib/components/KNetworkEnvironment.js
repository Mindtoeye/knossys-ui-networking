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
    this.systemPort=8080;
    this.systemHost="127.0.0.1";
	
	  var guidGenerator=new KGUID ();  
	   
	  if (KnossysSession==="-1") {
	    KnossysSession=guidGenerator.generate ();
	  }
  }

  /**
   * 
   */
  setSystemPort (aPort) {
    this.systemPort=aPort;
  }

  /**
   * 
   */
  setSystemRoot (aHost) {
    this.systemHost=aHost;
  }

  /**
   * 
   * @param aHost
   * @returns
   */
  configWebsocket (aHost) {
    var splitter=aHost.split (":");

    this.systemHost=splitter[0];
    this.systemPort=parseInt (splitter[1]);
  }

  /**
   * 
   */
  getGateway () {
    return ("ws://"+this.systemHost+":"+this.systemPort+"/websocket");
  }

  /**
   * 
   */
  getUpload () {
    return ("http://"+this.systemHost+":"+this.systemPort+"/upload");
  }

  /**
   * 
   */
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
