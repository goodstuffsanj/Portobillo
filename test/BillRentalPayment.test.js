const BillRentalPayment = artifacts.require('./BillRentalPayment.sol');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('BillRentalPayment', ([accounts, deployer, payee, payer]) => {
    let billrentalpayment
  
    before(async () => {
        billrentalpayment = await BillRentalPayment.deployed()
    })
  
    describe('Deployment', async () => {
      it('Deploys successfully', async () => {
        const address = await billrentalpayment.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })
  
      it('Has a name', async () => {
        const name = await billrentalpayment.name()
        assert.equal(name, 'Portobillo')
      })
  
    })

    describe('Bill request and retrieval', async () => {
      let result, numberOfTransactions
  
      before(async () => {
        result = await billrentalpayment.requestPayment('Starhub x Sanjay Shankar - April Invoice', web3.utils.toWei('1', 'Ether'), '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee })
        numberOfTransactions = await billrentalpayment.numberOfTransactions()
      })
  
      it('Able to request payment', async () => {
        // SUCCESS:
        assert.equal(numberOfTransactions, 1)
        // console.log(result.logs)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), numberOfTransactions.toNumber(), 'ID is correct')
        assert.equal(event.name, 'Starhub x Sanjay Shankar - April Invoice', 'Name/Description is correct')
        assert.equal(event.amount, '1000000000000000000', 'Amount is correct')
        assert.equal(event.payee, payee, 'Payee is correct')
        assert.equal(event.payer, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', 'Payer is correct')
        assert.equal(event.alreadyPaid, false, 'Already paid is correct')
  
        // FAILURE: Bill must have a name/description
        await await billrentalpayment.requestPayment('', web3.utils.toWei('1', 'Ether'), '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;
        // FAILURE: Bill must have an amount specified 
        await await billrentalpayment.requestPayment('Starhub x Sanjay Shankar - April Invoice', undefined, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;
        // FAILURE: Bill must have an amount specified that is non zero and non negative
        await await billrentalpayment.requestPayment('Starhub x Sanjay Shankar - April Invoice', 0, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;

      })

      it('Able to retrieve bills', async () => {
        const bill = await billrentalpayment.bills(numberOfTransactions)
        // SUCCESS:
        assert.equal(bill.id.toNumber(), numberOfTransactions.toNumber(), 'ID is correct')
        assert.equal(bill.name, 'Starhub x Sanjay Shankar - April Invoice', 'Name/Description is correct')
        assert.equal(bill.amount, '1000000000000000000', 'Amount is correct')
        assert.equal(bill.payee, payee, 'Payee is correct')
        assert.equal(bill.payer, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', 'Payer is correct')
        assert.equal(bill.alreadyPaid, false, 'Already paid is correct')

      })
    })

    describe('Bill payment and retrieval', async () => {
      let result, numberOfTransactions
  
      before(async () => {
        result = await billrentalpayment.requestPayment('Starhub x Sanjay Shankar - April Invoice', web3.utils.toWei('1', 'Ether'), '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee })
        numberOfTransactions = await billrentalpayment.numberOfTransactions()
      })

      it('Able to retrieve bills', async () => {
        const bill = await billrentalpayment.bills(numberOfTransactions)
        // SUCCESS:
        assert.equal(bill.id.toNumber(), numberOfTransactions.toNumber(), 'ID is correct')
        assert.equal(bill.name, 'Starhub x Sanjay Shankar - April Invoice', 'Name/Description is correct')
        assert.equal(bill.amount, '1000000000000000000', 'Amount is correct')
        assert.equal(bill.payee, payee, 'Payee is correct')
        assert.equal(bill.payer, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', 'Payer is correct')
        assert.equal(bill.alreadyPaid, false, 'Already paid is correct')

      })

      it('Able to pay Bills', async () => {
        // Track the payee balance before purchase
        let oldPayeeBalance
        oldPayeeBalance = await web3.eth.getBalance(payee)
        oldPayeeBalance = new web3.utils.BN(oldPayeeBalance)
      
        // SUCCESS: Payer can make payment
        result = await billrentalpayment.payBill(numberOfTransactions, { from: payer, value: web3.utils.toWei('1', 'Ether')})
      
        // Check logs
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), numberOfTransactions.toNumber(), 'ID is correct')
        assert.equal(event.name, 'Starhub x Sanjay Shankar - April Invoice', 'Name/Description is correct')
        assert.equal(event.amount, '1000000000000000000', 'Amount is correct')
        assert.equal(event.payee, payee, 'Payee is correct')
        assert.equal(event.payer, '0x35daD51c045eE4aDCe8F25B98510b0cC22268329', 'Payer is correct')
        assert.equal(event.alreadyPaid, true, 'Already paid is correct')
      
        // Check that payee has received amount
        let newPayeeBalance
        newPayeeBalance = await web3.eth.getBalance(payee)
        newPayeeBalance = new web3.utils.BN(newPayeeBalance)
      
        let amount
        amount = web3.utils.toWei('1', 'Ether')
        amount = new web3.utils.BN(amount)
      
        const exepectedBalance = oldPayeeBalance.add(amount)
      
        assert.equal(newPayeeBalance.toString(), exepectedBalance.toString())
      

        // FAILURE: Payer tries to pay a bill that does not exist, i.e., bill must have valid ID
        await billrentalpayment.payBill(100, { from: payer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;    
        // FAILURE: Payer tries to pay bill without enough ETH
        await billrentalpayment.payBill(numberOfTransactions, { from: payer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
        // FAILURE: Deployer tries to pay the bill, i.e., bill can't be paid twice
        await billrentalpayment.payBill(numberOfTransactions, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        // FAILURE: Payer tries to pay bill again after already paying once
        await billrentalpayment.payBill(numberOfTransactions, { from: payer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      })
    })


    describe('Add and retrieve valid Payees', async () => {
      let result, payer
  
      before(async () => {
        result = await billrentalpayment.addValidPayee('0x15D15f4e4Ad6983AB51Bba5aC371c5d4EBa486bB', '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee })
        payer = '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D'
      })

      it('Adds valid payee successfully', async () => {
        // SUCCESS:
        const event = result.logs[0].args
        assert.equal(event.payee, '0x15D15f4e4Ad6983AB51Bba5aC371c5d4EBa486bB', 'Payee is correct')
        assert.notEqual(event.payee, 0x0)
        assert.notEqual(event.payee, '')
        assert.notEqual(event.payee, null)
        assert.notEqual(event.payee, undefined)
        assert.equal(event.payer, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', 'Payer is correct')
        assert.notEqual(event.payer, 0x0)
        assert.notEqual(event.payer, '')
        assert.notEqual(event.payer, null)
        assert.notEqual(event.payer, undefined)
  
        // FAILURE: Must have a valid payee entered
        await await billrentalpayment.addValidPayee('', '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;
        await await billrentalpayment.addValidPayee(null, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;
        await await billrentalpayment.addValidPayee(undefined, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payee }).should.be.rejected;
        // FAILURE: Must be able to get the payer address
        await await billrentalpayment.addValidPayee('0x15D15f4e4Ad6983AB51Bba5aC371c5d4EBa486bB', '', { from: payee }).should.be.rejected;
        await await billrentalpayment.addValidPayee('0x15D15f4e4Ad6983AB51Bba5aC371c5d4EBa486bB', null, { from: payee }).should.be.rejected;
        await await billrentalpayment.addValidPayee('0x15D15f4e4Ad6983AB51Bba5aC371c5d4EBa486bB', undefined, { from: payee }).should.be.rejected;
        
      })
  
      it('Able to retrieve valid payees for a given payer', async () => {

        const validPayeesList = await billrentalpayment.validPayeesList(payer, 0)
        // SUCCESS:
        assert.equal('0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', payee, 'Payee is correct')

        // FAILURE:
        await await billrentalpayment.validPayeesList(undefined, payer, { from: payee }).should.be.rejected;
      })
  
    })

    describe('Modify and retrieve upper limit for given address', async () => {
      let result, payer
  
      before(async () => {
        payer = '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D'
        result = await billrentalpayment.setUpperLimit(20, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', { from: payer })
      })

      it('Modify upper limit successfully', async () => {
        // SUCCESS:
        const event = result.logs[0].args
        assert.equal(event.upperLimit, 20, 'Upper Limit is correct')
        assert.equal(event.payer, '0xE5b9f83B818a07047Ed5dd780f67bb57da60F11D', 'Payer is correct')
        
        // // FAILURE: Must be able to retrieve the address of the person trying to modify the upper limit
        await await billrentalpayment.setUpperLimit('', undefined, { from: payee }).should.be.rejected;

      })
      
      it('Able to retrieve bills', async () => {
        const upperLimit = await billrentalpayment.upperLimit(payer)
        // SUCCESS:
        assert.equal(upperLimit.toNumber(), '20', 'upper limit is correct')

        // FAILURE: unable to retrieve the address of the payer
        await await billrentalpayment.upperLimit(undefined, { from: payer }).should.be.rejected;
      })
  
    })

  })
