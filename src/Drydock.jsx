import React, { Component } from 'react';

import KnossysConsole from './lib/components/KnossysConsole';
import KnossysConnector from './lib/components/KnossysConnector';

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
      updateTrigger: this.state.updateTrigger+1,
      data: newData
    });
  } 

  /**
   *
   */
  render () {
    return (
      <div className="desktopContent">
        <KnossysConsole connector={this.state.connector} data={this.state.data} />
      </div>
    );
  }
}

export default Drydock;
