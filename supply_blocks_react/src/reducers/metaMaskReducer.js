const INITIAL_STATE = {
    isSignedIn: null,
    userAddress: null
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'SIGN_IN':
            return {...state, 
                isSignedIn: true, 
                userAddress: action.payload.userAdd
            }
        case 'SIGN_OUT':
            return{...state,
                isSignedIn: false,
                userAddress: null
            }
        default:
            return state;
    }   
}