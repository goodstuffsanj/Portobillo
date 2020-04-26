import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-light fixed-top flex-md-nowrap p-0 shadow" style={{backgroundColor: "#FFFF", borderBottom: '5px solid #00266b'}}>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://sg.linkedin.com/in/shankarsanjay"
          target="_blank"
          rel="noopener noreferrer"
          style={{color: "#000", marginLeft: "20px", fontSize: '30px', fontWeight: '50pt'}}
        >
          Portobillo
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text" style={{marginRight: "30px"}}><span id="account"> Account: {this.props.account}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Navbar;