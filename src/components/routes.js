import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Web3 from 'web3'; 
import BillRentalPayment from '../abis/BillRentalPayment.json';
import Navbar from './Navbar'
import Main from './Main'
import Home from './Home'
import RequestPayment from './RequestPayment'


export const Routes = <div>
            {/* <Route exact path="/" component={ Home } /> */}

            <Route path="/requestpayment" component={ RequestPayment }/>
            {/* <Route path="/cart" component={ Cart } />
            <Route path="/order-status" component={ OrderStatus } />
            <Route path="/gift-cards" component={ GiftCards } />
            <Route path="/returns-exchanges" component={ ReturnsExchanges } />
            <Route path="/contact" component={ Contact } /> */}
            </div>