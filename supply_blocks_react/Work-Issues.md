## Work to be Done

### Supply-Blocks (React + Eth + Solidity)

- ~~Fix SCAB_Updates/log issue~~
- ~~Make sure all inventory are working in conjuction with SCAB_F and Store.json~~
- ~~Make sure scabLedger also gets uploaded to IPFS~~
- Provide view history/logs option in Inventory
- Fix delete for all other json elements (users,orders,sellers)
- Public/Private key encryption on IPFS based storage for increased security
- Add + Build ***Payments bank*** Page (actions+reducers)
- Test Orders login in smart contract
- Add + Build ***Orders*** Page (actions+reducers)
- Reduce overall bundle size due to antd integration


### SCAB-Store (React + Eth + SCAB_F)

- Add + Build ***Main Store*** Page -> lists all items in the store
- Add + Build ***Product Details*** Page -> after user clicks on a product display its details
- Add + Build ***Checkout Page*** Page -> After user clicks on BUY
- Connect with SCAB_Framework to send updates


### SCAB-Framework (Node.js + Express)

- Add delete http method for all (items,users,orders)
- Add path for sending Store.json to client
- Test all possible routes combinations in conjunction with SupplyBlocks 
- Automatic consensus when a node joins
- Integrate Pool mining if possible