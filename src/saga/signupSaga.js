import {put, takeLatest, call} from "redux-saga/effects"
import axios from "axios"
import {notification} from 'antd'

export function* watcherSignupSaga() {
    yield takeLatest("CHECK_SIGNUP_API", workerSignupSaga)
}

function checkSignup(userName, passWord, email) {
    return axios({
        method: 'POST',
        url: 'http://localhost:8080/api/auth/signup',
        data: {
            username: userName,
            password: passWord,
            email: email
        }
    }).then(response => ({response})).catch(error => ({error}));
}

function* workerSignupSaga(action) {
    const {response, error} = yield call(checkSignup,  action.userName, action.passWord, action.email);
    if (response) {
        console.log(response);
        const signupStatus = response.data.data;
        if (signupStatus === false) notification.error({
            message: 'Đăng ký thất bại',
            description: response.data.status.message
        })
        else notification.success({message: 'Đăng ký thành công', description: 'Hãy đăng nhập bằng tài khoản của bạn'})
        console.log(signupStatus);
        // const userName = response.data.userName;
        // console.log(userName);
        yield put({type: 'CHECK_SIGNUP_SUCCESS', signupStatus: signupStatus})
    } else {
        notification.error({
                message: 'Đăng ký thất bại',
                description: error.response.data.status.message
            }
        )
    }
}