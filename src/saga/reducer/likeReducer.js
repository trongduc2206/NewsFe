const initialState = {
    newsId: null,
    like: false,
    share: false
}
export default (state = initialState, action) => {
    switch (action.type) {
        case 'LIKE' :
            console.log("like news")
            return {
                ...state,
                newsId: action.newsId,
                like: true
            }
        case 'DISLIKE':
            console.log("dislike news")
            return {
                ...state,
                newsId: action.newsId,
                like: false
            }
        case 'SHARE':
            console.log("share news")
            return {
                ...state,
                newsId: action.newsId,
                share: true
            }
        default: {
            return {
                ...state
            }
        }
    }
}