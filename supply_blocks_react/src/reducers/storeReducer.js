import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case 'FETCH_ALL_ITEMS':
            return {...state, ..._.mapKeys(action.payload, 'id')};
        
        case 'FETCH_ITEM':
            return {...state, [action.payload.id] : action.payload};

        default:
            return state;
    }

}