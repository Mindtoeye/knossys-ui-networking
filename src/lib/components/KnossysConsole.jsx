import React, { Component } from 'react';

import KGUID from './KGUID';
import KQueue from './KQueue';
import KConsoleTools from './KConsoleTools';
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

    this.parser=props.parser;
    this.prompt="disconnected > ";
    this.guidGenerator=new KGUID ();  

    this.consoleTools=new KConsoleTools ();

    this.queue=new KAbstractConsole ();
    this.queue.setQueueSize (200);

    this.history=new KQueue ();
    this.history.setQueueSize (200);

    this.state = {
      id: this.guidGenerator.guid,
      historyIndex: 0,
      prompt: this.prompt,
      value: "",
      lines: [],
      showTimestamps: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.clearScreen = this.clearScreen.bind(this);
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

    this.parser.addCommand ("clear", (aValue) => {this.clearScreen ();});
    this.parser.addCommand ("showtimestamps $boolean", (toggle) => { this.setState ({showTimestamps: toggle}); return ("set 'showTimestamps' to: " + toggle); });
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
    if (this.props.data !== prevProps.data) {
      this.println (this.props.data);
    }
  }  

  /**
   * 
   */
  clearScreen () {
    console.log ("clearScreen ()");
    this.setState({
      lines:[]
    });
  }

  /**
   * 
   */
  handleChange(event) {
    let checker=event.target.value;

    if (checker.indexOf ("\n")!==-1) {
      let oneliner=checker.replace(/(\r\n|\n|\r)/gm, "");
      let clean=oneliner;
      
      this.history.enqueue(clean);

      this.println (clean,() => {
        let result=this.interpretCommand (clean);
        if (result) {
          this.queue.println (result);        
          this.setState({      
            historyIndex: (this.queue.getQueue().length-1),
            value: "",
            lines: this.queue.getQueue ()
          });
        }
      });

      return;
    }

    this.setState({
      value: checker
    });  
  }

  /**
   * 
   */
  keyDown (e) {
    if (e.keyCode===38) {
      let queue=this.history.getQueue ();
      let index=this.state.historyIndex;

      index--;
      if (index<0) {
        index=0;
      }

      this.setState ({
        historyIndex: index,
        value: queue[index]
      });
      return;
    }

    if (e.keyCode===40) {
      let queue=this.history.getQueue ();
      let index=this.state.historyIndex;

      index++;
      if (index>(queue.length-1)) {
        index=queue.length-1;
      }

      this.setState ({
        historyIndex: index,
        value: queue[index]
      });
      return;
    }
  }  

  /**
   * https://gymconsole.app/blog/create-command-parser
   */
  interpretCommand (aCommandString) {
    console.log ("interpretCommand ("+aCommandString+")");

    if (this.props.parser==null) {
      return ("Error: no command interpreter provided");
    }

    let splitter=aCommandString.split (";");
    let result="";

    for (let i=0;i<splitter.length;i++) {
      if (i>0) {
        result=result+ ", ";
      }
      let singleCmd=splitter[i];
      result=result + this.props.parser.cmd (singleCmd.trim ());
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
        <KConsoleContent lines={this.state.lines} showtimestamps={this.state.showTimestamps} />
        <div className="kconsole">
          <div className="kconsoleprompt">
            {this.state.prompt}
          </div>
          <textarea className="kconsoleinput" value={this.state.value} onKeyDown={this.keyDown} onChange={this.handleChange} rows="1" />
        </div>
      </div>);    
  }
}
 
export default KnossysConsole;
