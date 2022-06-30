import React from "react";
import NewsList from "./newsList";
import {useEffect, useState} from "react";
import NewsService from "../../service/news.service";
import {useParams, useSearchParams} from "react-router-dom";
import {Divider, Modal, notification} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {connect} from "react-redux";
import {MainLayout} from "../layout/layout";

export function SavedNews(props) {
    const {isDeleted, isDeleting} = props
    const [data, setData] = useState()
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchParams] = useSearchParams()

    let params = useParams();
    const { confirm } = Modal;
    // const onDeleteNews = (newsId) => {

    const getData = () => {
        if(currentUser.id === parseInt(params.userId)) {
            const page = searchParams.get('page')
            if (page) {
                setCurrentPage(parseInt(page))
            }

            const pageToCallApi = page ? parseInt(page) - 1 : 0
            NewsService.getSavedNew(currentUser.id, 12, pageToCallApi).then(
                response => {
                    if (response.data.data) {
                        setData(response.data.data.content)
                        setTotal(response.data.data.totalElements)
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        }
    }

    useEffect(() => {
        console.log(currentUser.id)
        console.log(params.userId)
        getData()
    },[isDeleting])
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '15px',
            // display: "flex"
        }}>
            <h1 style={{
                marginTop: '15px',
                marginLeft: '20px',
                color: '#1e90ff'
            }}>
               Tin đã lưu
            </h1>
            <Divider></Divider>
            <NewsList data={data} currentPage={currentPage} total={total} isPagination={true} ></NewsList>
        </div>
    )
}

const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    // console.log(state)
    return {
        isDeleted: state.deleteNews.isDeleted,
        isDeleting: state.deleteNews.isDeleting
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        // login: (u, p) => dispatch({type: "CHECK_LOGIN_API", userName: u, passWord: p}),
        // signup: (u, p, e) => dispatch({type: "CHECK_SIGNUP_API", userName: u, passWord: p, email: e}),
        // resetSignupStatus: () => dispatch({type: "RESET_SIGNUP_STATUS"}),
        // logout: () => dispatch({type: "LOGOUT"})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SavedNews);