import React, { Component } from 'react';

import KCommandParser from './lib/components/KCommandParser';
import KnossysConsole from './lib/components/KnossysConsole';
import KnossysConnector from './lib/components/KnossysConnector';
import KnossysConnectorTest from './lib/components/KnossysConnectorTest';

import './Drydock.css';

/**
 * 
 */
class Drydock extends Component {

  /**
   * 
   */
  constructor (props) {
    super (props);

    let connector=new KnossysConnector (this);

    this.parser=new KCommandParser ();
    this.parser.addCommand ("echo $string", (input) => { return (input)});
    this.parser.addCommand ("connect", () => { this.wbConnect(); return ("Connecting ..."); });
    this.parser.addCommand ("disconnect", () => { this.wbDisonnect(); return ("Disconnecting ..."); });
    this.parser.addCommand ("sum $number $number",  (input1,input2) => { return (input1+input2)});

    this.state = {
      connector: connector,
      updateTrigger: 1,
      data: null
    };

    this.wbConnect = this.wbConnect.bind(this);
    this.wbDisonnect = this.wbDisonnect.bind(this);
  }

  /**
   * 
   */
  componentDidMount () {
    this.wbConnect ();
  }

  /**
   * 
   */
  componentWillUnmount() {      
    this.wbDisonnect ();
  }

  /**
   * 
   */
  wbConnect () {
    console.log("");
    if (this.state.connector!=null) {
      this.state.connector.init ();
    }    
  }

  /**
   * 
   */
  wbDisonnect () {
    console.log("wbDisonnect ()");
    if (this.state.connector!=null) {
      this.state.connector.shutdown ();
    }    
  }

  /**
   * 
   */
  onData (newData) {
    console.log ("onData ()");

    this.setState ({
      updateTrigger: this.state.updateTrigger+1, // will remove this later
      data: newData
    });
  } 

  /**
   *
   */
  render () {
    return (
      <div className="desktopContent">
        <KnossysConsole parser={this.parser} connector={this.state.connector} data={this.state.data} x={50} y={50} width={500} height={400} />
        <KnossysConnectorTest connector={this.state.connector} data={this.state.data} x={600} y={50} width={500} height={400} />
        <KnossysConnectorTest connector={this.state.connector} data={this.state.data} x={50} y={460} width={500} height={400} />
      </div>
    );
  }
}

export default Drydock;
