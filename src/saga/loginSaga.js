import {put, takeLatest, call} from "redux-saga/effects"
import axios from "axios"
import {notification} from 'antd'

export function* watcherLoginSaga() {
    yield takeLatest("CHECK_LOGIN_API", workerLoginSaga)
}

function checkLogin(userName, passWord) {
    return axios({
        method: 'POST',
        url: 'http://localhost:8080/api/auth/signin',
        data: {
            username: userName,
            password: passWord
        }
    }).then(response => ({response})).catch(error => ({error}));
}

function* workerLoginSaga(action) {
    const {response, error} = yield call(checkLogin, action.userName, action.passWord);
    if (response) {
        console.log(response);
        if(response.data.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        // const loginStatus = response.data.data;
        // if (loginStatus === false) notification.error({
        //     message: 'Đăng nhập thất bại',
        //     description: 'Username Or Password Was Wrong'
        // })
        // else notification.success({
        //     message: 'Đăng nhập thành công'
        // })
        // console.log(loginStatus);

        const username = response.data.data.userName;
        console.log(username);

        // yield put({type: 'CHECK_LOGIN_SUCCESS', loginStatus: true, userName: username })
        window.location.reload();
    } else {
        console.log(error);
        notification.error({
            message: 'Đăng nhập thất bại',
            description: 'Tên đăng nhập hoặc mật khẩu không đúng'
        })
    }
}