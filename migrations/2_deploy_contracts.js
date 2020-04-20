const BillRentalPayment = artifacts.require("BillRentalPayment");

module.exports = function(deployer) {
  deployer.deploy(BillRentalPayment);
};
