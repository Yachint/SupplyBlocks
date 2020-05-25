import ScabJson from '../apis/ScabJson';

export const fetchAllItems = () => {
    return async (dispatch, getState) => {
        const response = await ScabJson.get('/items');
        dispatch({ 
            type: 'FETCH_ALL_ITEMS',
            payload: response.data
        });
    };
};

export const fetchItems = (id) => {
    return async (dispatch) => {
        const response  = await ScabJson.get('/items'+id);
        dispatch({
            type: 'FETCH_ITEM',
            payload: response.data
        })
    }
}