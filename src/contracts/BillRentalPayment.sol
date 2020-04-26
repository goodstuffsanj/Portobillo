pragma solidity ^0.5.0;

contract BillRentalPayment {
    string public name;
    
    uint public numberOfTransactions = 0;
    // uint public numberOfValidPayees = 0;
    mapping(address => uint) public numberOfValidPayees;
    
    address payable public payee_who;
    address payable public payer_who;
    address public payer;
    
    mapping(uint => Bill) public bills; //need to have it private??
    
    
    bool public payerAccountActive = true; //CHANGE TO MAPPING
    
    // uint public upperLimit = 50;
    mapping(address => uint) public upperLimit;
    
    // ValidPayee[] public validListOfPayees;
    ValidPayee[] public validListOfPayees;
    mapping(address => ValidPayee[]) public validPayeesList;
    // -----------------------------------------
    //
    //    Sectional Dividers Like This
    //
    // -----------------------------------------
    
    //[DONE]NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
    //[DONE IN SOLIDITY, NOT FRONT END] CONSEQUENTLY NEED A FUNCTION CALLED DEACTIVATE ACCOUNT TO SET TO FALSE
    
    //[REMOVED] NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
    //[REMOVED] WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
    //EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
    //IF THE PAYEE IS AUTHORISED
    
    //[DONE]ADD A ADD VALID PAYEES SECTION IN THE WEBSITE 
    //[DONE] RELEVANT SMART CONTRACT FUNCTION HERE
    
    //[DONE]DISPLAY ONLY RELEVANT BILLS
    
    //MODIFIER???????/

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
        //bool alreadyRequestedOnceThisMonth
    }
    
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
    
    // modifier onlyPayer() {
    //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
    //     _;                            // also it'll hold, so think about it
    // }

    constructor() public payable {
        name = "Portobillo";
        // payee = msg.sender;
    }
    
    //NEED NONCE!!!

    function requestPayment(string memory _name, uint _amount, address payable _payer) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid bill amount
        require(_amount > 0);
        
        // Increment number of transactions so that the ID can be updated accordingly
        numberOfTransactions ++;
        
        uint _id = numberOfTransactions;
        // Create the bill
        bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
        // Trigger an event that bill has been requested by the payee 
        emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
        payee_who = msg.sender;
    }
    
    //CAN HAVE A FUNCTION TO GET BILL DETAILS BY PASSING IN ARGUMENT ID!!!!

    function payBill(uint _id) public payable {
        // Fetch the bill
        Bill memory _bill = bills[_id];
        // Fetch the payee
        address payable _payee = _bill.payee;
        
        // Make sure the bill has a valid id -- to prevent scam? 
        require(_bill.id > 0 && _bill.id <= numberOfTransactions);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _bill.amount);
        // Require that the bill has not been paid already
        require(!_bill.alreadyPaid);
        //Valid Payee is checked for in the front end
        
        // Require that the buyer is not the seller -- REMOVE?
        // require(_payee != msg.sender);
        
        // // Transfer ownership to the buyer
        // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
        // Mark as paid -- to prevent replay
        _bill.alreadyPaid = true;
        // Update the bill
        bills[_id] = _bill;
        // Pay the payee by sending them Ether
        address(_payee).transfer(_bill.amount);
        // Trigger an event
        emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
        payer_who = msg.sender; //REMOVE??
    }
    
    function activateAccount() public {
        if(!payerAccountActive) {
            payerAccountActive = true;
        }
    }
    
    function deactivateAccount() public {
        if(payerAccountActive) {
            payerAccountActive = false;
        }
    }
    
    function getAccountStatus() public returns(bool) {
        return payerAccountActive;
    }
    
    function setUpperLimit(uint _upperLimit, address payable payer) public {
        upperLimit[payer] = _upperLimit;
    }
    
    function getUpperLimit() public returns(uint) {
        uint upperLimitValue = upperLimit[payer];
        return upperLimitValue;
        // return upperLimit;
    }
    
    function addValidPayee(address payable _validPayee, address payable payer) public {
        //  numberOfValidPayees++;
         numberOfValidPayees[payer] += 1;
         
         validListOfPayees.push(ValidPayee(_validPayee));
        // Add payee
        // validPayeesList[payer] = ValidPayee(_validPayee);
        validPayeesList[payer] = validListOfPayees;
        //validListOfPayees
    }
    
    //CHANGE THE MAPPING FROM UINT TO ADDRESS SO THAT CAN REFER THE VALIDPAYEE FOR THE PAYER ADDRESS!!!!!!
    
    // function getValidPayees() public returns(ValidPayee[] memory) {
    //     return validPayeesList;
    // }
    
    //NEGATIVE AMOUNT REQUESTS ARE VALIDATED IN THE FRONT END
    
}







//=================================================================================================================================


// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;
    
//     uint public numberOfTransactions = 0;
//     uint public numberOfValidPayees = 0;
    
//     address payable public payee_who;
//     address payable public payer_who;
//     address public payer;
    
//     mapping(uint => Bill) public bills; //need to have it private??
    
    
//     bool public payerAccountActive = true;
//     uint public upperLimit = 50;
    
//     ValidPayee[] public validListOfPayees;
//     mapping(address => ValidPayee[]) public validPayeesList;
    
//     //[DONE]NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
//     //[DONE IN SOLIDITY, NOT FRONT END] CONSEQUENTLY NEED A FUNCTION CALLED DEACTIVATE ACCOUNT TO SET TO FALSE
    
//     //[REMOVED] NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
//     //[REMOVED] WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
//     //EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
//     //IF THE PAYEE IS AUTHORISED
    
//     //ADD A ADD VALID PAYEES SECTION IN THE WEBSITE 
//     //[DONE] RELEVANT SMART CONTRACT FUNCTION HERE
    
//     //[DONE]DISPLAY ONLY RELEVANT BILLS
    
//     //MODIFIER???????/

//     struct Bill {
//         uint id;
//         string name;
//         uint amount;
//         address payable payee;
//         address payable payer;
//         bool alreadyPaid;
//     }
    
//     struct ValidPayee {
//         address payable payee;
//         //bool alreadyRequestedOnceThisMonth
//     }
    
//     event BillPaymentRequested(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );

//     event BillPaid(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );
    
//     // modifier onlyPayer() {
//     //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
//     //     _;                            // also it'll hold, so think about it
//     // }

//     constructor() public payable {
//         name = "Portobillo";
//         // payee = msg.sender;
//     }
    
//     //NEED NONCE!!!

//     function requestPayment(string memory _name, uint _amount, address payable _payer) public {
//         // Require a valid name
//         require(bytes(_name).length > 0);
//         // Require a valid bill amount
//         require(_amount > 0);
        
//         // Increment number of transactions so that the ID can be updated accordingly
//         numberOfTransactions ++;
        
//         uint _id = numberOfTransactions;
//         // Create the bill
//         bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
//         // Trigger an event that bill has been requested by the payee 
//         emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
//         payee_who = msg.sender;
//     }
    
//     //CAN HAVE A FUNCTION TO GET BILL DETAILS BY PASSING IN ARGUMENT ID!!!!

//     function payBill(uint _id) public payable {
//         // Fetch the bill
//         Bill memory _bill = bills[_id];
//         // Fetch the payee
//         address payable _payee = _bill.payee;
        
//         // Make sure the bill has a valid id -- to prevent scam? 
//         require(_bill.id > 0 && _bill.id <= numberOfTransactions);
//         // Require that there is enough Ether in the transaction
//         require(msg.value >= _bill.amount);
//         // Require that the bill has not been paid already
//         require(!_bill.alreadyPaid);
//         //Valid Payee is checked for in the front end
        
//         // Require that the buyer is not the seller -- REMOVE?
//         // require(_payee != msg.sender);
        
//         // // Transfer ownership to the buyer
//         // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
//         // Mark as paid -- to prevent replay
//         _bill.alreadyPaid = true;
//         // Update the bill
//         bills[_id] = _bill;
//         // Pay the payee by sending them Ether
//         address(_payee).transfer(_bill.amount);
//         // Trigger an event
//         emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
//         payer_who = msg.sender; //REMOVE??
//     }
    
//     function activateAccount() public {
//         if(!payerAccountActive) {
//             payerAccountActive = true;
//         }
//     }
    
//     function deactivateAccount() public {
//         if(payerAccountActive) {
//             payerAccountActive = false;
//         }
//     }
    
//     function getAccountStatus() public returns(bool) {
//         return payerAccountActive;
//     }
    
//     function setUpperLimit(uint _upperLimit) public {
//         upperLimit = _upperLimit;
//     }
    
//     function getUpperLimit() public returns(uint) {
//         return upperLimit;
//     }
    
//     function addValidPayee(address payable _validPayee, address payable payer) public {
//         //  numberOfValidPayees++;
//          validListOfPayees.push(ValidPayee(_validPayee));
//         // Add payee
//         // validPayeesList[payer] = ValidPayee(_validPayee);
//         validPayeesList[payer] = validListOfPayees;
//         //validListOfPayees
//     }
    
//     //CHANGE THE MAPPING FROM UINT TO ADDRESS SO THAT CAN REFER THE VALIDPAYEE FOR THE PAYER ADDRESS!!!!!!
    
//     // function getValidPayees() public returns(address[] memory) {
//     //     return validPayeesList;
//     // }
    
//     //NEGATIVE AMOUNT REQUESTS ARE VALIDATED IN THE FRONT END
    
// }




//=================================================================================================================================




// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;
    
//     uint public numberOfTransactions = 0;
//     uint public numberOfValidPayees = 0;
    
//     address payable public payee_who;
//     address payable public payer_who;
    
//     mapping(uint => Bill) public bills; //need to have it private??
    
    
//     bool public payerAccountActive = true;
//     uint public upperLimit = 50;
    
//     // address[] public validPayeesList;
//     mapping(uint => ValidPayee) public validPayeesList;
    
//     //[DONE]NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
//     //[DONE IN SOLIDITY, NOT FRONT END] CONSEQUENTLY NEED A FUNCTION CALLED DEACTIVATE ACCOUNT TO SET TO FALSE
    
//     //[REMOVED] NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
//     //[REMOVED] WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
//     //EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
//     //IF THE PAYEE IS AUTHORISED
    
//     //ADD A ADD VALID PAYEES SECTION IN THE WEBSITE 
//     //[DONE] RELEVANT SMART CONTRACT FUNCTION HERE
    
//     //[DONE]DISPLAY ONLY RELEVANT BILLS
    
//     //MODIFIER???????/

//     struct Bill {
//         uint id;
//         string name;
//         uint amount;
//         address payable payee;
//         address payable payer;
//         bool alreadyPaid;
//     }
    
//     struct ValidPayee {
//         address payable payee;
//     }
    
//     event BillPaymentRequested(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );

//     event BillPaid(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );
    
//     // modifier onlyPayer() {
//     //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
//     //     _;                            // also it'll hold, so think about it
//     // }

//     constructor() public payable {
//         name = "Portobillo";
//         // payee = msg.sender;
//     }
    
//     //NEED NONCE!!!

//     function requestPayment(string memory _name, uint _amount, address payable _payer) public {
//         // Require a valid name
//         require(bytes(_name).length > 0);
//         // Require a valid bill amount
//         require(_amount > 0);
        
//         // Increment number of transactions so that the ID can be updated accordingly
//         numberOfTransactions ++;
        
//         uint _id = numberOfTransactions;
//         // Create the bill
//         bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
//         // Trigger an event that bill has been requested by the payee 
//         emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
//         payee_who = msg.sender;
//     }
    
//     //CAN HAVE A FUNCTION TO GET BILL DETAILS BY PASSING IN ARGUMENT ID!!!!

//     function payBill(uint _id) public payable {
//         // Fetch the bill
//         Bill memory _bill = bills[_id];
//         // Fetch the payee
//         address payable _payee = _bill.payee;
        
//         // Make sure the bill has a valid id -- to prevent scam? 
//         require(_bill.id > 0 && _bill.id <= numberOfTransactions);
//         // Require that there is enough Ether in the transaction
//         require(msg.value >= _bill.amount);
//         // Require that the bill has not been paid already
//         require(!_bill.alreadyPaid);
//         //Valid Payee is checked for in the front end
        
//         // Require that the buyer is not the seller -- REMOVE?
//         // require(_payee != msg.sender);
        
//         // // Transfer ownership to the buyer
//         // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
//         // Mark as paid -- to prevent replay
//         _bill.alreadyPaid = true;
//         // Update the bill
//         bills[_id] = _bill;
//         // Pay the payee by sending them Ether
//         address(_payee).transfer(_bill.amount);
//         // Trigger an event
//         emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
//         payer_who = msg.sender; //REMOVE??
//     }
    
//     function activateAccount() public {
//         if(!payerAccountActive) {
//             payerAccountActive = true;
//         }
//     }
    
//     function deactivateAccount() public {
//         if(payerAccountActive) {
//             payerAccountActive = false;
//         }
//     }
    
//     function getAccountStatus() public returns(bool) {
//         return payerAccountActive;
//     }
    
//     function setUpperLimit(uint _upperLimit) public {
//         upperLimit = _upperLimit;
//     }
    
//     function getUpperLimit() public returns(uint) {
//         return upperLimit;
//     }
    
//     // function addValidPayee(address payable _validPayee) public {
//     //     validPayeesList.push(_validPayee);
//     //     numberOfValidPayees++;
//     // }
    
//     function addValidPayee(address payable _validPayee) public {
//          numberOfValidPayees++;
//         // Add payee
//         validPayeesList[numberOfValidPayees] = ValidPayee(_validPayee);
//     }
    
//     // function getValidPayees() public returns(address[] memory) {
//     //     return validPayeesList;
//     // }
    
//     //NEGATIVE AMOUNT REQUESTS ARE VALIDATED IN THE FRONT END
    
// }



//=================================================================================================================================




// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;
    
//     uint public numberOfTransactions = 0;
//     uint public numberOfValidPayees = 0;
    
//     address payable public payee_who;
//     address payable public payer_who;
    
//     mapping(uint => Bill) public bills; //need to have it private??
    
//     bool public payerAccountActive = true;
//     uint public upperLimit = 50;
    
//     address[] public validPayeesList;
    
//     //[DONE]NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
//     //[DONE IN SOLIDITY, NOT FRONT END] CONSEQUENTLY NEED A FUNCTION CALLED DEACTIVATE ACCOUNT TO SET TO FALSE
    
//     //[REMOVED] NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
//     //[REMOVED] WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
//     //EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
//     //IF THE PAYEE IS AUTHORISED
    
//     //ADD A ADD VALID PAYEES SECTION IN THE WEBSITE 
//     //[DONE] RELEVANT SMART CONTRACT FUNCTION HERE
    
//     //[DONE]DISPLAY ONLY RELEVANT BILLS
    
//     //MODIFIER???????/

//     struct Bill {
//         uint id;
//         string name;
//         uint amount;
//         address payable payee;
//         address payable payer;
//         bool alreadyPaid;
//     }
    
//     event BillPaymentRequested(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );

//     event BillPaid(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );
    
//     // modifier onlyPayer() {
//     //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
//     //     _;                            // also it'll hold, so think about it
//     // }

//     constructor() public payable {
//         name = "Portobillo";
//         // payee = msg.sender;
//     }
    
//     //NEED NONCE!!!

//     function requestPayment(string memory _name, uint _amount, address payable _payer) public {
//         // Require a valid name
//         require(bytes(_name).length > 0);
//         // Require a valid bill amount
//         require(_amount > 0);
        
//         // Increment number of transactions so that the ID can be updated accordingly
//         numberOfTransactions ++;
        
//         uint _id = numberOfTransactions;
//         // Create the bill
//         bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
//         // Trigger an event that bill has been requested by the payee 
//         emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
//         payee_who = msg.sender;
//     }
    
//     //CAN HAVE A FUNCTION TO GET BILL DETAILS BY PASSING IN ARGUMENT ID!!!!

//     function payBill(uint _id) public payable {
//         // Fetch the bill
//         Bill memory _bill = bills[_id];
//         // Fetch the payee
//         address payable _payee = _bill.payee;
        
//         // Make sure the bill has a valid id -- to prevent scam? 
//         require(_bill.id > 0 && _bill.id <= numberOfTransactions);
//         // Require that there is enough Ether in the transaction
//         require(msg.value >= _bill.amount);
//         // Require that the bill has not been paid already
//         require(!_bill.alreadyPaid);
//         //Valid Payee is checked for in the front end
        
//         // Require that the buyer is not the seller -- REMOVE?
//         // require(_payee != msg.sender);
        
//         // // Transfer ownership to the buyer
//         // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
//         // Mark as paid -- to prevent replay
//         _bill.alreadyPaid = true;
//         // Update the bill
//         bills[_id] = _bill;
//         // Pay the payee by sending them Ether
//         address(_payee).transfer(_bill.amount);
//         // Trigger an event
//         emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
//         payer_who = msg.sender; //REMOVE??
//     }
    
//     function activateAccount() public {
//         if(!payerAccountActive) {
//             payerAccountActive = true;
//         }
//     }
    
//     function deactivateAccount() public {
//         if(payerAccountActive) {
//             payerAccountActive = false;
//         }
//     }
    
//     function getAccountStatus() public returns(bool) {
//         return payerAccountActive;
//     }
    
//     function setUpperLimit(uint _upperLimit) public {
//         upperLimit = _upperLimit;
//     }
    
//     function getUpperLimit() public returns(uint) {
//         return upperLimit;
//     }
    
//     function addValidPayee(address payable _validPayee) public {
//         validPayeesList.push(_validPayee);
//         numberOfValidPayees++;
//     }
    
//     function getValidPayees() public returns(address[] memory) {
//         return validPayeesList;
//     }
    
//     //NEGATIVE AMOUNT REQUESTS ARE VALIDATED IN THE FRONT END
    
// }




//=================================================================================================================================



// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;
    
//     uint public numberOfTransactions = 0;
    
//     address payable public payee_who;
//     address payable public payer_who;
    
//     mapping(uint => Bill) public bills; //need to have it private??
    
//     //NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
//     //NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
//     //WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
//     //ORRRRRRRRRRRRRRRRRRRR EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
//     //IF THE PAYEE IS AUTHORISED

//     struct Bill {
//         uint id;
//         string name;
//         uint amount;
//         address payable payee;
//         address payable payer;
//         bool alreadyPaid;
//     }
    
//     event BillPaymentRequested(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );

//     event BillPaid(
//         uint id,
//         string name,
//         uint amount,
//         address payable payee,
//         address payable payer,
//         bool alreadyPaid
//     );
    
//     // modifier onlyPayer() {
//     //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
//     //     _;                            // also it'll hold, so think about it
//     // }

//     constructor() public payable {
//         name = "Portobillo";
//         // payee = msg.sender;
//     }
    
//     //NEED NONCE!!!

//     function requestPayment(string memory _name, uint _amount, address payable _payer) public {
//         // Require a valid name
//         require(bytes(_name).length > 0);
//         // Require a valid bill amount
//         require(_amount > 0);
        
//         // Increment number of transactions so that the ID can be updated accordingly
//         numberOfTransactions ++;
        
//         uint _id = numberOfTransactions;
//         // Create the bill
//         bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
//         // Trigger an event that bill has been requested by the payee 
//         emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
//         payee_who = msg.sender;
//     }
    
//     //CAN HAVE A FUNCTION TO GET BILL DETAILS BY PASSING IN ARGUMENT ID!!!!

//     function payBill(uint _id) public payable {
//         // Fetch the bill
//         Bill memory _bill = bills[_id];
//         // Fetch the payee
//         address payable _payee = _bill.payee;
        
//         // Make sure the bill has a valid id -- to prevent scam? 
//         require(_bill.id > 0 && _bill.id <= numberOfTransactions);
//         // Require that there is enough Ether in the transaction
//         require(msg.value >= _bill.amount);
//         // Require that the bill has not been paid already
//         require(!_bill.alreadyPaid);
        
//         // Require that the buyer is not the seller -- REMOVE?
//         // require(_payee != msg.sender);
        
//         // // Transfer ownership to the buyer
//         // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
//         // Mark as paid -- to prevent replay
//         _bill.alreadyPaid = true;
//         // Update the bill
//         bills[_id] = _bill;
//         // Pay the payee by sending them Ether
//         address(_payee).transfer(_bill.amount);
//         // Trigger an event
//         emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
//         payer_who = msg.sender; //REMOVE??
//     }
// }








