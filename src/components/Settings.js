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

class Settings extends Component {

  render() {
    return (
      <div id='settingspage'>
        <nav className="navbar navbar-light fixed-top flex-md-nowrap p-0 shadow" style={{backgroundColor: "#FFFF", borderBottom: '5px solid #00266b'}}>
            <Link to="https://sg.linkedin.com/in/shankarsanjay" className="link" style={{color: "#000", marginLeft: "50px", fontSize: '30px', fontWeight: '50pt', textDecoration: 'none'}} target="_blank">Portobillo</Link>
            <Link to="/" className="link" style={{color: "#00266b", marginLeft: "-150px", marginTop: "5px", fontSize: '20px'}}>Home</Link>
            <Link to="/requestpayment" className="link" style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Request Payment</Link>
            <Link to="/paybill" className="link" style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Pay Bill</Link>
            <Link to="/settings" className="link" style={{color: "#00266b", marginLeft: "-170px", marginTop: "5px", fontSize: '20px'}}>Settings</Link>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text" style={{marginRight: "30px", fontSize: '16px'}}><span id="account"> Account: {this.props.account}</span></small>
              </li>
            </ul>
        </nav>

        <h2 style = {{color: '#000', marginBottom:'20px', marginTop: '100px'}}>
        Add Valid Payees
        </h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const validPayee = this.validPayee.value
          const payer = this.props.account
          this.props.addValidPayee(validPayee, payer)
          alert("New Payee is being authorised to send you payment requests. Proceed with caution!")
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="validPayee"
              type="text"
              ref={(input) => { this.validPayee = input }}
              className="form-control"
              placeholder="Enter address of Payee"
              required />
          </div>
          <button type="submit" className="btn btn-primary" style = {{backgroundColor: '#00266B'}}>Add Payee</button>
        </form>

        <h2 style = {{color: '#000', marginBottom:'20px', marginTop: '50px'}}>Valid Payees</h2> 
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Payee Address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="validPayeeList">
          { this.props.validPayeesList.map((validPayee, key) => {
              return(
                <tr key={key}>
                  <td>{validPayee}</td>
                  <td>
                    {  <button
                          // name={ValidPayee.id}
                          // value={ValidPayee.amount}
                          style = {{backgroundColor: 'maroon', borderRadius:'10px', color: 'white', padding: '2px 5px'}}
                          onClick={(event) => {
                            console.log("Remove button has been clicked")
                            // this.props.payBill(event.target.name, event.target.value)
                            alert('You have deleted this payee.')
                          }}
                        >
                          Remove
                        </button>
                    }
                    </td>
                </tr>
              )      
          })}

          </tbody>
        </table>

        <h2 style = {{color: '#000', marginTop:'40px', marginBottom:'20px'}}>View and Update Upper Limit</h2>
        <h6 style = {{color: 'maroon', marginBottom:'20px'}}> Note: Automatic payment will be disabled for payments that cost more than set upper limit. </h6>

        <h5 style = {{marginBottom:'20px'}}>The upper limit for bill amounts is currently: <span style = {{color:'green'}}>{this.props.upperLimit/1000000000000000000} ETH</span></h5> 
        <form onSubmit={(event) => {
          event.preventDefault()
          const newUpperLimit = window.web3.utils.toWei(this.newUpperLimit.value.toString(), 'Ether')
          this.props.setUpperLimit(newUpperLimit)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="upperLimit"
              type="text"
              ref={(input) => { this.newUpperLimit = input }}
              className="form-control"
              placeholder="New Upper Limit Amount"
              required />
          </div>
          <button type="submit" className="btn btn-primary" style = {{backgroundColor: '#00266B'}}>Update</button>
        </form> <br></br>

      </div>
      
    );
  }
}

export default Settings;