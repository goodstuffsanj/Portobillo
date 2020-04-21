import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Request Payment</h1>

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

        <p> </p>
        <h1>Your Payments</h1> 
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Bill Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Payee Address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.bills.map((bill, key) => {
            return(
              <tr key={key}>
                <th scope="row">{bill.id.toString()}</th>
                <td>{bill.name}</td>
                <td>{window.web3.utils.fromWei(bill.amount.toString(), 'Ether')} ETH</td>
                <td>{bill.payee}</td>
                <td>
                  { !bill.alreadyPaid
                    ? <button
                        name={bill.id}
                        value={bill.amount}
                        onClick={(event) => {
                          console.log("Pay button has been clicked")
                          this.props.payBill(event.target.name, event.target.value)
                        }}
                      >
                        Pay
                      </button>
                    : <i>Paid</i>
                  }
                  </td>
              </tr>
            )
          })}

          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;