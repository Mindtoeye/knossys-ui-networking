import React, { Component } from 'react';

//import KAbstractConsoleLine from './KAbstractConsoleLine';

import './styles/main.scss';

/**
 *
 */
class KConsoleContent extends Component {

  /**
   *
   */
  /* 
  constructor (props) {
    super (props);
  }
  */

  /**
   *
   */
  render () {
    let lines=this.props.lines;
    let lineElements=[];
    let i;

    for (i=0;i<lines.length;i++) {
      let consoleLine=lines[i];
      lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline"><span className="kcolor-yellow">[</span><span className="kcolor-green">{consoleLine.timestamp}</span><span className="kcolor-yellow">]</span>{consoleLine.line}</p>);
    }

    return (<div className="consoleContent">
      {lineElements}
    </div>);
  }
}

export default KConsoleContent;
