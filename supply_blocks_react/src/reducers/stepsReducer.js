const INITIAL_STATE = {
    isStarted: false,
    isGenerating: false,
    isEncrypting: false,
    isUploading: false,
    isCreating: false,
    isFinished: false,
    isError: false  
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'START':
            return {...state,
                isStarted: true
            }
        case 'GEN':
            return {...state,
                isGenerating: true
            }
        case 'ENC':
            return {...state,
                isEncrypting: true
            }
        case 'UPLOAD':
            return {...state,
                isUploading: true
            }
        case 'CREATE':
            return {...state,
                isCreating: true
            }
        case 'FIN':
            return {...state,
                isFinished: true
            }
        case 'ERR':
            return {...state,
                isError: true
            }
        case 'RESET':
            return{...state,
                isStarted: false,
                isGenerating: false,
                isEncrypting: false,
                isUploading: false,
                isCreating: false,
                isFinished: false,
                isError: false 
            }
        default:
            return state;
    }
}