const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/SupplyBlocks.json');

const provider = new HDWalletProvider(
    'wheel wheel bunker version enact height speak gather away farm immune inner',
    'https://rinkeby.infura.io/v3/b5d84e347ee84e31a345c3d37116b222'
);

const web3 = new Web3(provider);

const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account :',accounts[0]);
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({gas:'4000000',from:accounts[0]});
    console.log('Contract Deployed to :',result.options.address);
    
};

deploy(); 