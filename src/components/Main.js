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
          <button type="submit" className="btn btn-primary">Request Payment</button>
        </form> <br></br><br></br>

        <p> </p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            <tr>
              <th scope="row">1</th>
              <td>iPhone x</td>
              <td>1 Eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Macbook Pro</td>
              <td>3 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Airpods</td>
              <td>0.5 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;