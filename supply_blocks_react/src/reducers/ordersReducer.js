import _ from 'lodash';

const INITIAL_STATE = {
    isLoaded: false,
    orders: [],
    orderLedger: [],
    changedState: {}
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOAD_ORDERS':
            return{...state,
                isLoaded: true,
                orders: action.payload.orders,
                orderLedger: action.payload.ledger,
            }
        
        case 'UNLOAD_ORDERS':
            return{...state,
                isLoaded: false,
                orders: [],
                orderLedger: [],
                changedState: {}
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
        
        default:
            return state;
    }
}