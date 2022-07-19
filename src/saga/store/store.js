import {applyMiddleware, combineReducers, legacy_createStore as createStore, compose} from "redux";
import React from "react";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../rootSaga";
import authReducer from "../reducer/authReducer";
import paginationReducer from "../reducer/paginationReducer";
import deleteNewsReducer from "../reducer/deleteNewsReducer";
import interactTrackingReducer from "../reducer/interactTrackingReducer";
import recommendNewsReducer from "../reducer/recommendNewsReducer";
import likeReducer from "../reducer/likeReducer";
const sagaMiddleWare= createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const rootReducer=combineReducers({auth:authReducer, pagination: paginationReducer, deleteNews: deleteNewsReducer, interact: interactTrackingReducer, recommend: recommendNewsReducer, like: likeReducer});

// const store= createStore(rootReducer,applyMiddleware(sagaMiddleWare), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const store= createStore(rootReducer,composeEnhancer(applyMiddleware(sagaMiddleWare)));
sagaMiddleWare.run(rootSaga);
export {store};