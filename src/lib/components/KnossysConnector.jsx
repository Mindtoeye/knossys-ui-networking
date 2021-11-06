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

    this.parser=new KCommandParser ();
    this.prompt="> ";

    this.state = {
      value: this.prompt,
      lines: [],
      websocket: null,
      wsdata: {},
      wsretry: false
    };

    this.handleChange = this.handleChange.bind(this);
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
    var networkConfig=new KNetworkEnvironment ();
    //networkConfig.configWebsocket (location.host);    
      
    console.log ("createWebSocket ("+networkConfig.getGateway ()+")");
      
    if (this.state.websocket==null) {      
      var wssocket = new KWebSocket(networkConfig.getGateway ());
        
      var newWebSocket=new KWebSocket ();
      newWebSocket.setSocket (wssocket);
          
      this.setState ({
        websocket: newWebSocket,
        wsdata: {},
        wsretry: false
      }, () => {
        this.state.websocket.getsocket ().addEventListener('open', this.handleWebsocketOpen.bind(this));  
        this.state.websocket.getsocket ().addEventListener('message', this.handleWebsocketData.bind(this));    
        this.state.websocket.getsocket ().addEventListener('error', this.handleWebsocketError.bind(this));
        this.state.websocket.getsocket ().addEventListener('close', this.handleWebsocketClose.bind(this));               
      });
    }
  } 
  
  /**
   * Note: the incoming data is already parsed data
   */
  handleWebsocketOpen(event) {
    console.log ("handleWebsocketOpen ()");
    
    this.setState({connected: true, wsdata: null, wsretry: false}, () => {
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
    //console.log ("handleWebsocketData ()");
    //console.log ("Data: " + event.data);
    
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
   * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
   */
  handleChange(event) {
    let checker=event.target.value;

    if (checker.indexOf ("\n")!==-1) {
      let newLines=this.state.lines;
      let oneliner=checker.replace(/(\r\n|\n|\r)/gm, "");
      let clean=oneliner.substring (2);
      
      newLines.push (clean);

      let result=this.interpretCommand (clean);

      newLines.push (result);

      this.setState({
        value: this.prompt,
        lines: newLines
      });
      return;
    }

    if (checker.length<2) {
      checker="> ";
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
      let singleCmd=splitter [i];
      result=result + this.parser.cmd (singleCmd.trim ());
    }

    return (result);
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
        <div className="consoleContent">
        {lineElements}
        </div>
        <div className="kconsole">
          <div className="kconsoleprompt">{this.state.prompt}</div>
          <textarea className="kconsoleinput" value={this.state.value} onChange={this.handleChange} rows="1" />
        </div>
      </div>);    
  }
}
 
export default KnossysConnector;
