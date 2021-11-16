/*

{
   "data":{
      "namespace":"root.react.init",
      "session":"8623bda3-d3be-54fc-c6fe-06e585b567eb",
      "payload":{
         "data":"ping 230"
      }
   }
}

*/

/**
 * 
 */ 
class KMessageObject {
  
  constructor () {
    this.namespace = "";
    this.session = "",
    this.payload = null;
  }

  /**
   * 
   */
  process (incoming) {
    //console.log('KMessageObject: received: %s', incoming);

    let parsed=null;

    try {
      parsed=JSON.parse(incoming);
    } catch (e) {
      return false;
    }

    if (!parsed.data) {
      console.log ("Error, no data header found in message");
      return;
    }    

    let data=parsed.data;

    this.namespace=data.namespace;
    this.session=data.session;

    console.log ("Processing data for: " + this.namespace + ", and session: " + this.session);

    return (true);
  }

  /**
   * 
   */
  build () {
    let aMessage={};
    aMessage.namespace=this.namespace;
    aMessage.session=this.session;
    aMessage.payload={
      payload: "pong"
    };

    return (JSON.stringify (aMessage));
  }
}

export default KMessageObject;
