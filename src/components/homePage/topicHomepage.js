import {Divider, List, Avatar, Row, Col} from "antd";
import {NewsList} from "../news/newsList";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import NewsService from "../../service/news.service";
import '../css/topicHomePage.css'

export function TopicHomepage(props) {
    const {topicName, topicKey, recommendNewsIds, recommendNews, test, isRecommending} = props
    const [data, setData] = useState()
    // const data = [
    //     {
    //         title: 'Title 1',
    //         content: 'Abstract 1'
    //     },
    //     {
    //         title: 'Title 2',
    //         content: 'Abstract 1'
    //     },
    //     {
    //         title: 'Title 3',
    //         content: 'Abstract 1'
    //     },
    //     {
    //         title: 'Title 4',
    //         content: 'Abstract 1'
    //     },
    //     {
    //         title: 'Title 5',
    //         content: 'Abstract 1'
    //     },
    //     {
    //         title: 'Title 6',
    //         content: 'Abstract 1'
    //     },
    // ];
    // const recommendNewsId = [85, 88]
    useEffect(() => {
        console.log(test)
        getData()
        // NewsService.getNewsByParentTopic(topicKey, 6, 0).then(
        //     response => {
        //         if (response.data.data) {
        //             console.log("topic "+topicKey)
        //             console.log(recommendNewsIds)
        //             if(recommendNewsIds != null && recommendNewsIds.length > 0) {
        //             // if(recommendNews != null && recommendNews.length > 0) {
        //                 console.log("we have recommend news ", recommendNewsIds)
        //                 // console.log("we have recommend news ", recommendNews)
        //                 // console.log("our original data ", response.data.data.content)
        //                 if(response.data.data.content != null && response.data.data.content.length > 0) {
        //                     const dataToDisplay = response.data.data.content.map((news) => {
        //                         if (!recommendNewsIds.includes(news.id)) {
        //                             return news
        //                         }
        //                         // if(!recommendNews.includes(news)) {
        //                         //     return news
        //                         // }
        //                     })
        //
        //                     // setData(response.data.data.content)
        //                     console.log("generate data to display ", dataToDisplay)
        //                     setData(dataToDisplay)
        //                 } else {
        //                     setData(response.data.data.content)
        //                 }
        //             } else {
        //                 setData(response.data.data.content)
        //             }
        //         }
        //     }
        // ).catch(
        //     error => {
        //         console.log(error)
        //     }
        // )
    }, [])

    useEffect(() => {
        console.log("recommend state change to ", isRecommending )
        console.log("on change recommend state, data ", data)
        getData()
    },[recommendNewsIds, isRecommending])
    const getData = () => {
        if(recommendNewsIds != null && recommendNewsIds.length > 0) {
            const request = {
                topicKey: topicKey,
                newsId: recommendNewsIds
            }
            NewsService.getNewsByTopicExcept(request).then(
                response => {
                    if(response.data.data) {
                        console.log("data after delete recommend news")
                        setData(response.data.data)
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        } else {
            // NewsService.getNewsByParentTopic(topicKey, 5, 0).then(
            NewsService.getNewsByTopicKey(topicKey, 5, 0).then(
                response => {
                    if (response.data.data) {
                        console.log("topic " + topicKey)
                        console.log(recommendNewsIds)
                        if (recommendNewsIds != null && recommendNewsIds.length > 0) {
                            // if(recommendNews != null && recommendNews.length > 0) {
                            console.log("we have recommend news ", recommendNewsIds)
                            // console.log("we have recommend news ", recommendNews)
                            // console.log("our original data ", response.data.data.content)
                            console.log(response.data.data)
                            console.log(response.data.data.content)
                            if (response.data.data.content != null && response.data.data.content.length > 0) {
                                console.log("start process data")
                                let dataToDisplay = []
                                response.data.data.content.map((news) => {
                                    if (!recommendNewsIds.includes(news.id)) {
                                        dataToDisplay.push(news)
                                    }
                                    // if(!recommendNews.includes(news)) {
                                    //     return news
                                    // }
                                })

                                // setData(response.data.data.content)
                                console.log("generate data to display ", dataToDisplay)
                                setData(dataToDisplay)
                            } else {
                                setData(response.data.data.content)
                            }
                        } else {
                            setData(response.data.data.content)
                        }
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        }
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px", marginBottom: "12px"
        }}>
            <Divider orientation="left" style={{
                fontFamily: "Merriweather",
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e90ff"
            }}>
                <a
                    class='topic-name-hp'
                    // style={{
                    //     fontSize: '1.5vw !important'
                    // }}
                    href={'/topic/' + topicKey}
                >
                    {topicName}
                </a>
            </Divider>

            {/*<div style={{display: 'flex'}}>*/}
            {/*    <div style={{flex: 1}}>*/}
            {/*        <List*/}
            {/*            itemLayout="vertical"*/}
            {/*            size="large"*/}
            {/*            dataSource={data}*/}
            {/*            renderItem={(item) => (*/}
            {/*                <List.Item*/}
            {/*                    key={item.title}*/}
            {/*                    extra={*/}
            {/*                        <img*/}
            {/*                            width={360}*/}
            {/*                            alt="logo"*/}
            {/*                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"*/}
            {/*                        />*/}
            {/*                    }*/}
            {/*                >*/}
            {/*                    <List.Item.Meta*/}
            {/*                        title={<a href={item.href}>{item.title}</a>}*/}
            {/*                        description={item.description}*/}
            {/*                    />*/}
            {/*                    {item.content}*/}
            {/*                </List.Item>*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div style={{flex: 1, marginTop: '15px'}}>*/}
            {/*        <NewsList data={data}></NewsList>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <NewsList data={data} isPagination={false}></NewsList>
            {
                data ?
                    (data.length > 0 ?<a href={'/topic/' + topicKey} style={{marginLeft: "auto"}}>Xem tất cả</a>: null)
                    : null
            }
        </div>
    )
}
const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    console.log(state.recommend)
    return {
        recommendNewsIds: state.recommend.recommendIds,
        isRecommending: state.recommend.isRecommending,
        test: state.recommend.recommendIds
    }
}
export default connect(mapStateToProps, null)(TopicHomepage);