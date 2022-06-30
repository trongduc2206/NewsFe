const initialState = {
    isEnterNewsDetail: false,
    enterTime: null,
    newsId: null,
    scrollNews: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ENTER' :
            console.log("enter news reducer")
            return {
                ...state,
                isEnterNewsDetail: true,
                enterTime: new Date(),
                newsId: action.newsId,
                scrollNews: false
            }
        case 'LEAVE':
            return {
                ...state,
                isEnterNewsDetail: false,
                enterTime: null,
                newsId: null,
                scrollNews: false
            }
        case 'SCROLL':
            console.log('scrolled')
            return {
                ...state,
                scrollNews: true
            }
        default: {
            return {
                ...state
            }
        }
    }
}