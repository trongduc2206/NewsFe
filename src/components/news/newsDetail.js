import {Affix, Breadcrumb, Button, Divider, Form, Input, notification, Tag, Tooltip} from "antd";
import {
    ArrowLeftOutlined,
    BookOutlined,
    CommentOutlined, InfoCircleOutlined, InfoCircleTwoTone, LikeOutlined,
    LinkOutlined, PushpinOutlined, PushpinTwoTone,
    SaveOutlined,
    UpOutlined
} from "@ant-design/icons";
import {Prompt, useHistory, useLocation, useNavigate, useParams} from "react-router-dom";
import CommentList from "./comment";
import NewsShortcut from "./newsShortcut";
import NewsList from "./newsList";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import NewsService from "../../service/news.service";
import parse from 'html-react-parser'
import '../css/newsDetail.css'
import moment from 'moment';
import 'moment/locale/vi'
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import TopicService from "../../service/topic.service";
import CommentService from "../../service/comment.service";
import {useBeforeunload} from 'react-beforeunload';
import InteractNewsService from "../../service/interact-news.service";
import {NewsRelevant} from "./newsRelevant";
import cn from "classnames";
import LikeButton from "./likeButton";
import {ReactComponent as Hand} from "./hand.svg";
import React from "react";
import '../css/likeButton.css'

export function NewsDetail(props) {
    let navigate = useNavigate();

    // const tags = ['tag1', 'tag2'];
    const [tags, setTags] = useState()
    const [openTime, setOpenTime] = useState(new Date())

    const {topic, scroll, isScroll, like, dislike, share} = props
    const [data, setData] = useState(null)
    const [sameTopicData, setSameTopicData] = useState([])
    const [relevantData, setRelevantData] = useState([])
    const [copied, setCopied] = useState(false)
    const [saved, setSaved] = useState(null)
    const [parentTopic, setParentTopic] = useState(null)
    const [commentForm] = Form.useForm();
    const [liked, setLiked] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [likeButtonDirty, setLikeButtonDirty] = useState(false);

    const onBackClick = () => {
        navigate(-1);
    }

    const backToTopHanlde = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    let params = useParams();

    const renderPubDate = (date) => {
        const pubDate = moment(date)
        return pubDate.locale('vi').format('dddd, DD/MM/YYYY, HH:MM')
    }

    const copy = () => {
        const el = document.createElement("input");
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        notification.success({
            message: 'Đã sao chép đường dẫn'
        })
        const request = {
            userId: currentUser.id,
            newsId: params.id,
            type: "SHARE",
            interactTime: new Date()
        }
        InteractNewsService.insertInteractNews(request).then(
            response => {
                if (response.data.status && response.data.status.code === 'success') {
                    console.log("user share in save to db")
                }
            }
        )
    }
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const getData = (newsId) => {
        NewsService.getNewsById(newsId).then(
            response => {
                if (response.data.data) {
                    console.log(response.data.data)
                    setData(response.data.data)
                    if (response.data.data.topicLv3) {
                        // NewsService.getNewsByTopicKey(response.data.data.topicLv1.topicKey, 3, 0).then(
                        NewsService.getTitleSameTopic(response.data.data.topicLv3.topicKey, response.data.data.id).then(
                            response => {
                                if (response.data.data) {
                                    setSameTopicData(response.data.data)
                                }
                            }
                        )
                    } else {
                        NewsService.getTitleSameTopic(response.data.data.topicLv2.topicKey, response.data.data.id).then(
                            response => {
                                if (response.data.data) {
                                    setSameTopicData(response.data.data)
                                }
                            }
                        )
                    }
                    // setTags()
                    // TopicService.getTopicByKey(response.data.data.topic.parentKey).then(
                    //     response => {
                    //         setParentTopic(response.data.data)
                    //     }
                    // )
                }
            }
        )
    }
    useBeforeunload((e) => {
        // e.preventDefault()

        console.log("close time ", new Date())
        const closeTime = new Date()
        if ((closeTime.getTime() - openTime.getTime()) / 1000 > 5.0 && isScroll) {
            console.log("read")
            const request = {
                userId: currentUser.id,
                newsId: params.id,
                type: "READ",
                interactTime: openTime
            }
            InteractNewsService.insertInteractNews(request).then(
                response => {
                    if (response.data.status && response.data.status.code === 'success') {
                        console.log("user read in save to db")
                    }
                }
            )
        } else {
            console.log("unread")
        }
        debugger
           if(likeButtonDirty) {
               const likeRequest = {
                   userId: currentUser.id,
                   newsId: params.id,
                   interactTime: openTime
               }
               if (liked) {
                   likeRequest.type = 'LIKE'
                   InteractNewsService.insertInteractNews(likeRequest).then(
                       response => {
                           if (response.data.status && response.data.status.code === 'success') {
                               console.log("user like in save to db")
                           }
                       }
                   )
               } else {
                   likeRequest.type = 'DISLIKE'
                   InteractNewsService.insertInteractNews(likeRequest).then(
                       response => {
                           if (response.data.status && response.data.status.code === 'success') {
                               console.log("user dislike in save to db")
                           }
                       }
                   )
               }
           }
    })

    let location = useLocation()
    useEffect(() => {
        // setLiked(true)
        const newsId = params.id
        console.log(newsId)
        getData(newsId)
        NewsService.getRelevant(newsId).then(
            response => {
                console.log("get relevant ", response)
                if (response.data.data) {
                    setRelevantData(response.data.data)
                }
            }
        )

        if (currentUser !== null) {
            NewsService.checkNewsSavedByUser(currentUser.id, newsId).then(
                response => {
                    if (response.data.data) {
                        setOpenTime(new Date())
                        setSaved(response.data.data)
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )

            InteractNewsService.checkLike(currentUser.id, newsId).then(
                response => {
                    if(response.data.data) {
                        setLiked(true)
                    }
                }
            ).catch(error => {console.log(error)})
        }


        // window.addEventListener()
        // Moment.locale('vi')
    }, [])

    const renderBreadcrumbTopic = (n) => {
        const topicLv1Href = '/topic/' + n.topicLv1.topicKey
        const topicLv2Href = '/topic/' + n.topicLv2.topicKey
        if (n.topicLv3) {
            const topicLv3Href = '/topic/' + n.topicLv3.topicKey
            return (
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a
                            class='link'
                            href={topicLv1Href}>
                            {n.topicLv1 ? n.topicLv1.name : 'Chủ đề'}
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <a
                            class='link'
                            href={topicLv2Href}>
                            {n.topicLv2 ? n.topicLv2.name : 'Chủ đề'}
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <a
                            class='link'
                            href={topicLv3Href}>
                            {n.topicLv3 ? n.topicLv3.name : 'Chủ đề'}
                        </a>
                    </BreadcrumbItem>
                </Breadcrumb>
            )
        } else {
            return (
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a
                            class='link'
                            href={topicLv1Href}>
                            {n.topicLv1 ? n.topicLv1.name : 'Chủ đề'}
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <a
                            class='link'
                            href={topicLv2Href}>
                            {n.topicLv2 ? n.topicLv2.name : 'Chủ đề'}
                        </a>
                    </BreadcrumbItem>
                </Breadcrumb>
            )
        }
    }

    const renderBreadcrumbForChildTopic = (topic) => {
        // let parentTopic
        // console.log(topic)
        // TopicService.getTopicByKey(topic.parentKey).then(
        //     response => {
        //         // parentTopic = response.data.data
        //         setParentTopic(response.data.data)
        //     }
        // )
        const parentHref = '/topic/' + topic.parentKey
        const childHref = '/topic/' + topic.topicKey
        return (
            <Breadcrumb>
                <BreadcrumbItem>
                    <a
                        class='link'
                        href={parentHref}>
                        {parentTopic ? parentTopic.name : 'Chủ đề'}
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <a
                        class='link'
                        href={childHref}>
                        {topic.name}
                    </a>
                </BreadcrumbItem>
            </Breadcrumb>
        )
    }

    const renderBreadcrumbForParentTopic = (topic) => {
        const href = '/topic/' + topic.topicKey
        return (
            <Breadcrumb>
                <BreadcrumbItem>
                    <a
                        class={'link'}
                        href={href}>
                        {topic.name}
                    </a>
                </BreadcrumbItem>
            </Breadcrumb>
        )
    }

    const onCommentHandle = (values) => {
        console.log(values);
        const commentRequest = {
            userId: currentUser.id,
            newsId: params.id,
            content: values.comment,
        }
        console.log(commentRequest)
        CommentService.insert(commentRequest).then(
            response => {
                // console.log()
                if (response.data.status.code === 'success') {
                    console.log("Commnent success")
                    const newsId = params.id
                    commentForm.resetFields()
                    getData(newsId)
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }
    const onSaveNews = () => {

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
    const particleList = Array.from(Array(10));

    return (
        <div style={{display: 'flex', background: 'white', padding: '10px'}}>
            {/**!/*/}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: "30px",
                flex: 1
                // position: 'fixed',
                // position: '-webkit-sticky',
                // top: '10'
            }}
            >
                {/*<Affix offsetTop={150}>*/}
                {/*<Sider style={{*/}
                {/*    position: 'sticky',*/}
                {/*    top: 0,*/}
                {/*    backgroundColor: "white"*/}
                {/*}}*/}
                {/*>*/}
                <div style={{
                    position: 'sticky',
                    top: 100,
                    // zIndex: 3,
                    marginBottom: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {
                        saved ?
                            <Tooltip title={"Bạn đã lưu tin này vào " + saved}>

                                <PushpinTwoTone style={{
                                    // display: 'block'
                                    // ,marginLeft: 'auto'
                                    fontSize: '2vw', marginBottom: '10px'
                                }}/>

                            </Tooltip>
                            : null
                    }
                    <Tooltip title="Trở về trước" placement="top">
                        <Button icon={<ArrowLeftOutlined/>} onClick={onBackClick} shape="circle"
                        >
                        </Button>
                    </Tooltip>
                    {
                        currentUser ? (
                                saved ?
                                    // <Tooltip title={"Bạn đã lưu tin này vào " + saved}>
                                    //     <PushpinTwoTone/>
                                    // </Tooltip>
                                    null
                                    :
                                    <Tooltip title="Lưu tin" placement='left'>
                                        <Button icon={<BookOutlined/>} shape="circle" style={{marginTop: "10px"}}
                                                onClick={onSaveNews}>
                                        </Button>
                                    </Tooltip>
                            )
                            : null
                    }
                    <Tooltip title="Chia sẻ" placement="left">
                        <Button icon={<LinkOutlined/>} shape="circle" style={{marginTop: "10px"}} onClick={copy}>
                        </Button>
                    </Tooltip>
                    {
                        currentUser ?
                            <Tooltip title="Bình luận" placement="left">
                                {/*<Button icon={<CommentOutlined/>} shape="circle" style={{marginTop: "10px"}}>*/}
                                {/*    <a href="#comment"></a>*/}
                                {/*</Button>*/}
                                <a
                                    class='link'
                                    href="#comment">
                                    <Button icon={<CommentOutlined/>} shape="circle" style={{marginTop: "10px"}}>
                                    </Button>
                                </a>
                            </Tooltip>
                            : null
                    }
                    {
                        currentUser ? null
                            :
                            <Tooltip title="Hãy đăng nhập để sử dụng nhiều tiện ích khác" placement="bottom">
                                {/*<Button icon={<CommentOutlined/>} shape="circle" style={{marginTop: "10px"}}>*/}
                                {/*    <a href="#comment"></a>*/}
                                {/*</Button>*/}
                                {/*<a*/}
                                {/*    class='link'*/}
                                {/*    href="#">*/}
                                <Button icon={<InfoCircleOutlined/>} shape="circle" style={{marginTop: "10px"}}>
                                </Button>
                                {/*</a>*/}
                            </Tooltip>
                    }
                </div>
                {/*</Affix>*/}
                {/*</Sider>*/}
            </div>
            <div class='flex-container'>
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    marginLeft: "20px",
                    marginRight: "50px",
                    marginTop: "20px",
                    marginBottom: "30px",
                    flex: 5
                }}
                >
                    <div style={{display: 'flex'}}>
                        {/*<a style={{fontSize: '18px'}}>{data ? data.topic.name : 'Chủ đề'}</a>*/}
                        {data ? renderBreadcrumbTopic(data) : null}
                        {/*{data ? (data.topic.parentKey ? renderBreadcrumbForChildTopic(data.topic) : renderBreadcrumbForParentTopic(data.topic)) : null}*/}
                        {/*<span style={{marginLeft: "auto"}}>Thứ 3, 24/05/2022</span>*/}
                        <span style={{
                            marginLeft: "auto",
                            fontSize: '1vw'
                        }}>{data ? renderPubDate(data.pubDate) : null}</span>
                    </div>
                    <div
                        // style={{display: 'flex'}}
                    >

                        <h1 style={{
                            fontSize: "3vw",
                            fontFamily: "Merriweather",
                            fontWeight: "bold",
                            paddingRight: "5px"
                        }}>{data ? data.title : 'Tiêu đề'}</h1>
                    </div>
                    <div>
                        <img
                            style={{
                                width: '100%',
                                height: 'auto',
                                marginBottom: '15px'
                            }}
                            src={data ? data.imageUrl : 'https://joeschmoe.io/api/v1/random'}
                        />
                    </div>
                    <div style={{fontSize: '1vw', fontWeight: 400}}>
                        {parse(data ? data.content : '<p>Nội dung</p>')}
                        {/*<p style={{fontSize: "18px"}}>"Trong lĩnh vực cơ sở hạ tầng, chúng tôi thông báo đặt mục tiêu đầu tư*/}
                        {/*    hơn 50 tỷ USD trong 5 năm tới để hỗ trợ các dự án ở khu vực Ấn Độ Dương - Thái Bình Dương", Thủ*/}
                        {/*    tướng Nhật Bản Fumio Kishida phát biểu sau hội nghị thượng đỉnh Bộ Tứ ở Tokyo hôm nay.</p>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                        {/*<img style={{maxHeight: "450px", maxWidth: "700px"}} src="https://joeschmoe.io/api/v1/random"/>*/}
                    </div>
                    <div>
                        {/*<Button icon={<LikeOutlined />} onClick={() => {*/}

                        {/*}}></Button>*/}
                        <button
                            onClick={() => {
                                if(liked) {
                                    dislike(params.id)
                                } else {
                                    like(params.id)
                                }
                                setLiked(!liked);
                                setClicked(true);
                                setLikeButtonDirty(true);
                            }}
                            onAnimationEnd={() => setClicked(false)}
                            className={cn("like-button-wrapper", {
                                liked,
                                clicked,
                            })}
                        >
                            {liked && (
                                <div className="particles">
                                    {particleList.map((_, index) => (
                                        <div
                                            className="particle-rotate"
                                            style={{
                                                transform: `rotate(${
                                                    (360 / particleList.length) * index + 1
                                                }deg)`,
                                            }}
                                        >
                                            <div className="particle-tick" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="like-button">
                                <Hand />
                                <span>Like</span>
                                <span className={cn("suffix", { liked })}>d</span>
                            </div>
                        </button>
                        {/*<LikeButton/>*/}
                    </div>
                    <div style={{display: 'flex', marginTop: '20px'}}>
                        <Tooltip title="Trở về trước">
                            <Button icon={<ArrowLeftOutlined/>} onClick={onBackClick}></Button>
                        </Tooltip>
                        {
                            currentUser ?
                                <Button icon={<SaveOutlined/>} style={{marginLeft: '15px'}}>Lưu tin</Button>
                                : null
                        }
                        <Tooltip title="Sao chép link">
                            <Button icon={<LinkOutlined/>} style={{marginLeft: 'auto'}} onClick={copy}></Button>
                        </Tooltip>
                        {/*<Button icon={<UpOutlined/>} style={{marginLeft: "15px"}} onClick={backToTopHanlde}> Trở về*/}
                        {/*    trên</Button>*/}
                    </div>
                    <div style={{display: 'flex', marginTop: '30px'}}>
                        <div>
                            <h5 style={{color: '#bdbdbd', marginRight: '10px', fontSize: '12px'}}>Từ khóa: </h5>
                        </div>
                        <div>
                            {data ? data.keyword.split(/[,]/).map((tag) => {
                                return <Tag color="orange">
                                    <a
                                        class='link'
                                        href="#">
                                        {tag}
                                    </a>
                                </Tag>
                            }) : null}

                        </div>
                    </div>
                    <div>
                        <Divider></Divider>
                    </div>
                    <div id="comment" style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{display: 'flex'}}>
                            <h1>Bình luận</h1>
                            {
                                currentUser ? null :
                                    <Tooltip title="Đăng nhập để thực hiện bình luận">
                                        <InfoCircleTwoTone/>
                                    </Tooltip>
                            }
                        </div>
                        {
                            currentUser ?
                                <Form
                                    form={commentForm}
                                    onFinish={onCommentHandle}
                                >
                                    <Form.Item
                                        name="comment"
                                    >
                                        <Input placeholder="Bình luận"/>
                                    </Form.Item>
                                    <Form.Item style={{marginLeft: 'auto'}}>
                                        <Button type='primary' htmlType='submit'
                                                style={{display: 'block', marginLeft: "auto"}}>
                                            Bình luận
                                        </Button>
                                    </Form.Item>
                                </Form>
                                : null
                        }
                    </div>
                    {
                        data ? (data.comments.length > 0 ?
                                <div>
                                    {/*<CommentList data={data ? data.comments : null}></CommentList>*/}
                                    <CommentList
                                        data={data ? data.comments.sort((a, b) => (a.createTime < b.createTime) ? 1 : ((b.createTime <= a.createTime) ? -1 : 0)) : null}></CommentList>
                                </div>
                                : <span>Chưa có bình luận</span>)
                            : <span>Chưa có bình luận</span>
                    }
                    {
                        relevantData.length > 0 ?
                            <div>
                                <Divider></Divider>
                                <h1 style={{color: "#1e90ff"}}>Liên quan</h1>

                                {/*<NewsList data={relevantData} isPagination={false}></NewsList>*/}
                                <NewsRelevant data={relevantData}/>
                            </div>
                            : null
                    }

                </div>
                <div style={{
                    flex: 2,
                }}
                >
                    <div style={{
                        position: 'sticky',
                        top: 150,
                        marginBottom: '60vh'
                        // alignItems: 'center'
                    }}>
                        <h1 style={{color: "#1e90ff"}}>Cùng chủ đề</h1>
                        {/*<Divider style={{color: "#1e90ff"}}></Divider>*/}
                        {/*<NewsShortcut></NewsShortcut>*/}
                        {sameTopicData && sameTopicData.length > 0 ?
                            sameTopicData.map((newData) => {
                                return (
                                    <div>
                                        <Divider style={{marginTop: '7px', marginBottom: '7px'}}></Divider>
                                        <a
                                            class='link'
                                            href={"/news/" + newData.id}
                                            style={{fontWeight: 600}}
                                        >
                                            {/*<h3>{newData.title} </h3>*/}
                                            {newData.title}
                                        </a>
                                    </div>
                                )
                            })
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    // console.log(state)
    return {
        isScroll: state.interact.scrollNews,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        scroll: () => dispatch({type: "SCROLL"}),
        like : (id) => dispatch({type: "LIKE", newsId: id}),
        dislike : (id) => dispatch({type: "DISLIKE", newsId: id}),
        share : (id) => dispatch({type: "SHARE", newsId: id})
        // leaveNews: () => dispatch({type: "LEAVE"}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail)