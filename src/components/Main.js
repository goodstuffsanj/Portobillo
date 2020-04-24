import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content"> 
        {/* <div></div> */}
        <h2 style = {{color: '#000', marginTop:'40px', marginBottom:'20px'}}>Request Payment</h2>

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
        <h2 style = {{color: '#000', marginBottom:'20px'}}>Your Payments</h2> 
        <h6 style = {{color: 'maroon', marginBottom:'20px'}}> Note: Payments must be made within 14 days of request. If not, the payee has every right to charge relevant additional charges in the next payment cycle. </h6>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Bill Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Payee Address</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.bills.map((bill, key) => {
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
          })}

          </tbody>
        </table>
        <h2 style = {{color: '#000', marginBottom:'20px', marginTop: '50px'}}>
        {/* {
          (this.props.account===bill.payer)? <h2> Update Valid Payees </h2> : null
        } */}
        Update Valid Payees
        </h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const validPayee = this.validPayee.value
          this.props.addValidPayee(validPayee)
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
          <thead>
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
                          onClick={(event) => {
                            console.log("Remove button has been clicked")
                            this.props.payBill(event.target.name, event.target.value)
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
        {/* <table className="table">
          <thead>
            <tr>
              <th scope="col">Payee Address</th>
            </tr>
          </thead>
          <tbody id="payeesList">
            <tr>
              <th scope="row">{this.validPayee}</th>
            </tr>
          { this.props.validPayeesList.map((validPayee, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{this.validPayee}</th>
                </tr>
              )       
          })}

          </tbody>
        </table> */}
        
      </div>
    );
  }
}

export default Main;