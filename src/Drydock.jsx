import React, { Component } from 'react';

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

    this.state = {

    };
  }

  /**
   *
   */
  render () {
    return (
      <div className="desktopContent">
        <KnossysConnector />
      </div>
    );
  }
}

export default Drydock;
