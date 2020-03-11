pragma solidity ^0.4.17;

contract SupplyBlocks {
    
    address[] public deployedAccounts;
    mapping(uint => address) googleLogIn;
    mapping(address => address) contractDetails;
    
    function createAccount(string _orgName, string _description, uint GAPI_ID) public {
        address newAccount = new Warehouse(_orgName,msg.sender,_description, this);
        googleLogIn[GAPI_ID] = msg.sender;
        contractDetails[msg.sender] = newAccount;
        deployedAccounts.push(newAccount);
    }
    
    function getContractAddress(address warehouseAdd) public view returns (address){
        return contractDetails[warehouseAdd];
    }
    
    function getAccountAddressGAPI(uint GAPI_ID) public view returns (address){
        return googleLogIn[GAPI_ID];
    }
    
    function deactivateAccount(uint GAPI_ID) public {
        googleLogIn[GAPI_ID] = 0x0000000000000000000000000000000000000000;
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
    address mainConAdd;
    string public orgName;
    address public manager;
    string public description;
    Request[] public requestArray;
    ActionsInventory[] public inventoryUpdates;
    
    
    constructor(string _orgName, address _manager, string _description, address _mainConAdd) public {
        orgName = _orgName;
        manager = _manager;
        description = _description;
        mainConAdd = _mainConAdd;
    }
    
    //INVENTORY FUNCTIONS START--------------------------------
    
    function getInventoryHash() public view returns (string) {
        return inventoryHash;
    }
    
    function setInventoryHash(string newHash) public {
        require(msg.sender==manager);
        inventoryHash = newHash;
    }
    
    function addInventoryUpdates(uint givenProdId, string JSON) public{
        ActionsInventory memory action = ActionsInventory({
            prodId: givenProdId,
            change: JSON
        });
        
        inventoryUpdates.push(action);
    }
    
    function removeInventoryUpdates(uint index) public{
        delete inventoryUpdates[index];
    }
    
    function getInventoryUpdatesLength() public view returns (uint){
        return inventoryUpdates.length;
    }
    
    function getSpecificInventoryUpdate(uint index) public view returns (uint, string){
        ActionsInventory storage action = inventoryUpdates[index];
        return(action.prodId, action.change);
    }
    
    //INVENTORY FUNCTIONS END###################################
    
    
    
    
    //REQUEST FUNCTIONS START--------------------------------
    
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
}