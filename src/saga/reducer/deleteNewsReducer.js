const initialState = {
    isDeleting: false,
    isDeleted: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'DELETE_BEGIN' :
            return {
                ...state,
                isDeleting: true
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                isDeleting: false,
                isDeleted: true
            }
        default: {
            return {
                ...state
            }
        }
    }
}