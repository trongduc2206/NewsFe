import {Avatar, Card, Modal, notification, Tooltip} from "antd";
import Meta from "antd/es/card/Meta";
import {useNavigate} from 'react-router-dom'
import React, {useEffect} from "react";
import {connect} from "react-redux";
import '../css/newsShortcut.css'
import moment from "moment";
import {DeleteOutlined, EllipsisOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import NewsService from "../../service/news.service";
import {useState} from "react";

export function NewsShortcut(props) {
    // const {style, title, content, imageUrl, id} = props;
    const {data, style, deleteNewsSuccess, deleteNewsBegin} = props
    const [saved, setSaved] = useState(null)

    let navigate = useNavigate();
    const onClickHandle = () => {
        console.log("news detail");
        navigate("/news/" + data.id);
        // navigate()
        // window.location.reload()
    }
    const renderSavedTime = () => {
        if(data.savedTime) {
            return (
                <Tooltip title={moment(data.savedTime).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>Lưu {moment(data.savedTime).fromNow()}</span>
                </Tooltip>
            )
        } else {
            return null
        }
    }
    const { confirm } = Modal;
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const onDeleteNews = () => {
        confirm({
            title: 'Bạn có chắc muốn xóa bài báo này khỏi danh sách lưu?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',

            onOk() {
                if(currentUser) {
                    console.log('OK');
                    const request = {
                        userId: currentUser.id,
                        newsId: data.id
                    }
                    deleteNewsBegin()
                    NewsService.softDeleteSavedNews(request).then(
                        response => {
                            if(response.data.status) {
                                if(response.data.status.code === 'success') {
                                    deleteNewsSuccess()
                                    notification.success({
                                        message: 'Xóa thành công'
                                    })
                                }
                            }
                        }
                    ).catch(
                        error => {
                            console.log(error)
                        }
                    )
                }
            },

            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    const onSaveNews = () => {
        if(currentUser) {
            const saveNewsRequest = {
                userId: currentUser.id,
                newsId: data.id
            }
            NewsService.saveNews(saveNewsRequest).then(
                response => {
                    if (response.data.status.code === 'success') {
                        // window.location.reload()
                        setSaved(new Date())
                        notification.success({
                                message: "Lưu tin thành công"
                            }
                        )
                    } else {
                        notification.error({
                            message: "Lưu tin thất bại",
                            description: response.data.status.code
                        })
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                    console.log(error.response.data.status.code)
                    debugger
                    notification.error({
                        message: "Lưu tin thất bại",
                        description: error.response.data.status.code
                    })
                }
            )
        }
    }

    const renderActions = () => {
        if(data.savedTime) {
            return [
                <div>
                    {
                        data.savedTime ?
                            <Tooltip title={moment(data.savedTime).format('YYYY-MM-DD HH:mm:ss')}>
                                <span>Lưu {moment(data.savedTime).fromNow()}</span>
                            </Tooltip>
                            : null
                    }
                </div>,
                <div>
                    <Tooltip title={moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>Đăng {moment(data.createTime).fromNow()}</span>
                    </Tooltip>
                </div>,
                <div>
                    <Tooltip title="Gỡ khỏi danh sách lưu">
                        <DeleteOutlined onClick={onDeleteNews} />
                    </Tooltip>
                </div>
            ]
        } else if(currentUser && !saved) {
            return [
                <div>
                    <Tooltip title={moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(data.createTime).fromNow()}</span>
                    </Tooltip>
                </div>,
                <div>
                    <span onClick={onSaveNews}>Lưu</span>
                </div>
            ]
        } else if (currentUser && saved) {
            return [
                <div>
                    <Tooltip title={moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>Đăng {moment(data.createTime).fromNow()}</span>
                    </Tooltip>
                </div>,
                <div>
                    {
                        saved ?
                            <Tooltip title={moment(saved).format('YYYY-MM-DD HH:mm:ss')}>
                                <span>Lưu {moment(saved).fromNow()}</span>
                            </Tooltip>
                            : null
                    }
                </div>,
            ]
        } else return [
            <div>
                <Tooltip title={moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>Đăng {moment(data.createTime).fromNow()}</span>
                </Tooltip>
            </div>
        ]

    }
    const renderPreviewDescription = (data) => {
        if(data) {
            const descriptionSplited = data.summary.split(/[.]/)
            if(descriptionSplited[0].length <= 160 && descriptionSplited[0].length > 128) {
                return descriptionSplited[0] + " ..."
            } else {
                return data.summary.slice(0,160) + "..."
            }
        }
    }

    useEffect(() => {
        // console.log("description ", data.summary)
        // const descriptionSplited = data.summary.split(/[.]/)
        // console.log("description sentences ", descriptionSplited)
        // console.log(renderPreviewDescription(data))

    },[])
    return (
        <div>
            <Card
                hoverable
                bodyStyle={{
                    height: '242px'
                }}
                style={style}
                cover={
                    <img
                        alt="example"
                        src={data.imageUrl}
                        style={{
                            // maxHeight: '150px'
                            height: '150px'
                        }}
                        onClick={onClickHandle}
                    />
                }
                // onClick={onClickHandle}
                // extra={<div>3 giờ trước</div>}
                actions={
                    // <SettingOutlined key="setting" />,
                    // <EditOutlined key="edit" />,
                    // <EllipsisOutlined key="ellipsis" />,

                    // <div>
                    //     {
                    //         data.savedTime ?
                    //             <Tooltip title={moment(data.savedTime).format('YYYY-MM-DD HH:mm:ss')}>
                    //                 <span>Lưu {moment(data.savedTime).fromNow()}</span>
                    //             </Tooltip>
                    //             : null
                    //     }
                    // </div>,
                    // <div>
                    //     <Tooltip title={moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                    //         <span>Đăng {moment(data.createTime).fromNow()}</span>
                    //     </Tooltip>
                    // </div>,
                    renderActions()
                    // <EllipsisOutlined key="ellipsis" />
                    }
            >
                <Meta
                    // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={data.title}
                    // description={data.summary}
                    description={renderPreviewDescription(data)}
                    onClick={onClickHandle}
                    // style={{backgroundColor: 'blue'}}
                />
            </Card>
        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        deleteNewsSuccess : () => dispatch({type: "DELETE_SUCCESS"}),
        deleteNewsBegin : () => dispatch({type: "DELETE_BEGIN"})
        // login: (u, p) => dispatch({type: "CHECK_LOGIN_API", userName: u, passWord: p}),
        // signup: (u, p, e) => dispatch({type: "CHECK_SIGNUP_API", userName: u, passWord: p, email: e}),
        // resetSignupStatus: () => dispatch({type: "RESET_SIGNUP_STATUS"}),
        // logout: () => dispatch({type: "LOGOUT"})
    }
}
export default connect(null, mapDispatchToProps)(NewsShortcut);