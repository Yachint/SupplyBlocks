const INITIAL_STATE = {
    isStarted: false,
    isScabBroadcast: false,
    isTransacting: false,
    isScabReciept: false,
    isIpfsUpload: false,
    isCreatingOrder: false,
    isFinished: false,
    isError: false  
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'START':
            return {...state,
                isStarted: true
            }
        case 'BROAD':
            return {...state,
                isScabBroadcast: true
            }
        case 'TRANSACT':
            return {...state,
                isTransacting: true
            }
        case 'RECIEPT':
            return {...state,
                isScabReciept: true
            }
        case 'IPFS':
            return {...state,
                isIpfsUpload: true
            }
        case 'ORDERING':
            return{...state,
                isCreatingOrder: true
            }
        case 'FIN_TX':
            return {...state,
                isFinished: true
            }
        case 'ERR':
            return {...state,
                isError: true
            }
        case 'RESET':
            return{...state,
                isStarted: false,
                isScabBroadcast: false,
                isTransacting: false,
                isScabReciept: false,
                isIpfsUpload: false,
                isCreatingOrder: false,
                isFinished: false,
                isError: false  
            }
        default:
            return state;
    }
}