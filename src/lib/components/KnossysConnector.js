import KNetworkEnvironment from './KNetworkEnvironment';
import KWebSocket from './KWebSocket';
import KHashTable from './KHashTable';

/**
 * 
 */
class KnossysConnector {

  /**
   * 
   */
  constructor (masterController) {

    this.controller=masterController;
    this.websocket=null;
    this.wsdata={};
    this.wsretry=false;

    this.connectionTable=new KHashTable ();

    this.networkConfig=new KNetworkEnvironment ();
    this.networkConfig.setSystemPort (8072);
    this.networkConfig.setSystemRoot ("192.168.0.108");

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
      this.websocket.close ();
      this.websocket=null;
    }
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
   * Note: the incoming data is already parsed data
   */
  handleWebsocketOpen(event) {
    console.log ("handleWebsocketOpen ()");
    
    this.connected=true;
    this.wsdata=null;
    this.wsretry=false;
    
    console.log ("Connected, sending initial packet ...");
    this.websocket.sendData ("root.react.init", {});    
  }    
  
  /**
   * Note: the incoming data is a basic string. Something we might
   * want to consider is to fix escaped double quotes. We're seeing
   * that some of the Java code is doing escaping on some of the
   * inner blocks.
   */
  handleWebsocketData(event) {  
    console.log ("handleWebsocketData ()");
    console.log ("Data: " + event.data);

    if (this.controller) {
      this.controller.onData (event.data);
    }
    
    /*
    var JSONObject=JSON.parse (event.data);
    
    if (!JSONObject.data.namespace) {
      console.log ("Internal error: incoming message does not conform to specs");  
      return; 
    }
       
    if (this.processWSMessage (JSONObject)===false) {    
      this.setState({wsdata: JSONObject},() => {
      });
    }
    */ 
  }  

  /**
   * 
   */
  retryWebsocketConnection () {
    console.log ("retryWebsocketConnection ()");

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
   * 
   */
  debugConnections () {
    console.log (JSON.stringify (this.connectionTable.getItems ()));
  } 

  /**
   *
   */
  send (aString) {
    if (this.websocket!=null) {
      this.websocket.sendData ("root.react.init", {"data": aString});
    }
  }
}

export default KnossysConnector;
