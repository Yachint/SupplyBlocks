import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import metaMaskReducer from './metaMaskReducer';
import contractReducer from './contractReducer';

export default combineReducers({
    form: formReducer,
    auth: metaMaskReducer,
    contract: contractReducer
});
