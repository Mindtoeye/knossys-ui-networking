import React, { Component } from 'react';

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
        <KnossysConsole connector={this.state.connector} data={this.state.data} x={50} y={50} />
        <KnossysConnectorTest connector={this.state.connector} data={this.state.data} x={50} y={450} />
      </div>
    );
  }
}

export default Drydock;
