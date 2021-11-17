import KQueue from './KQueue';
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

    let sessionObject=this.sessions.getItem (aMessage.session);
    if (sessionObject==null) {
      sessionObject={
        socket: aSocket,
        messages: new KQueue (),
        count: 0
      };
      this.sessions.setItem (aMessage.session,sessionObject);
    }

    sessionObject.messages.enqueue (aMessage);
    sessionObject.count++;

    let outgoingMessage=new KMessageObject ();
    outgoingMessage.namespace="root.react.established";
    outgoingMessage.session=newMessage.session;
    outgoingMessage.count=sessionObject.count++;

    if (aMessage.namespace=="*") {
      let senders=this.sessions.getItems ();

      for (var sender in senders) {
        if (senders.hasOwnProperty(sender)) {
          let target = senders[sender];
          target.socket.send (outgoingMessage.build ());
        }
      }
    } else {
      aSocket.send (outgoingMessage.build ());
    }
  }
}

export default KUIServer;
