import React, { Component } from 'react';

import KGUID from './KGUID';
import KConsoleTools from './KConsoleTools';
import KCommandParser from './KCommandParser';

import './styles/main.scss';

/**
 * 
 */
class KnossysConsole extends Component {

  /**
   * 
   */
  constructor (props) {
    super(props);

    this.parser=new KCommandParser ();
    this.prompt="disconnected > ";
    this.guidGenerator=new KGUID ();  

    this.showTimestamps=true;
    this.consoleTools=new KConsoleTools ();

    this.state = {
      id: this.guidGenerator.guid,
      prompt: this.prompt,
      value: "",
      lines: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    if (this.props.connector) {
      this.props.connector.registerConnection (this.state.id);
    } else {
      this.println ("Error: no connector available to register connection");
    }
  }

  /**
   * 
   */
  componentWillUnmount() {
    console.log ("componentWillUnmount ()");    

    if (this.props.connector) {
      this.props.connector.unregisterConnection (this.state.id);
    } else {
      this.println ("Error: no connector available to register connection");
    }    
  }

  /**
   * 
   */
  componentDidUpdate(prevProps) {
    console.log ("componentDidUpdate ()");

    console.log ("New data: " + this.props.data);
    console.log ("Prev data: " + prevProps.data);

    if (this.props.data !== prevProps.data) {
      this.println (this.props.data);
    }
  }  

  /**
   * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
   */
  handleChange(event) {
    let checker=event.target.value;

    if (checker.indexOf ("\n")!==-1) {
      let oneliner=checker.replace(/(\r\n|\n|\r)/gm, "");
      let clean=oneliner;
      
      this.println (clean,() => {
        let newLines=this.state.lines;
        let result=this.interpretCommand (clean);
        newLines.push (result);
        this.setState({      
          lines: newLines
        });
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
  println (aLine,aCallback) {
    console.log ("println ("+aLine+")");

    let newLines=this.state.lines;

    if (this.showTimestamps===true) {
      let timestamp=this.consoleTools.getTimestamp ();
      newLines.push ("[" + timestamp + "] " + aLine);
    } else {
      newLines.push (aLine);
    }

    this.setState({
      value: "",
      lines: newLines
    },() => {
      if (aCallback) {
        aCallback ();
      }
    });
  }

  /**
   *
   */
  send (aString) {
    console.log ("send ()");

    //this.state.websocket.sendData ("root.react.init", {"data": aString});
    if (this.connector) {
      this.connector.send ("Hello World");
    }
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
 
export default KnossysConsole;
