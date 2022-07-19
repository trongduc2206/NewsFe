import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/interact/";

class InteractNewsService {
    insertInteractNews(interactNewsRequest) {
        return axios.post(MAIN_URL + "news", interactNewsRequest)
    }
    checkLike(userId, newsId) {
        return axios.get(MAIN_URL + "check-like", {params: {userId: userId, newsId: newsId}})
    }
}

export default new InteractNewsService();