import React, { Component } from 'react';

import './styles/main.scss';

/**
 * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
 */
class KConsoleContent extends Component {

  /**
   *
   */
  constructor (props) {
    super (props);

    this.refId=props.connector.getReference ();
  }

  /**
   *
   */
  componentDidMount() {
    this.scrollToBottom();
  }

  /**
   *
   */
  componentDidUpdate() {
    this.scrollToBottom();
  }

  /**
   *
   */
  scrollToBottom () {
    this.refs[this.refId].scrollIntoView({ behavior: "smooth" });
  }

  /**
   *
   */
  render () {
    let showtimestamps=true;
    let lines=this.props.lines;
    let lineElements=[];
    let i;
    
    if (this.props.hasOwnProperty ("showtimestamps")===true) {
      showtimestamps=this.props.showtimestamps;
    }

    for (i=0;i<lines.length;i++) {
      let consoleLine=lines[i];
      let aLine=consoleLine.line;

      if (consoleLine.error==true) {
        aLine=<span className="kcolor-red">{consoleLine.line}</span>;
      }

      if (showtimestamps===true) {
        lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline"><span className="kcolor-yellow">[</span><span className="kcolor-green">{consoleLine.timestamp}</span><span className="kcolor-yellow">]</span>{aLine}</p>);
      } else {
        lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline">{consoleLine.line}</p>);
      }
    }

    lineElements.push (<div ref={this.refId} key={"kconsole-line-end"} style={{ float:"left", clear: "both" }}></div>);

    return (<div className="consoleContent">
      {lineElements}
    </div>);
  }
}

export default KConsoleContent;
