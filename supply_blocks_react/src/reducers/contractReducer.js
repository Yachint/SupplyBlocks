const INITIAL_STATE = {
    contractAddress: null,
    contractDetails: {
        orgName: null,
        description: null,
        IpfsHash: null,
        managerAddress: null,
        mainContractAddress: null,
    },
    AdditionalInfo:{
        name: null,
        designation: null,
        companyAddress: null,
        warehouseAddress: null,
        productCategories: [],
        pubKey: null
    }
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'CONTRACT_LOAD':
            return{...state,
                contractAddress: action.payload.contractAddress,
                contractDetails: action.payload.contractDetails,
                AdditionalInfo: action.payload.AdditionalInfo
            }
        
        case 'CONTRACT_UNLOAD':
            return {...state,
                contractAddress: null,
                contractDetails: {
                    orgName: null,
                    description: null,
                    IpfsHash: null,
                    managerAddress: null,
                    mainContractAddress: null,
                },
                AdditionalInfo: {
                    name: null,
                    designation: null,
                    companyAddress: null,
                    warehouseAddress: null,
                    productCategories: [],
                    pubKey: null
                }
            }
            
        default:
            return state;
    }
}

