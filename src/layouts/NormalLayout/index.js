import React, { Component } from 'react';
import './style.scss';

class NormalLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="normalLayout">
        {children}
      </div>
    );
  }
}

export default NormalLayout;
