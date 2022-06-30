import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/news/";

class NewsService {
    getNewsByTopicExcept(request) {
        return axios.put(MAIN_URL + "topic/except", request)
    }

    getTitleSameTopic(topicKey, newsId) {
        return axios.get(MAIN_URL + "same-topic", {params: {topicKey: topicKey, newsId: newsId}})
    }

    getNewsByTopicKey(key, offset, page) {
        return axios.get(MAIN_URL, {params: {topicKey: key, offset: offset, page: page}})
    }

    getNewsById(id) {
        return axios.get(MAIN_URL + id)
    }

    search(query, offset, page) {
        return axios.get(MAIN_URL + "search", {params: {query: query, offset: offset, page: page}})
    }

    getSavedNew(userId, offset, page) {
        return axios.get(MAIN_URL + "save/" + userId, {params: {offset: offset, page: page}})
    }

    saveNews(saveNewsRequest) {
        return axios.post(MAIN_URL + "save", saveNewsRequest)
    }

    checkNewsSavedByUser(userId, newsId) {
        return axios.get(MAIN_URL + "check-save", {params: {userId: userId, newsId: newsId}})
    }

    softDeleteSavedNews(saveNewsRequest) {
        return axios.put(MAIN_URL + "save/soft-delete", saveNewsRequest)
    }

    recommend(userId) {
        return axios.get(MAIN_URL + "recommend/"+userId)
    }
}

export default new NewsService();