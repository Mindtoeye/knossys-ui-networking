import KHashTable from './KHashTable';
import KMessageObject from './KMessageObject';

/**
 * 
 */ 
class KUIServer {
  
  /**
   * 
   */  
  constructor () {
    this.sessions=new KHashTable ();
  }

  /**
   * 
   */  
  processData (aSocket,aMessage) {
    console.log ("processData ()");

    let newMessage=new KMessageObject ();
    newMessage.process (aMessage);

    let outgoingMessage=new KMessageObject ();
    outgoingMessage.namespace="root.react.established";
    outgoingMessage.session=newMessage.session;

    aSocket.send (outgoingMessage.build ());
  }
}

export default KUIServer;
