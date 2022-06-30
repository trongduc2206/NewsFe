const initialState = {
    isRecommending: false,
    recommendIds: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'RECOMMENDING':
            console.log("recommending")
            return {
                ...state,
                isRecommending: true
            }
        case 'RECOMMENDED' :
            console.log("recommended ", action.recommendIds)
            return {
                ...state,
                isRecommending: false,
                recommendIds: action.recommendIds
            }
        default: {
            return {
                ...state
            }
        }
    }
}