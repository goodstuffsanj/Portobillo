pragma solidity ^0.5.0;

contract BillRentalPayment {
    string public name;
    
    uint public numberOfTransactions = 0;
    
    address payable public payee_who;
    address payable public payer_who;
    
    mapping(uint => Bill) public bills; //need to have it private??
    
    //NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE
    
    //NEED TO ALSO ADD ANOTHER PARAMETER SAY A PASSWORD SORT OF THING THAT ALL PAYEES SHOULD INCLUDE (DISTRIBUTED BY PAYER)
    //WHICH THE PAYEE NEEDS TO SPECIFY EVERYTIME HE REQUESTS PAYMENT SO THAT IT CAN BE VERIFIED IF HES AUTHORISED ORRRR 
    
    //ORRRRRRRRRRRRRRRRRRRR EACH PAYER WILL HAVE A LIST OF PAYEE ADDRESSES SO EVERYTIME A PAYMENT COMES THROUGH, IT WILL CHECK 
    //IF THE PAYEE IS AUTHORISED

    struct Bill {
        uint id;
        string name;
        uint amount;
        address payable payee;
        address payable payer;
        bool alreadyPaid;
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
}






//=================================================================================================================================




// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;
    
//     uint public numberOfTransactions = 0;
    
//     address payable public payee_who;
//     address payable public payer_who;
    
//     mapping(uint => Bill) public bills; //need to have it private??
    
//     //NEED TO HAVE ANOTHER BOOLEAN TO SEE IF THE PAYER IS STILL USING THIS SERVICE -- AND A FUNCTION WITH IF ELSE TO ABORT OR CONTINUE

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

    // event BillPaid(
    //     uint id,
    //     string name,
    //     uint amount,
    //     address payable payee,
    //     address payable payer,
    //     bool alreadyPaid
    // );
    
    // // modifier onlyPayer() {
    // //     require(msg.sender == payer);  //need to add to constructor payer = msg.sender but that will mean that when payee calls 
    // //     _;                            // also it'll hold, so think about it
    // // }

    // constructor() public payable {
    //     name = "Portobillo";
    //     // payee = msg.sender;
    // }
    
    // //NEED NONCE!!!

    // function requestPayment(string memory _name, uint _amount, address payable _payer) public {
    //     // Require a valid name
    //     require(bytes(_name).length > 0);
    //     // Require a valid bill amount
    //     require(_amount > 0);
        
    //     // Increment number of transactions so that the ID can be updated accordingly
    //     numberOfTransactions ++;
        
    //     uint _id = numberOfTransactions;
    //     // Create the bill
    //     bills[_id] = Bill(_id, _name, _amount, msg.sender, _payer, false);
        
    //     // Trigger an event that bill has been requested by the payee 
    //     emit BillPaymentRequested(_id, _name, _amount, msg.sender, _payer, false);
    //     payee_who = msg.sender;
    // }




    //=================================================================================================================================





    // function payBill(uint _id) public payable {
    //     // Fetch the bill
    //     Bill memory _bill = bills[_id];
    //     // Fetch the payee
    //     address payable _payee = _bill.payee;
        
    //     // Make sure the bill has a valid id -- to prevent scam? 
    //     require(_bill.id > 0 && _bill.id <= numberOfTransactions);
    //     // Require that there is enough Ether in the transaction
    //     require(msg.value >= _bill.amount);
    //     // Require that the bill has not been paid already
    //     require(!_bill.alreadyPaid);
        
    //     // Require that the buyer is not the seller -- REMOVE?
    //     // require(_payee != msg.sender);
        
    //     // // Transfer ownership to the buyer
    //     // _bill.payee = msg.sender; -- ownership transfer DOESNT APPLY
        
    //     // Mark as paid -- to prevent replay
    //     _bill.alreadyPaid = true;
    //     // Update the bill
    //     bills[_id] = _bill;
    //     // Pay the payee by sending them Ether
    //     address(_payee).transfer(_bill.amount);
    //     // Trigger an event
    //     emit BillPaid(numberOfTransactions, _bill.name, _bill.amount, _payee, msg.sender, true);
    //     payer_who = msg.sender; //REMOVE??
    // }
// }

//"testname1", 2,"0x7d3965E166D39DF0168C82B9A95ADeA1C6FAA8fD" DONT FORGET TO CHANGE THE VALUE BEFORE CLICKING PAYBILL



// pragma solidity ^0.5.0;

// contract BillRentalPayment {
//     string public name;

//     constructor() public {
//         name = "Portobillo";
//     }
// }