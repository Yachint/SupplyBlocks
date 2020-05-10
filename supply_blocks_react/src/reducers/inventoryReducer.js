import _ from 'lodash';

const INITIAL_STATE = {
    isLoaded: false,
    currentHash: null,
    inventory: [],
    scabLedger: [],
    changedState: {}
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'INV_LOAD':
            return {...state,
                isLoaded: true,
                currentHash: action.payload.currentHash,
                inventory: action.payload.inventory,
                scabLedger: action.payload.scabLedger
            }

        case 'INV_UNLOAD':
            return{
                isLoaded: false,
                currentHash: null,
                inventory: [],
                scabLedger: [],
                changedState: {}
            }
        
        case 'LOCAL_UPDATE':
            return{...state,
                inventory: [...action.payload.updates],
                changedState: {...state.changedState,..._.mapKeys(action.payload.changed, 'prodId')}
            }
        
        case 'LOCAL_DELETE':
            return{...state,
                inventory: [...action.payload.updates],
                changedState: {...state.changedState,..._.mapKeys(action.payload.deleteThese, 'prodId')}
            }

        case 'INV_UPDATE':
            return{...state,
                currentHash: action.payload.currentHash,
                scabLedger: _.concat(state.scabLedger, action.payload.ledger),
                changedState: {}
            }
        
        default:
            return state;
    }
}