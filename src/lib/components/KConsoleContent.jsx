import React, { Component } from 'react';

import './styles/main.scss';

/**
 * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
 */
class KConsoleContent extends Component {

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
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  /**
   *
   */
  render () {
    let showtimestamps=true;
    let lines=this.props.lines;
    let lineElements=[];
    let i;

    if (this.props.showtimestamps) {
      showtimestamps=this.props.showtimestamps;
    }

    for (i=0;i<lines.length;i++) {
      let consoleLine=lines[i];
      if (showtimestamps===true) {
        lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline"><span className="kcolor-yellow">[</span><span className="kcolor-green">{consoleLine.timestamp}</span><span className="kcolor-yellow">]</span>{consoleLine.line}</p>);
      } else {
        lineElements.push (<p key={"kconsole-line-"+i} className="kconsoleline">{consoleLine.line}</p>);
      }
    }

    lineElements.push (<div key={"kconsole-line-end"} style={{ float:"left", clear: "both" }}
      ref={(el) => { this.messagesEnd = el; }}>
    </div>);

    return (<div className="consoleContent">
      {lineElements}
    </div>);
  }
}

export default KConsoleContent;
