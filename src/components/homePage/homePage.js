import React, {useEffect, useState} from 'react';
import TopicHomepage from "./topicHomepage";
import {Avatar, Card, Carousel, Divider, List, Space} from "antd";
import {LikeOutlined, MessageOutlined, StarOutlined} from "@ant-design/icons";
import NewsSpotLight from "../news/newsRelevant";
import {connect} from "react-redux";
import TopicService from "../../service/topic.service";
import NewsService from "../../service/news.service";
import {NewsList} from "../news/newsList";

export function HomePage(props) {
    const {loadRecommendIds, startRecommend} = props
    const [topics, setTopics] = useState([]);
    const [recommend, setRecommend] = useState([])
    const [recommendIds, setRecommendIds] = useState([])
    const data = Array.from({
        length: 3,
    }).map((_, i) => ({
        href: '/news',
        title: `Title ${i}`,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const contentStyle = {
        height: '400px',
        color: '#fff',
        lineHeight: '360px',
        textAlign: 'center',
        // background: '#364d79',
        backgroundImage: "url('https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png')",
        backgroundSize: 'cover',
    };

    const onChange = (currentSlide) => {
        console.log(currentSlide);
    };

    useEffect(() => {
        TopicService.getNonChildrenTopic().then(
            response => {
                if(response.data.data) {
                    setTopics(response.data.data)
                }
            }
        )
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser) {
            startRecommend()
            NewsService.recommend(currentUser.id).then(
                response => {
                    if(response.data.data) {
                        console.log("we have recommend news")
                        setRecommend(response.data.data)
                        const recommendNewsIds = response.data.data.map((news) => {
                            console.log(news.id)
                            return news.id
                        })
                        loadRecommendIds(recommendNewsIds)
                        setRecommendIds(recommendNewsIds)
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        }

    },[])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: '15px',
                backgroundColor: 'white'
            }}
        >
            {/*<h1>Hello Các bạn</h1>*/}
            {/*<NewsShortCutBlock></NewsShortCutBlock>*/}
            {/*<NewsRelevant data={data}></NewsRelevant>*/}
            {
                recommend.length > 0 ?
                <div>
                <Divider orientation="left" style={{
                    fontFamily: "Merriweather",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e90ff"
                }}>
                    Đề xuất cho bạn
                </Divider>
                <NewsList data={recommend} isPagination={false}></NewsList>
                </div>
                    : null
            }
            {topics.map((topic) => {
                return (
                    <TopicHomepage topicName={topic.name} topicKey={topic.topicKey}  recommendNews={recommend}></TopicHomepage>
                )
            })}
            {/*<TopicHomepage topicName="Thế giới"></TopicHomepage>*/}
            {/*<TopicHomepage topicName="Thế giới"></TopicHomepage>*/}
            {/*<NewsList></NewsList>*/}
        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadRecommendIds: (r) => dispatch({type: "RECOMMENDED", recommendIds: r}),
        startRecommend: () => dispatch({type: "RECOMMENDING"})
    }
}
export default connect(null, mapDispatchToProps)(HomePage);