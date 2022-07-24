import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/comment/";

class CommentService {
    insert(commentRequest) {
        return axios.post(MAIN_URL, commentRequest, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
}

export default new CommentService();