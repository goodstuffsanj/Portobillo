const BillRentalPayment = artifacts.require('./BillRentalPayment.sol');

contract('BillRentalPayment', (accounts) => {
    let billrentalpayment
  
    before(async () => {
        billrentalpayment = await BillRentalPayment.deployed()
    })
  
    describe('deployment', async () => {
      it('deploys successfully', async () => {
        const address = await billrentalpayment.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })
  
      it('has a name', async () => {
        const name = await billrentalpayment.name()
        assert.equal(name, 'Portobillo')
      })
  
    })
  })
