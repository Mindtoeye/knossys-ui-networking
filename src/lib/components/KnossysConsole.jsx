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

    this.refId=props.connector.getReference ();

    this.consoleTools=new KConsoleTools ();

    this.queue=new KAbstractConsole ();
    this.queue.setQueueSize (200);

    this.history=new KQueue ();
    this.history.setQueueSize (200);

    this.state = {
      id: this.refId,
      historyIndex: 0,
      prompt: "conn: ? > ",
      value: "",
      lines: [],
      showTimestamps: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.clearScreen = this.clearScreen.bind(this);
    this.showStatus = this.showStatus.bind(this);
    this.generateBroadcast = this.generateBroadcast.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.parser.addCommand ("clear", () => { this.clearScreen (); return (null); });
    this.parser.addCommand ("status", () => { this.showStatus (); return (null); });
    this.parser.addCommand ("seturl $string", (aURL) => { 
      let result=this.props.connector.setURL (aURL); 
      if (result.ok==false) {
        this.error (result.statusMessage);
      } else {
        this.println (result.statusMessage);
      }
      return (null);
    });
    this.parser.addCommand ("broadcast $string", (aString) => { return (this.generateBroadcast (aString)); });
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

    if (this.props.connector.connected!=prevProps.connector.connected) {
      this.setState ({
        prompt: "conn: "+this.props.connector.connected+" > "
      });
    }
  }

  /**
   * 
   */
  onMessage (aMessage) {
    console.log ("onMessage ()");    
  }

  /**
   * 
   */
  clearScreen () {
    console.log ("clearScreen ()");
    this.queue.reset();
    this.setState({
      lines:[]
    });
  }

  /**
   * 
   */
  showStatus () {
    console.log ("showStatus ()");
    this.println (this.props.connector.getStatus ());
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
        } 
        this.setState({      
          historyIndex: (this.queue.getQueue().length-1),
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
      let r=this.props.parser.cmd (singleCmd.trim ());
      if (r!=null) {
        result=result + r;
      }
    }

    if (result=="") {
      return (null);
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
  error (aLine) {
    this.queue.error (aLine);    

    this.setState({      
      lines: this.queue.getQueue()
    });    
  }  

  /**
   *
   */
  send (aString) {
    if (this.props.connector) {
      this.props.connector.send (this.refId,aString);
    }
  }

  /**
   *
   */
  generateBroadcast (aString) {
    if (this.props.connector) {
      this.props.connector.send ("*",aString);
    }    
  }
  
  /**
   *
   */
  render () {    
    return (<div ref={this.refId} className="genericWindow" style={{'left' : this.props.x+'px', 'top': this.props.y+'px', 'width' : this.props.width+'px', 'height': this.props.height+'px'}}>
        <div className="consoletitle">
        Knossys Drydock thin client window
        </div>
        <KConsoleContent connector={this.props.connector} lines={this.state.lines} showtimestamps={this.state.showTimestamps} />
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
