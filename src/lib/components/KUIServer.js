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

    let aSessionObject=this.sessions.getItem (newMessage.session);
    if (aSessionObject==null) {
      console.log ("Session " + newMessage.session + " not found, creating new one ...");
      aSessionObject={
        socket: aSocket,
        messages: new KQueue (),
        count: 0
      };
      this.sessions.setItem (newMessage.session,aSessionObject);
    }

    aSessionObject.messages.enqueue (newMessage);

    if (newMessage.namespace=="*") {
      console.log ("Processing broadcast ...");

      let sessionList=this.sessions.getItems ();

      for (var sessionKey in sessionList) {
        if (sessionList.hasOwnProperty(sessionKey)) {
          console.log ('Broadcasting to session ' + sessionKey);
          let sessionObject = sessionList[sessionKey];

          let outgoingMessage=new KMessageObject ();
          outgoingMessage.namespace="*";
          outgoingMessage.session=sessionObject.session;
          outgoingMessage.count=sessionObject.count++;

          sessionObject.socket.send (outgoingMessage.build ());
        }
      }
    } else {
      console.log ("Replying to regular session " + newMessage.session);
      let outgoingMessage=new KMessageObject ();
      outgoingMessage.namespace=newMessage.namespace;
      outgoingMessage.session=newMessage.session;
      outgoingMessage.count=aSessionObject.count++;      
      aSocket.send (outgoingMessage.build ());
    }
  }
}

export default KUIServer;
