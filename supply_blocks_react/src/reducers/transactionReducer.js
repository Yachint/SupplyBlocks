const INITIAL_STATE = {
    balance: 0,
    stats:{
        txNumber: 0,
        moneySpent: 0,
        moneyEarned: 0,
        bankHistory: []
    },
    isStarted: false,
    isCompleted: false,
    isError: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOAD_WALLET':
            return {...state,
                balance: action.payload.balance,
                stats: action.payload.stats
            }
        case 'UNLOAD_WALLET':
            return {...state,
                balance: 0,
                stats:{
                    txNumber: 0,
                    moneySpent: 0,
                    moneyEarned: 0,
                },
                isStarted: null,
                isCompleted: null,
                isError: null
            }
        case 'UPDATE_BALANCE':
            return {...state,
                balance: action.payload.balance,
                stats: action.payload.stats
            }
        case 'START_TRANSACTION':
            return{...state,    
                isStarted: true,
                isCompleted: false,
                isError: false
            }
        case 'COMPLETE_TRANSACTION':{
            return{...state,
                isStarted: false,
                isCompleted: true
            }
        }
        case 'SWITCH_ALL_FALSE':{
            return{...state,
                isStarted: false,
                isCompleted: false,
                isError: false
            }
        }
        case 'UPDATE_HISTORY':{
            return{...state,
                stats: action.payload.stats
            }
        }
        case 'ERROR_TRANSACTION':{
            return{...state,
                isError: true
            }
        }
        default:
            return state;
    }
}