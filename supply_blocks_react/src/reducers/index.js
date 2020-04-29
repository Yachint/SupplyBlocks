import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import metaMaskReducer from './metaMaskReducer';

export default combineReducers({
    form: formReducer,
    auth: metaMaskReducer
});
