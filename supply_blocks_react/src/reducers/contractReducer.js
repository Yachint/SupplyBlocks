const INITIAL_STATE = {
    contractAddress: null,
    contractDetails: {
        orgName: null,
        description: null,
        AdditionalInfoHash: null,
        managerAddress: null,
        mainContractAddress: null,
        publicKey: null
    },
    AdditionalInfo:{
        name: null,
        designation: null,
        companyAddress: null,
        warehouseAddress: null,
        productCategories: []
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
                    AdditionalInfoHash: null,
                    managerAddress: null,
                    mainContractAddress: null,
                    publicKey: null
                },
                AdditionalInfo: {
                    name: null,
                    designation: null,
                    companyAddress: null,
                    warehouseAddress: null,
                    productCategories: []
                }
            }
            
        default:
            return state;
    }
}

