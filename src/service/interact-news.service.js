import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/interact/";

class InteractNewsService {
    insertInteractNews(interactNewsRequest) {
        return axios.post(MAIN_URL + "news", interactNewsRequest)
    }
}

export default new InteractNewsService();