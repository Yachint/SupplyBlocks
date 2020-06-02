import _ from 'lodash';

const INITIAL_STATE = {
    isLoaded: false,
    orders: [],
    orderLedger: [],
    changedState: {},
    isStarted: false,
    isDone: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOAD_ORDERS':
            return{...state,
                isLoaded: true,
                orders: action.payload.orders,
                orderLedger: action.payload.ledger,
            }

        case 'REFRESH_ORDERS':
            return{...state,
                orders: _.concat(state.orders, action.payload.orders),
                orderLedger: _.concat(state.orderLedger, action.payload.ledger),
            }
        
        case 'UNLOAD_ORDERS':
            return{...state,
                isLoaded: false,
                orders: [],
                orderLedger: [],
                changedState: {},
                isStarted: false,
                isDone: false
            }

        case 'LOCAL_CHANGE':
            return{...state,
                orders: [...action.payload.updates],
                changedState: {...state.changedState,..._.mapKeys(action.payload.changed, 'orderId')}
            }

        case 'CLOUD_CHANGE':
            return{...state,
                orderLedger: _.concat(state.scabLedger, action.payload.ledger),
                changedState: {}
            }

        case 'STARTED_TX':{
            return{...state,
                isStarted: true,
            }
        }

        case 'FINISHED_TX':{
            return{...state,
                isDone: true,
            }
        }
        
        case 'RESET_STAT':
            return{...state,
                isStarted: false,
                isDone: false
        }

        default:
            return state;
    }
}