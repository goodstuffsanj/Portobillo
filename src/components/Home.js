import React, { Component } from 'react';
import Navbar from './Navbar'
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

class Home extends Component {
  render() {
    return (

        <div id='homepage'>

          <nav className="navbar navbar-light fixed-top flex-md-nowrap p-0 shadow" style={{backgroundColor: "#FFFF", borderBottom: '5px solid #00266b'}}>
            <Link to="https://sg.linkedin.com/in/shankarsanjay" className="link-portobillo" style={{color: "#000", marginLeft: "50px", fontSize: '30px', fontWeight: '50pt', textDecoration: 'none'}} target="_blank">Portobillo</Link>
            <Link to="/" className="link" style={{color: "#00266b", marginLeft: "-150px", marginTop: "5px", fontSize: '20px'}}>Home</Link>
            <Link to="/requestpayment" className="link"  style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Request Payment</Link>
            <Link to="/paybill" className="link" style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Pay Bill</Link>
            <Link to="/settings" className="link" style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Settings</Link>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text" style={{marginRight: "30px", fontSize: '16px'}}><span id="account"> Account: {this.props.account}</span></small>
              </li>
            </ul>
          </nav>
          
          <div id="container4"> 
          <h1 className="welcome-text" style = {{color: '#000', marginTop:'300px', fontSize:'80px', marginLeft:'50px'}}>Welcome!</h1> <br></br><br></br>
          <h2 style = {{color: '#000', marginLeft:'50px'}}>Portobillo is your one stop Utility Bills, Rentals and Subscription Fees Payment Portal.</h2> <br></br><br></br>
          <button type="submit" className="btn-home btn-primary" style = {{backgroundColor: '#00266B', marginLeft:'50px'}}><Link to="/requestpayment" className="link-home" >Get Started</Link></button> <br></br><br></br>
          </div>

        </div>
        
    );
  }
}
export default Home;