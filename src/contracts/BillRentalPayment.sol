pragma solidity ^0.5.0;

contract BillRentalPayment {

    // =========================================
    //    Initialising variables:
    // =========================================
    string public name;
    uint public numberOfTransactions = 0;
    bool public portobilloIsActive = true; 
    
    address payable public payee_who;
    address payable public payer_who;
    address public payer;

    // =========================================
    //    Mappings and relevant:
    // =========================================

    //mapping to see the number of valid payees for a given address
    mapping(address => uint) public numberOfValidPayees;
    
    //mapping to see the bills
    mapping(uint => Bill) public bills; 
    
    //mapping to see the upper limit for a given address
    mapping(address => uint) public upperLimit;
    
    //mapping to see the validPayeesList for a given address
    ValidPayee[] public validListOfPayees;
    mapping(address => ValidPayee[]) public validPayeesList;

    //mapping for to see if a given user account is deactivated
    mapping(address => bool) public accountActive;

    // =========================================
    //    New Struct types created:
    // =========================================

    struct Bill {
        uint id;
        string name;
        uint amount;
        address payable payee;
        address payable payer;
        bool alreadyPaid;
    }
    
    struct ValidPayee {
        address payable payee;
        //bool alreadyRequestedOnceThisMonth -- decided to remove this (as explained in video)
    }

    // =========================================
    //    Events:
    // =========================================

    event BillPaymentRequested(
        uint id,
        string name,
        uint amount,
        address payable payee,
        address payable payer,
        bool alreadyPaid
    );

    event BillPaid(
        uint id,
        string name,
        uint amount,
        address payable payee,
        address payable payer,
        bool alreadyPaid
    );

    event ValidPayeeAdded(
        address payable payee,
        address payable payer
    );

    event UpperLimitModified(
        uint upperLimit,
        address payable payer
    );

    // =========================================
    //    Constructor:
    // =========================================

    constructor() public payable {
        name = "Portobillo";
        // payee = msg.sender;
    }

    // ==================================================================================
    //    Function that is called when payee requests payment from payer.
    //    The params required are transaction description (_name), amount
    //    and the payer address (_payer)
    // ==================================================================================

    function requestPayment(string memory _name, uint _amount, address payable _payer) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid bill amount that is non-negative and non-zero
        require(_amount > 0);
        
        // Increment number of transactions so that the ID can be updated accordingly
        numberOfTransactions ++;
        uint _id = numberOfTransactions;

        // Create the bill
        bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
        // Trigger an event that bill has been requested by the payee 
        emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
        // payee_who = msg.sender;
    }

    // ==================================================================================
    //    Function that is called when payer clicks on "Pay" button in portal.
    //    The params required in this function are the bill ID, payee address 
    //    (_payee)
    // ==================================================================================

    function payBill(uint _id) public payable {
        // Fetch the bill
        Bill memory _bill = bills[_id];

        // Fetch the payee
        address payable _payee = _bill.payee;
        
        // Make sure the bill has a valid id -- to prevent scam
        require(_bill.id > 0 && _bill.id <= numberOfTransactions);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _bill.amount);
        // Require that the bill has not been paid already
        require(!_bill.alreadyPaid);

        //Valid Payee is checked for in the front end
        
        // Mark as paid -- to prevent replay attack
        _bill.alreadyPaid = true;

        // Update the bill
        bills[_id] = _bill;

        // Pay the payee by sending them Ether
        address(_payee).transfer(_bill.amount);

        // Trigger an event that the Bill has been paid
        emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
        // payer_who = msg.sender; 

    }

    // ==================================================================================
    //    Functions for activating and deactivating account and getting current
    //    account status
    // ==================================================================================

    function activateAccount(address payable _addr) public {
        if(!accountActive[_addr]) {
            accountActive[_addr] = true;
        }
    }
    
    function deactivateAccount(address payable _addr) public {
        if(accountActive[_addr]) {
            accountActive[_addr] = false;
        }
    }
    
    function getAccountStatus(address payable _addr) public returns(bool) {
        return accountActive[_addr];
    }

    // ==================================================================================
    //    Functions for setting and getting upper limit of a given account
    // ==================================================================================
    
    function setUpperLimit(uint _upperLimit, address payable payer) public {
        upperLimit[payer] = _upperLimit;
        emit UpperLimitModified(_upperLimit, msg.sender);
    }
    
    function getUpperLimit() public returns(uint) {
        uint upperLimitValue = upperLimit[payer];
        return upperLimitValue;
    }

    // ==================================================================================
    //    Function to add valid payees to a list and store it in the mapping
    //    that is mapped to your account address and another to retrieve it
    // ==================================================================================
    
    function addValidPayee(address payable _validPayee, address payable payer) public {
        //  increment the number of valid payees for a given account
         numberOfValidPayees[payer] += 1;
         
        //  add valid payee to a list and store it for a particular account address 
        validListOfPayees.push(ValidPayee(_validPayee));
        validPayeesList[payer] = validListOfPayees;

        //emit event that payee was authorised for a particular payer
        emit ValidPayeeAdded(_validPayee, msg.sender);
    }
    
    // OTHER CHECKS ARE VALIDATED IN THE FRONT END
    
}


