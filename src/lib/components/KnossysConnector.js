
import KGUID from './KGUID';
import KNetworkEnvironment from './KNetworkEnvironment';
import KWebSocket from './KWebSocket';
import KHashTable from './KHashTable';
import KQueue from './KQueue';
import KMessageOBject from './KMessageObject';

/**
 * 
 */
class KnossysConnector {

  /**
   * 
   */
  constructor (aController) {

    this.reactController=aController;
    this.websocket=null;
    this.wsdata={};
    this.wsretry=false;

    this.guidGenerator=new KGUID ();    

    this.connectionTable=new KHashTable ();
    this.messageQueue=new KQueue ();

    this.networkConfig=new KNetworkEnvironment ();
    this.networkConfig.setSystemPort (8072);
    this.networkConfig.setSystemRoot ("localhost");

    this.setupEventHandlers = this.setupEventHandlers.bind(this);
    this.handleWebsocketOpen = this.handleWebsocketOpen.bind(this);  
    this.handleWebsocketData = this.handleWebsocketData.bind(this);    
    this.handleWebsocketError = this.handleWebsocketError.bind(this);
    this.handleWebsocketClose = this.handleWebsocketClose.bind(this);     

    this.createWebSocket = this.createWebSocket.bind (this);
    this.shutdown = this.shutdown.bind (this);
  }

  /**
   * 
   */
  init () {
    console.log ("init ()");

    this.createWebSocket ();
  }

  /**
   * 
   */
  shutdown() {      
    if (this.websocket!=null) {
      console.log ("Closing ...")
      this.websocket.close ();
      console.log ("Disabling ...")
      this.websocket=null;
    }
  }

  /**
    interface URL {
      href:     USVString;
      protocol: USVString;
      username: USVString;
      password: USVString;
      host:     USVString;
      hostname: USVString;
      port:     USVString;
      pathname: USVString;
      search:   USVString;
      hash:     USVString;
      readonly origin: USVString;
      readonly searchParams: URLSearchParams;
      toJSON(): USVString;
    }
   */
  setURL (aURL) {
    console.log ("setURL ("+aURL+")");

    let statusResult = {
      ok: true,
      statusMessage: "Send successful"
    };

    if (aURL.indexOf (":")==-1) {
      statusResult.ok=false;
      statusResult.statusMessage="Invalid websocket url: " + aURL;
      return (statusResult);
    }

    let url=null;

    try {
      url=new URL (aURL);
    } catch(err) {
      statusResult.ok=false;
      statusResult.statusMessage="Error parsing url: " + err;
      return (statusResult);      
    }    

    this.networkConfig.setSystemPort (url.port);
    this.networkConfig.setSystemRoot (url.hostname);

    statusResult.ok=true;
    statusResult.statusMessage="Changed server url, you may have to reconnect for this setting to take effect";
    return (statusResult);   
  }

  /**
   * 
   */
  createWebSocket () {                     
    console.log ("createWebSocket ("+this.networkConfig.getGateway ()+")");
      
    if (this.websocket==null) {
      console.log ("websocket not yet available, initializing ...");

      var wssocket = new WebSocket(this.networkConfig.getGateway ());
        
      var newWebSocket=new KWebSocket ();
      newWebSocket.setSocket (wssocket);
          
      this.websocket=newWebSocket;
      this.wsdata={};
      this.wsretry=false;

      this.setupEventHandlers ();
    }
  } 

  /**
   *
   */
  setupEventHandlers () {
    console.log ("setupEventHandlers ()");

    this.websocket.getsocket ().addEventListener('open', this.handleWebsocketOpen);
    this.websocket.getsocket ().addEventListener('message', this.handleWebsocketData);
    this.websocket.getsocket ().addEventListener('error', this.handleWebsocketError);
    this.websocket.getsocket ().addEventListener('close', this.handleWebsocketClose);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
   */  
  stateToString (aState) {
    console.log ("stateToString ("+aState+")");

    if (aState==0 ) {
      return ("CONNECTING"); // Socket has been created. The connection is not yet open.
    }

    if (aState==1) {
      return ("OPEN"); // The connection is open and ready to communicate.
    }

    if (aState==2) {
      return ("CLOSING") // The connection is in the process of closing.
    }

    if (aState==3) {
      return ("CLOSED"); //  The connection is closed or couldn't be opened.
    }

    return ("UNDETERMINED");
  }

  /**
   * 
   */
  isConnected () {
    if (this.websocket.getsocket ().readyState==1) {
      return (true);
    }

    return (false);
  }

  /**
   * 
   */
  getStatus () {
    let statusString="";

    statusString+="Connected to: " + this.networkConfig.getGateway () + ", status: " + this.stateToString (this.websocket.getsocket ().readyState) + ", retry: " + this.wsretry;

    return (statusString);
  }

  /**
   * Note: the incoming data is already parsed data
   */
  handleWebsocketOpen(event) {
    console.log ("handleWebsocketOpen ()");
    
    this.connected=true;
    this.wsdata=null;
    this.wsretry=false;
    
    console.log ("Connected, sending initial packet ...");

    this.websocket.sendData (this.refId, {});    
  }    
  
  /**
   * 
   */
  retryWebsocketConnection () {
    console.log ("retryWebsocketConnection ()");

    // Forcefully disconnected or not initialized yet
    if (this.websocket==null) {
      console.log ("Forcefully disconnected or not initialized yet");
      return;
    }

    if (this.wsretry===true) {
      return;
    }

    this.connected=false;     
    this.websocket=null;
    this.wsretry=true;

    setTimeout(this.createWebSocket,5000);
  }

  /** 
   * @param {any} data
   */
  handleWebsocketError(data) {    
    this.retryWebsocketConnection ();
  }  
    
  /** 
   * @param {any} data
   */
  handleWebsocketClose(data) {     
    this.retryWebsocketConnection ();
  }  

  /**
   * Essentially a shortcut to registerConnection
   */
  getReference () {    
    let ref=this.guidGenerator.generate ();
    this.registerConnection (ref);
    return (ref);
  }

  /**
   * 
   */
  debugConnections () {
    let keys=this.connectionTable.getItems ();

    for (var key in keys) {
      console.log ('Registered connection/endpoint: ' + key);
    }
  }

  /**
   * 
   */
  registerConnection (anId) {
    console.log ("registerConnection ("+anId+")");

    this.connectionTable.setItem (anId,{});

    this.debugConnections ();
  }

  /**
   * 
   */
  unregisterConnection (anId) {
    console.log ("unregisterConnection ("+anId+")");

    this.connectionTable.removeItem (anId);

    this.debugConnections ();
  }

  /**
   * Note: the incoming data is a basic string. Something we might
   * want to consider is to fix escaped double quotes. We're seeing
   * that some of the Java code is doing escaping on some of the
   * inner blocks.
   */
  handleWebsocketData(event) {  
    //console.log ("handleWebsocketData ()");    

    let incomingMessage=new KMessageOBject ();
    if (incomingMessage.process (event.data)==false) {      
      return;
    }

    this.messageQueue.enqueue (incomingMessage);
    
    console.log ("Routing top message in queue (" + this.messageQueue.getSize () + ") to proper source: " + incomingMessage.namespace);

    if (this.reactController) {
      this.reactController.route (incomingMessage.namespace,incomingMessage);
    }
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   */
  send (aNamespace,aString) {
    //console.log ("send ("+aNamespace+","+aString+")");

    let statusResult = {
      ok: true,
      statusMessage: "Send successful"
    };

    if (this.websocket!=null) {
      if (this.isConnected ()==true) {
        try {
          this.websocket.sendData (aNamespace, {"data": aString});
        } catch (error) {
          statusResult.ok=false;
          statusResult.statusMessage=JSON.stringify (error);
          return (statusResult);           
        }

        return (statusResult);
      }
    }

    statusResult.ok=false;
    statusResult.statusMessage="Not connected";
    return (statusResult);          
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   */
  broadcast (aString) {
    //console.log ("broadcast ("+aString+")");

    let statusResult = {
      ok: true,
      statusMessage: "Send successful"
    };

    if (this.websocket!=null) {
      if (this.isConnected ()==true) {
        try {
          this.websocket.sendData ("*", {"data": aString});
        } catch (error) {
          statusResult.ok=false;
          statusResult.statusMessage=JSON.stringify (error);
          return (statusResult);           
        }

        return (statusResult);
      }
    }

    statusResult.ok=false;
    statusResult.statusMessage="Not connected";
    return (statusResult);          
  }
}

export default KnossysConnector;
