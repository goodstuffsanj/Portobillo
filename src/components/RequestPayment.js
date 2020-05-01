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

class RequestPayment extends Component {

  render() {
    return (
      <body>
        <nav className="navbar navbar-light fixed-top flex-md-nowrap p-0 shadow" style={{backgroundColor: "#FFFF", borderBottom: '5px solid #00266b'}}>
            <Link to="/" className="link" style={{color: "#000", marginLeft: "50px", fontSize: '30px', fontWeight: '50pt', textDecoration: 'none'}} target="_blank">Portobillo</Link>
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

        <div id="content"> 
        <h2 style = {{color: '#000', marginTop:'100px', marginBottom:'20px'}}>Request Payment</h2>

        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.billName.value
          const amount = window.web3.utils.toWei(this.billAmount.value.toString(), 'Ether')
          const payer = this.payerAddress.value
          this.props.requestPayment(name, amount, payer)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="billName"
              type="text"
              ref={(input) => { this.billName = input }}
              className="form-control"
              placeholder="A brief description of payment request"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="billAmount"
              type="text"
              ref={(input) => { this.billAmount = input }}
              className="form-control"
              placeholder="Amount"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="payerAddress"
              type="text"
              ref={(input) => { this.payerAddress = input }}
              className="form-control"
              placeholder="Payer Address"
              required />
          </div>
          <button type="submit" className="btn btn-primary" style = {{backgroundColor: '#00266B'}}>Request Payment</button>
        </form> <br></br><br></br>

        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Bill Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Payer Address</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody id="billList">
          { this.props.bills.map((bill, key) => {
            
                if(this.props.account===bill.payee){
                  return(
                    <tr key={key}>
                      <th scope="row" style = {{backgroundColor: 'white', color: '#000'}}>{bill.id.toString()}</th>
                      <td style = {{backgroundColor: 'white', color: '#000'}}>{bill.name}</td>
                      <td style = {{backgroundColor: 'white', color: '#000'}}>{window.web3.utils.fromWei(bill.amount.toString(), 'Ether')} ETH</td>
                      <td style = {{backgroundColor: 'white', color: '#000'}}>{bill.payer}</td>
                      <td style = {{backgroundColor: 'white', color: '#000'}}>
                        { !bill.alreadyPaid
                          ? <b style = {{color: 'orange'}}>Pending</b>
                          : <b style = {{color: 'green'}}>Paid</b>
                        }
                        </td>
                    </tr>
                  )
                }   
            
          })}

          </tbody>
        </table>

      </div>

      </body>
      
    );
  }
}

export default RequestPayment;