import React, { Component } from 'react';

import KGUID from './KGUID';
import KConsoleTools from './KConsoleTools';
import KAbstractConsole from './KAbstractConsole';
import KConsoleContent from './KConsoleContent';

import './styles/main.scss';

/**
 * 
 */
class KnossysConnectorTest extends Component {

  /**
   * 
   */
  constructor (props) {
    super(props);

    this.guidGenerator=new KGUID ();  
    this.consoleTools=new KConsoleTools ();
    this.counter=0;
    this.queue=new KAbstractConsole ();
    this.queue.setQueueSize (200);

    this.state = {
      id: this.guidGenerator.guid,
      lines: [],
      showTimestamps: true
    };

    this.ping=this.ping.bind(this);
  }

  /**
   * 
   */
  componentDidMount () {
    //console.log ("componentDidMount ()");

    if (this.props.connector) {
      this.props.connector.registerConnection (this.state.id);

      setInterval (this.ping,10000);
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

    if (this.props.data !== prevProps.data) {
      this.println ("Data: " + this.props.data);
    }
  }  

  /**
   *
   */
  println (aLine) {
    this.queue.println (aLine);    

    this.setState({      
      lines: this.queue.getQueue()
    });    
  }

  /**
   *
   */
  send (aString) {
    if (this.props.connector) {
      this.props.connector.send (aString);
      this.println (aString);
    } else {
      this.println ("Unable to send, no connector");
    }
  }

  /**
   *
   */
  ping () {
    this.send("ping " + this.counter);
    this.counter=this.counter+1;
  }
  
  /**
   *
   */
  render () {
    return (<div className="genericWindow" style={{'left' : this.props.x+'px', 'top': this.props.y+'px'}}>
        <div className="consoletitle">
        Knossys Drydock automated connector test
        </div>
        <KConsoleContent lines={this.state.lines} showtimestamps={this.state.showTimestamps} />
      </div>);    
  }
}
 
export default KnossysConnectorTest;
