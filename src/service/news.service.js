import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/news/";

class NewsService {
    getNewsByTopicExcept(request) {
        return axios.put(MAIN_URL + "topic/except", request)
    }

    getNewsByTopicExceptByUser(request, userId) {
        return axios.put(MAIN_URL + "topic/except/" + userId, request)
    }

    getTitleSameTopic(topicKey, newsId) {
        return axios.get(MAIN_URL + "same-topic", {params: {topicKey: topicKey, newsId: newsId}})
    }

    getNewsByTopicKey(key, offset, page) {
        return axios.get(MAIN_URL, {params: {topicKey: key, offset: offset, page: page}})
    }

    getNewsByTopicKeyByUser(key, offset, page, userId) {
        return axios.get(MAIN_URL + "topic-by-user", {params: {topicKey: key, offset: offset, page: page, userId: userId}})
    }

    getNewsById(id) {
        return axios.get(MAIN_URL + id)
    }

    search(query, offset, page) {
        return axios.get(MAIN_URL + "search", {params: {query: query, offset: offset, page: page}})
    }

    searchByUser(query, offset, page, userId) {
        return axios.get(MAIN_URL + "search-by-user", {params: {query: query, offset: offset, page: page, userId: userId}})
    }

    getSavedNew(userId, offset, page) {
        return axios.get(MAIN_URL + "save/" + userId, {params: {offset: offset, page: page}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    getLikedNew(userId, offset, page) {
        return axios.get(MAIN_URL + "like/" + userId, {params: {offset: offset, page: page}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    saveNews(saveNewsRequest) {
        return axios.post(MAIN_URL + "save", saveNewsRequest, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    checkNewsSavedByUser(userId, newsId) {
        return axios.get(MAIN_URL + "check-save", {params: {userId: userId, newsId: newsId}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    softDeleteSavedNews(saveNewsRequest) {
        return axios.put(MAIN_URL + "save/soft-delete", saveNewsRequest, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    recommend(userId) {
        return axios.get(MAIN_URL + "recommend/"+userId, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    getRecommend(userId) {
        return axios.get(MAIN_URL + "get-recommend/"+userId, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    getRelevant(newsId) {
        return axios.get(MAIN_URL + "relevant/" + newsId)
    }
}

export default new NewsService();