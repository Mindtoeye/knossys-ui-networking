import KNetworkEnvironment from './KNetworkEnvironment';
//import KGUID from './KGUID';

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
  }
      
  /**
   * 
   */
  sendData (aNamespace,aData) {
	  if (this.websocket!=null) {
      var newData={};
	    newData["data"]={};
	    newData["data"]["namespace"] = aNamespace;
	    newData["data"]["session"] = this.sessionID;
	    newData["data"]["payload"] = aData;
		    
      this.websocket.send(JSON.stringify (newData));		 
	  }  
  }
   
  /**
   * 
   */
  sendNamespace (aNamespace) {
	  if (this.websocket!=null) {
      var newData={};
	    newData["data"]={};
	    newData["data"]["namespace"] = aNamespace;
	    newData["data"]["session"] = this.sessionID;
	    newData["data"]["payload"] = {};
		    
      this.websocket.send(JSON.stringify (newData));		 
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
  getsocket (){
	  return (this.websocket);
  }
}
