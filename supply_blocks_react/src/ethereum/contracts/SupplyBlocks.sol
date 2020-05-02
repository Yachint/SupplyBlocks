pragma solidity ^0.4.17;

contract SupplyBlocks {
    
    address[] public deployedAccounts;
    mapping(address => address) contractDetails;
    address PaymentsBankAddress;
    
    constructor() public{
        PaymentsBankAddress = new PaymentsBank();
    }
    
    function createAccount(string _orgName, string _description, string addinfohash) public returns (address) {
        address newAccount = new Warehouse(_orgName,msg.sender,_description, this, addinfohash);
        contractDetails[msg.sender] = newAccount;
        deployedAccounts.push(newAccount);
        return newAccount;
        
    }
    
    function getContractAddress(address warehouseAdd) public view returns (address){
        return contractDetails[warehouseAdd];
    }
    
    
    function deactivateAccount(address myAdd) public {
        contractDetails[myAdd] = 0x0000000000000000000000000000000000000000;
    }
}

contract Warehouse {
    
    struct Request{
        address sellerCon;
        address buyerCon;
        uint sellerIndex;
        uint buyerIndex;
        uint prodId;
        string dateType;
        string status;
    }
    
    struct ActionsInventory{
        uint prodId;
        string change; //In JSON Format
    }
    
    string public inventoryHash;
    string public ordersHash;
    string public AddInfoHash;
    address public mainConAdd;
    string public orgName;
    address public manager;
    string public description;
    Request[] public requestArray;
    ActionsInventory[] public inventoryUpdates;
    bytes32 private secretKey;
    
    
    constructor(string _orgName, address _manager, string _description, address _mainConAdd, string addinfohash) public {
        orgName = _orgName;
        manager = _manager;
        description = _description;
        mainConAdd = _mainConAdd;
        AddInfoHash = addinfohash;
        secretKey = keccak256(abi.encode(_orgName, _manager, _description, _mainConAdd));
    }
    
    //INVENTORY FUNCTIONS START--------------------------------
    
    function getInventoryHash() public view returns (string) {
        return inventoryHash;
    }
    
    function setInventoryHash(string newHash) public {
        require(msg.sender==manager);
        inventoryHash = newHash;
    }
    
    function setOrderHash(string newHash) public {
        require(msg.sender==manager);
        ordersHash = newHash;
    }
    
    function addInventoryUpdates(uint givenProdId, string JSON) public{
        ActionsInventory memory action = ActionsInventory({
            prodId: givenProdId,
            change: JSON
        });
        
        inventoryUpdates.push(action);
    }
    
    function emptyInventoryUpdates() public{
        delete inventoryUpdates;
    }
    
    function getInventoryUpdatesLength() public view returns (uint){
        return inventoryUpdates.length;
    }
    
    // function getSpecificInventoryUpdate(uint index) public view returns (uint, string){
    //     ActionsInventory storage action = inventoryUpdates[index];
    //     return(action.prodId, action.change);
    // }
    
    //INVENTORY FUNCTIONS END###################################
    
    
    
    
    //REQUEST FUNCTIONS START-----------------------------------
    
    function emptyRequests() public {
        delete requestArray;
    }
    
    function fireRequest(uint GivenProdId, string currentDate) public {
        SupplyBlocks sup = SupplyBlocks(mainConAdd);
        address buyerContract = sup.getContractAddress(msg.sender);
        Warehouse wAdd = Warehouse(buyerContract);
        uint currFromIndex = wAdd.getRequestsLength();
        
        
        Request memory req = Request({
            sellerCon: this,
            buyerCon: buyerContract,
            sellerIndex: requestArray.length,
            buyerIndex: currFromIndex, 
            prodId: GivenProdId,
            dateType: currentDate,
            status: "NOT_CONFIRMED"
        });
        
        requestArray.push(req);
        wAdd.receiveRequest(this,requestArray.length-1,GivenProdId,currentDate,"NOT_CONFIRMED");
    }
    
    function receiveRequest(address _sellerCon, uint _sellerIndex, uint _prodId, string _currentDate, string _status) public {
        Request memory req = Request({
            sellerCon: _sellerCon,
            buyerCon: this,
            sellerIndex: _sellerIndex,
            buyerIndex: requestArray.length, 
            prodId: _prodId,
            dateType: _currentDate,
            status: _status
        });
        
        requestArray.push(req);
        
    }
    
    function changeRequestStatus(uint index, string _status) public {
        Request storage req = requestArray[index];
        req.status = _status;
    }
    
    function getRequestsLength() public view returns(uint){
        return requestArray.length;
    }
    
    function onConfirmed(uint ReqNumber) public {
        Request storage req = requestArray[ReqNumber];
        Warehouse wareTo = Warehouse(req.buyerCon);
        wareTo.changeRequestStatus(req.buyerIndex, "CONFIRMED");
        req.status = "CONFIRMED";
    }
    
    function onCompleted(uint ReqNumber) public {
        Request storage req = requestArray[ReqNumber];
        Warehouse wareTo = Warehouse(req.buyerCon);
        wareTo.changeRequestStatus(req.buyerIndex, "COMPLETED");
        req.status = "COMPLETED";
    }
    
    function onDelivered(uint ReqNumber, string changeTo) public{
        Request storage req = requestArray[ReqNumber];
        Warehouse wareTo = Warehouse(req.buyerCon);
        wareTo.addInventoryUpdates(req.prodId, changeTo);
        wareTo.changeRequestStatus(req.buyerIndex, "DELIVERED");
        req.status = "DELIVERED";
        
    }
    
    function onEnRoute(uint ReqNumber, string changeFrom) public {
        Request storage req = requestArray[ReqNumber];
        addInventoryUpdates(req.prodId, changeFrom);
        Warehouse wareTo = Warehouse(req.buyerCon);
        wareTo.changeRequestStatus(req.buyerIndex, "EN_ROUTE");
        req.status = "EN_ROUTE";
    }
    
    //REQUEST FUNCTIONS END##################################
    
    
    //BALANCE RELATED OPS START ------------------------------
    
    function accessSecret() public view returns (bytes32){
        require(msg.sender==manager);
        return secretKey;
    }
    
    function checkBalance() public view returns(uint){
        require(msg.sender==manager);
        return address(this).balance;
    }
    
    function transferMoney(address Bank, uint amount, bytes32 secret) public {
        require(secretKey==secret && address(this).balance >= amount);
        Bank.transfer(address(this).balance-amount);
    }
    
    //BALANCE RELATED OPS START#################################
    
    function () public payable {}   
    
    
}

contract PaymentsBank{
    
    struct PaymentHistory{
        address buyerContract;
        address sellerContract;
        uint amount;
        uint txTime;
        string actionType;
    }
    
    PaymentHistory[] public ledger;
    
    function initiateTransaction(address buyerCon, address sellerCon, string _actionType, uint _amount, bytes32 secret) public {
        
        Warehouse insatnceBuyer = Warehouse(buyerCon);
        insatnceBuyer.transferMoney(this, _amount, secret);
        sellerCon.transfer(address(this).balance);
        //sellerCon.transfer(msg.value);
        
        PaymentHistory memory entry = PaymentHistory({
            buyerContract: buyerCon,
            sellerContract: sellerCon,
            amount: _amount,
            txTime: now,
            actionType: _actionType
        });
        
        ledger.push(entry);
    }
    
    function transferFunds(address WareCon) public payable {
        WareCon.transfer(address(this).balance);
    }
    
    function checkBalance() public view returns(uint){
        return address(this).balance;
    }
    
    function () public payable {}
    
}