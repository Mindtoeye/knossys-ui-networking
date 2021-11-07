import React, { Component } from 'react';

import KGUID from './KGUID';
//import KQueue from './KQueue';
import KConsoleTools from './KConsoleTools';
import KCommandParser from './KCommandParser';
import KAbstractConsole from './KAbstractConsole';
import KConsoleContent from './KConsoleContent';

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

    this.consoleTools=new KConsoleTools ();

    this.queue=new KAbstractConsole ();
    this.queue.setQueueSize (200);

    this.state = {
      id: this.guidGenerator.guid,
      prompt: this.prompt,
      value: "",
      lines: [],
      showTimestamps: true
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
    //console.log ("componentDidUpdate ()");

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
        let result=this.interpretCommand (clean);        
        this.queue.println (result);
        this.setState({      
          value: "",
          lines: this.queue.getQueue ()
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
    this.queue.println (aLine);

    this.setState({      
      lines: this.queue.getQueue()
    });

    if (aCallback) {
      aCallback ();
    }    
  }

  /**
   *
   */
  send (aString) {
    if (this.props.connector) {
      this.props.connector.send ("Hello World");
    }
  }
  
  /**
   *
   */
  render () {
    return (<div className="genericWindow" style={{'left' : this.props.x+'px', 'top': this.props.y+'px'}}>
        <div className="consoletitle">
        Knossys Drydock thin client window
        </div>
        <KConsoleContent lines={this.state.lines} showTimestamps={this.state.showTimestamps} />
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