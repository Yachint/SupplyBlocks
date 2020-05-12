export const started = () => {
    return {
        type: 'START'
    }
}

export const generating = () => {
    return {
        type: 'GEN'
    }
}

export const encrypting = () => {
    return {
        type: 'ENC'
    }
}

export const uploading = () => {
    return {
        type: 'UPLOAD'
    }
}

export const creating = () => {
    return {
        type: 'CREATE'
    }
}

export const finished = () => {
    return {
        type: 'FIN'
    }
}

export const error = () => {
    return {
        type: 'ERR'
    }
}

export const reset = () => {
    return {
        type: 'RESET'
    }
}