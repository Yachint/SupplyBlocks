import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import metaMaskReducer from './metaMaskReducer';
import contractReducer from './contractReducer';
import inventoryReducer from './inventoryReducer';
import stepsReducer from './stepsReducer';

export default combineReducers({
    form: formReducer,
    auth: metaMaskReducer,
    contract: contractReducer,
    inventoryStore: inventoryReducer,
    steps: stepsReducer
});
