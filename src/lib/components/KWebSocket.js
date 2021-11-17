import KNetworkEnvironment from './KNetworkEnvironment';
import KMessageObject from './KMessageObject';

/**
 * 
 */
export default class KWebSocket {
  
  /**
   * 
   */
  constructor () {			   
    this.websocket=null;
	 
	  var globalNetworkConfig=new KNetworkEnvironment ();
	 
	  this.sessionID=globalNetworkConfig.getSession ();
    this.messageCount=0;
  }
      
  /**
   * 
   */
  sendData (aNamespace,aData) {
	  if (this.websocket!=null) {
      let outgoing=new KMessageObject ();
      outgoing.namespace=aNamespace;
      outgoing.session=this.sessionID;
      outgoing.count=this.messageCount;
      outgoing.payload=aData;

      let built=outgoing.build();

      //console.log ("Sending: " + built);

      this.websocket.send(built);

      this.messageCount++;
	  }  
  }
      
  /**
   * 
   */
  setSocket (aSocket) {
	 this.websocket=aSocket; 
  }
   
  /**
   * 
   */
  getsocket () {
	  return (this.websocket);
  }

  /**
   * 
   */
  close () {
    if (this.websocket!=null) {
      this.websocket.close ();
    }
  }
}
