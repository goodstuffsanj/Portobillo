import React, { Component } from 'react';
// import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'; 
import BillRentalPayment from '../abis/BillRentalPayment.json';
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {  //lifefcycle method that comes as part of react
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = BillRentalPayment.networks[networkId]
    if(networkData) {
      const billrentalpayment = web3.eth.Contract(BillRentalPayment.abi, networkData.address) //this is our actual smart contract and how we actually load it from the blockchain
      console.log(billrentalpayment)
      this.setState({billrentalpayment})
      const numberOfTransactions = await billrentalpayment.methods.numberOfTransactions().call()
      console.log(numberOfTransactions.toString())
      this.setState({ loading: false})
    }
    else {
      window.alert('Portobillo contract not deployed to detected network.')
    }
    console.log(networkId)
    console.log(BillRentalPayment.abi, BillRentalPayment.networks[networkId].address) //the latter is the address of the smart contract
    
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      numberOfTransactions: 0,
      bills: [],
      loading: true
    }
    this.requestPayment = this.requestPayment.bind(this) //this is how we let react know that requestpayment we are passing as a prop in the HTML below is the same as the function right below this constructor
  }

  requestPayment(name, amount, payer) {
    this.setState({ loading: true })
    this.state.billrentalpayment.methods.requestPayment(name, amount, payer).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className = "row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main requestPayment={this.requestPayment} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
