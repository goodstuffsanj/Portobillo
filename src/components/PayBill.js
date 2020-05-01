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

class PayBill extends Component {

  render() {
    return (
      <div id = 'paybillpage'>
        <nav className="navbar navbar-light fixed-top flex-md-nowrap p-0 shadow" style={{backgroundColor: "#FFFF", borderBottom: '5px solid #00266b'}}>
            <Link to="/" className="link" style={{color: "#000", marginLeft: "50px", fontSize: '30px', fontWeight: '50pt', textDecoration: 'none'}} target="_blank">Portobillo</Link>
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

        <h2 style = {{color: '#000', marginBottom:'20px', marginTop: '100px'}}>Your Payments</h2> 
        <h6 style = {{color: 'maroon', marginBottom:'20px'}}> Note: Payments must be made within 14 days of request. If not, the payee has every right to charge relevant charges in the next payment cycle. </h6>
        <h6 style = {{color: 'maroon', marginBottom:'20px'}}> Note: Payments highlighted in red below either cost more than the set upper limit or are requests from unauthortised parties. Automatic payment  </h6>
        <h6 style = {{color: 'maroon', marginBottom:'20px', marginLeft:'40px'}}> will be disabled for the respective payments. </h6>

        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Bill Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Payee Address</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody id="billList">
          { this.props.bills.map((bill, key) => {
            
              if(bill.amount >= this.props.upperLimit || !this.props.validPayeesList.includes(bill.payee)) {
                console.log("Bill amount is greater than set upper limit.")
                if(this.props.account===bill.payer){
                  return(
                    <tr key={key}>
                      <th scope="row" style = {{backgroundColor: 'maroon', color: 'white'}}>{bill.id.toString()}</th>
                      <td style = {{backgroundColor: 'maroon', color: 'white'}}>{bill.name}</td>
                      <td style = {{backgroundColor: 'maroon', color: 'white'}}>{window.web3.utils.fromWei(bill.amount.toString(), 'Ether')} ETH</td>
                      <td style = {{backgroundColor: 'maroon', color: 'white'}}>{bill.payee}</td>
                      <td style = {{backgroundColor: 'maroon', color: 'white'}}>
                        { !bill.alreadyPaid
                          ? <button
                                className="btn btn-primary" 
                                style = {{backgroundColor: '#00266B'}}
                              name={bill.id}
                              value={bill.amount}
                              onClick={(event) => {
                                console.log("Pay button has been clicked")
                                this.props.payBill(event.target.name, event.target.value)
                              }}
                            >
                              Pay
                            </button>
                          : <b style = {{color: 'green'}}>Paid</b>
                        }
                        </td>
                    </tr>
                  )
                } 
              }    
              else {
                if(this.props.account===bill.payer){
                  return(
                    <tr key={key}>
                      <th scope="row">{bill.id.toString()}</th>
                      <td>{bill.name}</td>
                      <td>{window.web3.utils.fromWei(bill.amount.toString(), 'Ether')} ETH</td>
                      <td>{bill.payee}</td>
                      <td>
                        { !bill.alreadyPaid
                          ? <button
                            className="btn btn-primary" 
                            style = {{backgroundColor: '#00266B'}}
                              name={bill.id}
                              value={bill.amount}
                              onClick={(event) => {
                                console.log("Pay button has been clicked")
                                this.props.payBill(event.target.name, event.target.value)
                              }}
                            >
                              Pay
                            </button>
                          : <b style = {{color: 'green'}}>Paid</b>
                        }
                        </td>
                    </tr>
                  )
                }  
              } 
            
          })}

          </tbody>
        </table>

      </div>
      
    );
  }
}

export default PayBill;