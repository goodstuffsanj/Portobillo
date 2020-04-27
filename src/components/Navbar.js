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
          style={{color: "#000", marginLeft: "20px", fontSize: '30px', fontWeight: '50'}}
        >
          Portobillo
        </a>
        <a
          className=""
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{color: "#00266b", marginLeft: "-200px", marginTop: "5px",fontSize: '20px'}}
        >
          Home
        </a>
        <a
          className=""
          href="/requestpayment"
          target="_blank"
          rel="noopener noreferrer"
          style={{color: "#00266b", marginLeft: "-130px", marginTop: "5px", fontSize: '20px'}}
        >
          Request Payment
        </a>
        <a
          className=""
          href="https://sg.linkedin.com/in/shankarsanjay"
          target="_blank"
          rel="noopener noreferrer"
          style={{color: "#00266b", marginLeft: "-130px", marginTop: "5px", fontSize: '20px'}}
        >
          Pay Bill
        </a>
        <a
          className=""
          href="https://sg.linkedin.com/in/shankarsanjay"
          target="_blank"
          rel="noopener noreferrer"
          style={{color: "#00266b", marginLeft: "-130px", marginTop: "5px", fontSize: '20px'}}
        >
          Settings
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text" style={{marginRight: "30px", fontSize: '16px'}}><span id="account"> Account: {this.props.account}</span></small>
          </li>
        </ul>
      </nav>

    );
  }
}
export default Navbar;