const initialState = {
    size: 12,
    page: 1,
    total: null
}
export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_DATA_SUCCESS':
            console.log(action)
            return {
                ...state,
                page: action.page,
                total: action.total
            }
        default: return state;
    }
}