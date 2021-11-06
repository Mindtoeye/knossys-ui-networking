import React, { Component } from 'react';

import KNetworkEnvironment from './KNetworkEnvironment';
import KWebSocket from './KWebSocket';
import KCommandParser from './KCommandParser';

import './styles/main.scss';

/**
 * 
 */
class KnossysConnector extends Component {

  /**
   * 
   */
  constructor (props) {
    super(props);

    this.networkConfig=new KNetworkEnvironment ();
    this.networkConfig.setSystemRoot ("192.168.0.108");

    this.parser=new KCommandParser ();
    this.prompt="disconnected > ";

    this.state = {
      connected: false,
      prompt: this.prompt,
      value: "",
      lines: [],
      websocket: null,
      wsdata: {},
      wsretry: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.setupEventHandlers = this.setupEventHandlers.bind(this);
    this.handleWebsocketOpen = this.handleWebsocketOpen.bind(this);  
    this.handleWebsocketData = this.handleWebsocketData.bind(this);    
    this.handleWebsocketError = this.handleWebsocketError.bind(this);
    this.handleWebsocketClose = this.handleWebsocketClose.bind(this);     
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.createWebSocket ();
  }

  /**
   * 
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
      
    if (this.state.websocket!=null) {
      this.state.websocket.close ();
    }
  }

  /**
   * 
   */
  createWebSocket () {                     
    console.log ("createWebSocket ("+this.networkConfig.getGateway ()+")");
      
    if (this.state.websocket==null) {
      console.log ("websocket not yet available, initializing ...");

      var wssocket = new WebSocket(this.networkConfig.getGateway ());
        
      var newWebSocket=new KWebSocket ();
      newWebSocket.setSocket (wssocket);
          
      this.setState ({
        websocket: newWebSocket,
        wsdata: {},
        wsretry: false
      },this.setupEventHandlers);
    }
  } 

  /**
   *
   */
  setupEventHandlers () {
    console.log ("setupEventHandlers ()");

    this.state.websocket.getsocket ().addEventListener('open', this.handleWebsocketOpen);
    this.state.websocket.getsocket ().addEventListener('message', this.handleWebsocketData);
    this.state.websocket.getsocket ().addEventListener('error', this.handleWebsocketError);
    this.state.websocket.getsocket ().addEventListener('close', this.handleWebsocketClose);
  }
  
  /**
   * Note: the incoming data is already parsed data
   */
  handleWebsocketOpen(event) {
    console.log ("handleWebsocketOpen ()");
    
    this.setState({
      connected: true, 
      wsdata: null, 
      wsretry: false
      }, () => {
        console.log ("Connected, sending initial packet ...");
        this.state.websocket.sendData ("root.react.init", {});
    });
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
    
    var JSONObject=JSON.parse (event.data);
    
    if (!JSONObject.data.namespace) {
      console.log ("Internal error: incoming message does not conform to specs");  
      return; 
    }
       
    if (this.processWSMessage (JSONObject)===false) {    
      this.setState({wsdata: JSONObject},() => {
        /*
        if (this.wsReceiver) {
          this.wsReceiver.processWSMessage (); 
        }

        if (this.wsTabReceiver) {
          this.wsTabReceiver.processWSMessage (); 
        }
        
        if (this.wsDatabaseReceiver) {
          this.wsDatabaseReceiver.processWSMessage ();  
        }
        
        if (this.wsPipelineEditorReceiver) {
          this.wsPipelineEditorReceiver.processWSMessage (); 
        }
        */
      });
    }  
  }  

  /**
   * 
   */
  retryWebsocketConnection () {
    console.log ("retryWebsocketConnection ()");

    if (this.state.wsretry==true) {
      return;
    }
         
    this.setState({connected: false}, () => {  
      this.setState ({websocket:null, wsretry: true}, () => {
        setTimeout(this.createWebSocket.bind(this), 5000);    
      })
    });      
  }

  /** 
   * @param {any} data
   */
  handleWebsocketError(data) {    
    //this.retryWebsocketConnection ();
  }  
    
  /** 
   * @param {any} data
   */
  handleWebsocketClose(data) {     
    //this.retryWebsocketConnection ();
  }  

  /**
   * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
   */
  handleChange(event) {
    let checker=event.target.value;

    if (checker.indexOf ("\n")!==-1) {
      let newLines=this.state.lines;
      let oneliner=checker.replace(/(\r\n|\n|\r)/gm, "");
      //let clean=oneliner.substring (2);
      let clean=oneliner;
      
      newLines.push (clean);

      let result=this.interpretCommand (clean);

      newLines.push (result);

      this.setState({
        value: "",
        lines: newLines
      });
      return;
    }

    this.setState({
      value: checker
    });  
  }  

  /**
   * https://gymconsole.app/blog/create-command-parser
   */
  interpretCommand (aCommandString) {
    console.log ("interpretCommand ("+aCommandString+")");

    let splitter=aCommandString.split (";");
    let result="";

    for (let i=0;i<splitter.length;i++) {
      if (i>0) {
        result=result+ ", ";
      }
      let singleCmd=splitter[i];
      result=result + this.parser.cmd (singleCmd.trim ());
    }

    return (result);
  }

  /**
   *
   */
  send (aString) {
    this.state.websocket.sendData ("root.react.init", {"data": aString});
  }
  
  /**
   *
   */
  render () {
    let lines=this.state.lines;
    let lineElements=[];
    let i;

    for (i=0;i<lines.length;i++) {
      lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline">{lines[i]}</p>);
    }

    return (<div className="genericWindow" style={{'left' : '50px', 'top': '50px'}}>
        <div className="consoletitle">
        Knossys Drydock thin client window
        </div>
        <div className="consoleContent">
        {lineElements}
        </div>
        <div className="kconsole">
          <div className="kconsoleprompt">
            {this.state.prompt}
          </div>
          <textarea className="kconsoleinput" value={this.state.value} onChange={this.handleChange} rows="1" />
        </div>
      </div>);    
  }
}
 
export default KnossysConnector;
