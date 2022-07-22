const initialState = {
    newsId: null,
    like: false,
    share: false,
    likeClicked: false
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
        case 'CLICK_LIKE_BUTTON':
            console.log("click like button")
            return {
                ...state,
                newsId: action.newsId,
                likeClicked: true
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