import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/auth";

class UserService {
    signup(request) {
        return axios.post(MAIN_URL + "/signup", request)
    }
    signin(request) {
        return axios.post(MAIN_URL + "/signin", request)
    }
    decodeJwt(jwt) {
        return axios.post(MAIN_URL + "/decode", jwt )
    }
}

export default new UserService();