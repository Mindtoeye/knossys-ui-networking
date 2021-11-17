/*

 Example:
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
  
  /**
   * 
   */  
  constructor () {
    this.namespace = "anonymous";
    this.session = "",
    this.payload = null;
    this.count= 0;
  }

  /**
   * 
   */
  process (incoming) {
    //console.log (incoming);

    let parsed=null;
    let data=null;

    try {
      parsed=JSON.parse(incoming);
    } catch (e) {
      return false;
    }

    if (parsed.data) {
      console.log ("Warning, no data header found in message, assuming event object");
      data=parsed.data;
    } else {
      data=parsed;
    }

    if (!data) {
      console.log ("Invalid message");
      return (false);
    }

    //console.log('process' + JSON.stringify (data));

    this.namespace=data.namespace;
    this.session=data.session;

    //console.log ("Processing data for: " + this.namespace + ", and session: " + this.session);

    return (true);
  }

  /**
   * 
   */
  build () {
    let aMessage={};
    aMessage.namespace=this.namespace;
    aMessage.session=this.session;
    aMessage.count=this.count;
    aMessage.payload=this.payload;

    return (JSON.stringify (aMessage));
  }
}

export default KMessageObject;
