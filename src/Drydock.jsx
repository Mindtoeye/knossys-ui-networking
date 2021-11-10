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
    this.parser.addCommand ("help", () => { return ("Usage: ")});
    this.parser.addCommand ("sum $number $number",  (input1,input2) => { return (input1+input2)});

    this.state = {
      connector: connector,
      updateTrigger: 1,
      data: null
    };
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.state.connector.init ();
  }

  /**
   * 
   */
  componentWillUnmount() {      
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
        <KnossysConsole parser={this.parser} connector={this.state.connector} data={this.state.data} x={50} y={50} />
        <KnossysConnectorTest connector={this.state.connector} data={this.state.data} x={600} y={50} />
      </div>
    );
  }
}

export default Drydock;
