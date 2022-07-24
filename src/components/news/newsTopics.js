import React, {useEffect, useState} from 'react';
import {Divider, List, Menu} from "antd";
import {NewsShortcut} from "./newsShortcut";
import NewsList from "./newsList";
import {connect} from "react-redux";
import {Link, Outlet, useParams, useSearchParams} from "react-router-dom";
import TopicService from "../../service/topic.service";
import NewsService from "../../service/news.service";

export function NewsTopics(props) {
    const {setPagination, page} = props
    let params = useParams();
    const [topic, setTopic] = useState({});
    const [topicChildren, setTopicChildren] = useState([]);
    const [topicParent, setTopicParent] = useState();
    const [topicLv3, setTopicLv3] = useState([])
    const [selectedTopicKey, setSelectedTopicKey] = useState();
    const [selectedTopicKeyLv3, setSelectedTopicKeyLv3] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [data, setData] = useState([]);
    const [searchParams] = useSearchParams()
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

    const renderTopicName = () => {
        if (topic.parentKey !== null) {
            let topicName = ''
            TopicService.getTopicByKey(topic.parentKey).then(
                response => {
                    if (response.data.data) {
                        topicName = response.data.data.name;
                    }
                }
            )
            return topicName
        } else {
            return topic.name
        }
    }
    const renderTopicLink = (topicKey) => {
        if (topicParent) {
            console.log(topicParent)
            return '/topic/' + topicParent.topicKey
        }
        return '/topic/' + topicKey
    }
    const mapChildrenResponseToDataList = (childrenResponse) => {
        return childrenResponse.map((children) => {
            const childHref = "/topic/" + children.key
            return {
                key: children.key,
                label: <a href={childHref}>{children.label}</a>,
            }
        })
    }
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        console.log(searchParams.get('page'))
        const page = searchParams.get('page')
        console.log(params.topicKey)
        const paramsSplit = params.topicKey.split(/[/?=\s]/);
        console.log(paramsSplit);
        console.log(paramsSplit[0]);
        // console.log(paramsSplit[2]);
        // setCurrentPage(parseInt(paramsSplit[2]));
        if (page) {
            setCurrentPage(parseInt(page))
        }
        const pageToCallApi = page ? parseInt(page) - 1 : 0

        TopicService.getTopicByKey(paramsSplit).then(
            response => {
                console.log(response);
                if (response.data.data) {
                    setTopic(response.data.data);
                    if (response.data.data.parentKey === null) {
                        TopicService.getTopicByParentKey(response.data.data.topicKey).then(
                            responseChildren => {
                                console.log(responseChildren)
                                setTopicChildren(responseChildren.data.data);
                            }
                        );
                        // NewsService.getNewsByParentTopic(response.data.data.topicKey, 15, pageToCallApi).then(
                        if(currentUser) {
                            NewsService.getNewsByTopicKeyByUser(response.data.data.topicKey, 15, pageToCallApi, currentUser.id).then(
                                newsResponse => {
                                    console.log(newsResponse)
                                    if (newsResponse.data.data) {
                                        setData(newsResponse.data.data.content)
                                        console.log(newsResponse.data.data.totalElements)
                                        // setCurrentPage(4);
                                        setTotal(newsResponse.data.data.totalElements)
                                        // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                        //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                        // }
                                    }
                                }
                            )
                        } else {
                            if(currentUser) {
                                NewsService.getNewsByTopicKeyByUser(response.data.data.topicKey, 15, pageToCallApi, currentUser.id).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            setData(newsResponse.data.data.content)
                                            console.log(newsResponse.data.data.totalElements)
                                            // setCurrentPage(4);
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            } else {
                                NewsService.getNewsByTopicKey(response.data.data.topicKey, 15, pageToCallApi).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            setData(newsResponse.data.data.content)
                                            console.log(newsResponse.data.data.totalElements)
                                            // setCurrentPage(4);
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            }
                        }
                    }
                    if (response.data.data.parentKey !== null) {
                        // debugger
                        if (response.data.data.level == 2) {
                            TopicService.getTopicByKey(response.data.data.parentKey).then(
                                parentResponse => {
                                    setTopicParent(parentResponse.data.data);
                                }
                            );
                            TopicService.getTopicByParentKey(response.data.data.parentKey).then(
                                childrenResponse => {
                                    setTopicChildren(childrenResponse.data.data)
                                }
                            );
                            TopicService.getTopicByParentKey(response.data.data.topicKey).then(
                                response => {
                                    if (response.data.data != null && response.data.data.length > 0) {
                                        setTopicLv3(response.data.data)
                                    }
                                }
                            ).catch(error => {
                                console.log(error)
                            })
                            if(currentUser) {
                                NewsService.getNewsByTopicKeyByUser(response.data.data.topicKey, 15, pageToCallApi, currentUser.id).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            console.log(newsResponse.data.data.totalElements)
                                            setData(newsResponse.data.data.content)
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            } else {
                                NewsService.getNewsByTopicKey(response.data.data.topicKey, 15, pageToCallApi).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            console.log(newsResponse.data.data.totalElements)
                                            setData(newsResponse.data.data.content)
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            }
                        } else {
                            TopicService.getTopicLv1(response.data.data.topicKey).then(
                                topicLv1Response => {
                                    console.log("topicLv1 " + topicLv1Response.data)
                                    setTopicParent(topicLv1Response.data.data)
                                    TopicService.getTopicByParentKey(topicLv1Response.data.data.topicKey).then(
                                        topicLv2Response => {
                                            console.log("topicLv2 " + topicLv1Response.data.data )
                                            setTopicChildren(topicLv2Response.data.data)
                                            // TopicService.getTopicByParentKey(topicLv2Response.data.data.key).then(
                                            //     topicLv3Response => {
                                            //         console.log("topicLv3 " + topicLv1Response.data.data )
                                            //         setTopicLv3(topicLv3Response.data.data)
                                            //     }
                                            // )
                                        }
                                    )
                                }
                            ).catch(error => {console.log(error)})
                            TopicService.getTopicByParentKey(response.data.data.parentKey).then(
                                topicLv3Response => {
                                    setTopicLv3(topicLv3Response.data.data)
                                }
                            )
                            if(currentUser) {
                                NewsService.getNewsByTopicKeyByUser(response.data.data.topicKey, 15, pageToCallApi, currentUser.id).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            console.log(newsResponse.data.data.totalElements)
                                            setData(newsResponse.data.data.content)
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            } else {
                                NewsService.getNewsByTopicKey(response.data.data.topicKey, 15, pageToCallApi).then(
                                    newsResponse => {
                                        console.log(newsResponse)
                                        if (newsResponse.data.data) {
                                            console.log(newsResponse.data.data.totalElements)
                                            setData(newsResponse.data.data.content)
                                            setTotal(newsResponse.data.data.totalElements)
                                            // if(newsResponse.data.data.totalElements && paramsSplit[2]) {
                                            //     setPagination(paramsSplit[2], newsResponse.data.data.totalElements)
                                            // }
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        );
        const location = window.location.pathname.substring(1);
        console.log(location);
        const result = location.split(/[/\s]/);
        console.log(result[1]);
        TopicService.getTopicByKey(result[1]).then(
            response => {
                console.log("process selected topic key " + response.data)
                if(response.data.data && response.data.data.level == 3) {
                    // console.log("")
                    setSelectedTopicKey(response.data.data.parentKey)
                    setSelectedTopicKeyLv3(result[1])
                } else {
                    setSelectedTopicKey(result[1])
                }
            }
        )

    }, [])
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: '10px'
        }}>
            <div>
                <a href={renderTopicLink(selectedTopicKey)}>
                    <h1 style={{
                        marginTop: '15px',
                        marginLeft: '20px',
                        color: '#1e90ff'
                    }}>
                        {
                            topicParent ? topicParent.name : topic.name
                        }
                    </h1>
                </a>
            </div>
            <div>

                <Menu
                    mode="horizontal"
                    // defaultSelectedKeys={[selectedTopicKey]}
                    selectedKeys={[selectedTopicKey]}
                    // items={new Array(5).fill(null).map((_, index) => ({
                    //     key: String(index + 1),
                    //     label: `Chủ đề ${index + 1}`,
                    // }))}
                    items={mapChildrenResponseToDataList(topicChildren)}
                    style={{
                        fontWeight: '600'
                        // , color: '#4f4f4f'
                        , height: '100%'
                    }}
                />
            </div>
            <div>
                {
                    topicLv3.length > 0 ?
                        <Menu
                            mode="horizontal"
                            // defaultSelectedKeys={[selectedTopicKey]}
                            selectedKeys={[selectedTopicKeyLv3]}
                            // items={new Array(5).fill(null).map((_, index) => ({
                            //     key: String(index + 1),
                            //     label: `Chủ đề ${index + 1}`,
                            // }))}
                            items={mapChildrenResponseToDataList(topicLv3)}
                            style={{
                                fontWeight: '400'
                                // , color: '#4f4f4f'
                                , height: '100%'
                            }}
                        />
                        : null
                }
            </div>
            <div style={{margin: '10px'}}>
                <NewsList data={data} currentPage={currentPage} total={total} topicKey={topic}
                          isPagination={true}></NewsList>
                {/*<div>*/}
                {/*    <List*/}
                {/*        grid={{*/}
                {/*            gutter: 16,*/}
                {/*            xs: 1,*/}
                {/*            sm: 1,*/}
                {/*            md: 2,*/}
                {/*            lg: 2,*/}
                {/*            xl: 3,*/}
                {/*            xxl: 3,*/}
                {/*        }}*/}
                {/*        dataSource={data}*/}
                {/*        renderItem={(item) => (*/}
                {/*            <List.Item>*/}
                {/*                /!*<Card title={item.title}>Card content</Card>*!/*/}
                {/*                <NewsShortcut  title={item.title} content={item.summary} imageUrl={item.imageUrl}></NewsShortcut>*/}
                {/*            </List.Item>*/}
                {/*        )}*/}
                {/*        pagination={{*/}
                {/*            position: "bottom",*/}
                {/*            pageSize: 12,*/}
                {/*            total: total,*/}
                {/*            // total: 50,*/}
                {/*            current: currentPage*/}
                {/*            // current: 1*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
            {/*<Outlet/>*/}
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(state.pagination)
    // console.log(state.object.userName)
    // console.log(state)
    return {
        page: state.pagination.page,
        // total: state.pagination.total
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPagination: (p, t) => dispatch({type: "GET_DATA_SUCCESS", page: p, total: t})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsTopics);
// export default connect()(NewsTopics)