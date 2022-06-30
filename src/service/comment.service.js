import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/comment/";

class CommentService {
    insert(commentRequest) {
        return axios.post(MAIN_URL, commentRequest)
    }
}

export default new CommentService();