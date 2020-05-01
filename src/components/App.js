import React, { Component } from 'react';
// import logo from '../logo.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Web3 from 'web3'; 
import BillRentalPayment from '../abis/BillRentalPayment.json';
import Navbar from './Navbar'
import Main from './Main'
import Home from './Home'
import RequestPayment from './RequestPayment'
import PayBill from './PayBill'
import Settings from './Settings'

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
      
      const thisAccount = this.state.account 
      console.log(thisAccount) 
      this.setState({ payer: thisAccount })
      console.log(this.state.payer)

      const numberOfValidPayees = await billrentalpayment.methods.numberOfValidPayees(thisAccount).call()
      console.log(numberOfValidPayees.toString())

      var upperLimitValue = await billrentalpayment.methods.upperLimit(thisAccount).call()
      if((upperLimitValue.toString()) != 0) {
        console.log('Amount is 0')
        this.setState({upperLimit: upperLimitValue})
      }
      else {
        this.setState({upperLimit: 50000000000000000000}) //default upper limit is 50 ETH
      }
      console.log((upperLimitValue/1000000000000000000).toString())
      console.log(upperLimitValue)

      // Load bills
      for (var i = 1; i <= numberOfTransactions; i++) {
        const bill = await billrentalpayment.methods.bills(i).call()
        this.setState({
          bills: [...this.state.bills, bill]
        })
      }
      console.log("Bills have been loaded")

      for (var j = 0; j < numberOfValidPayees; j++) {
        const validPayee = await billrentalpayment.methods.validPayeesList(thisAccount, j).call()
        this.setState({
          validPayeesList: [...this.state.validPayeesList, validPayee]
        })
      }
      console.log("valid payees have been loaded")
      console.log(this.state.bills)
      console.log(this.state.validPayeesList)


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
      numberOfValidPayees: 0,
      bills: [],
      validPayeesList: [],
      loading: true
    }
    this.requestPayment = this.requestPayment.bind(this) //this is how we let react know that requestpayment we are passing as a prop in the HTML below is the same as the function right below this constructor
    this.payBill = this.payBill.bind(this)
    this.addValidPayee = this.addValidPayee.bind(this)
    this.setUpperLimit = this.setUpperLimit.bind(this)
  }

  requestPayment(name, amount, payer) {
    this.setState({ loading: true })
    if(amount < 0) {
      alert("You have entered a negative amount which means you will be paying the payer. Is that what you want? I think not.")
      window.location.reload()
    }
    if(amount >= 50000000000000000000) {
      alert("Wow. That is quite a big amount. Please reject transaction if it is incorrect.")
    }
    this.state.billrentalpayment.methods.requestPayment(name, amount, payer).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  payBill(id, amount) {
    this.setState({ loading: true })
    if(amount >= this.state.upperLimit) {
      alert("This bill costs more than the set upper limit! Proceed with caution.")
    }
    this.state.billrentalpayment.methods.payBill(id).send({ from: this.state.account, value: amount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  addValidPayee(validPayee, payer) {
    this.setState({ loading: true })
    console.log("Inside addvalidpayee in app.js")
    this.state.billrentalpayment.methods.addValidPayee(validPayee, payer).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
    console.log("After calling addvalidpayee in app.js ")
  }

  setUpperLimit(newUpperLimit) {
    console.log(newUpperLimit)
    console.log(this.state.upperLimit)
    this.state.billrentalpayment.methods.setUpperLimit(newUpperLimit, this.state.payer).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({upperLimit: newUpperLimit})
    })
    console.log(this.state.upperLimit)
  }

  render() {
      return (
        <Router>
            <Switch>
              {/* <Route path='/' component={Navbar}/> */}
              <Route exact path='/' render={(props) => { return (<Home {...props} account={this.state.account}/>); }}/>
              <Route path='/requestpayment' render={(props) => { return (<RequestPayment {...props} state={this.state} account={this.state.account} bills={this.state.bills} validPayeesList={this.state.validPayeesList} upperLimit = {this.state.upperLimit} requestPayment={this.requestPayment} payBill={this.payBill} addValidPayee={this.addValidPayee} setUpperLimit={this.setUpperLimit}/>); }} />
              <Route path='/paybill' render={(props) => { return (<PayBill {...props} account={this.state.account} bills={this.state.bills} validPayeesList={this.state.validPayeesList} upperLimit = {this.state.upperLimit} requestPayment={this.requestPayment} payBill={this.payBill}  addValidPayee={this.addValidPayee} setUpperLimit={this.setUpperLimit}/>); }} />
              <Route path='/settings' render={(props) => { return (<Settings {...props} account={this.state.account} bills={this.state.bills} validPayeesList={this.state.validPayeesList} upperLimit = {this.state.upperLimit} requestPayment={this.requestPayment} payBill={this.payBill}  addValidPayee={this.addValidPayee} setUpperLimit={this.setUpperLimit}/>); }} />
            </Switch>  
        </Router>  

      );
    }
  }

export default App;