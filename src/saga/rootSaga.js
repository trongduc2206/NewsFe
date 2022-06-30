import {fork} from 'redux-saga/effects';
import {all} from "@redux-saga/core/effects";
import {watcherLoginSaga} from "./loginSaga";
import {watcherSignupSaga} from "./signupSaga";


export default function* rootSaga(){
    yield all( [
        // fork(watcherObjectSaga),
        fork(watcherLoginSaga),
        fork(watcherSignupSaga)
    ]);
}