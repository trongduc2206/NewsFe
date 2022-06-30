import {Divider, List} from "antd";
import React, {useEffect} from "react";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import NewsService from "../../service/news.service";
import parse from "html-react-parser";
import '../css/newsSearchResult.css'
import {NewsList} from "./newsList";
import Search from "antd/es/input/Search";

export function NewsSearchResult(props) {
    const [data, setData] = useState([])

    const [searchParams] = useSearchParams()
    const [query, setQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    let navigate = useNavigate();

    const onChangePageHandle = (page) => {
        console.log(page)
        const path = window.location.pathname
        navigate(path + "?q=" + searchParams.get('q') + "&page=" + page)
        window.location.reload();
        // navigate("/")
        // console.log(topicKey)
    }

    const onListItemClick = () => {
        console.log("clicked")
    }

    const renderThumbnailText = (text) => {
        // console.log(text.match(/<p>.*?<\/p>/g))
        const result = text.match(/<p>.*?<\/p>/g)
        return result[0] + result[1]
    }

    const renderListItemHref = (item) => {
        return "/news/" + item.id
    }

    const onSearch = (values) => {
        console.log(values)
        const searchPageUrl = '/search?q=' + values
        window.location.href = searchPageUrl
    }
    useEffect(() => {
        console.log(searchParams.get('q'))
        setQuery(searchParams.get('q'))
        console.log(searchParams.get('page'))
        const page = searchParams.get('page')
        if (page) {
            setCurrentPage(parseInt(page))
        }

        const pageToCallApi = page ? parseInt(page) - 1 : 0

        NewsService.search(searchParams.get('q'), 12, pageToCallApi).then(
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

    }, [])
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '15px',
            // display: "flex"
        }}>
            {/*<div style={{*/}
            {/*    flex: 1,*/}
            {/*    padding: "15px"*/}
            {/*}}>*/}
            {/*    <div style={{*/}
            {/*        position: 'sticky',*/}
            {/*        top: 100,*/}
            {/*        marginBottom: "85vh",*/}
            {/*    }}>*/}
            {/*        <h1>Tìm thấy {total} kết quả </h1>*/}
            {/*    </div>*/}

            {/*</div>*/}
            {/*<div style={{flex: 3}}>*/}
                <Divider orientation="left" style={{
                    fontFamily: "Merriweather",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e90ff"
                }}>Kết quả</Divider>
            <h1>Tìm thấy {total} kết quả cho tìm kiếm</h1>
            <Search defaultValue={searchParams.get('q')} style={{width: 200, marginTop: "5px", marginBottom: "15px"}} onSearch={onSearch}/>
            <Divider></Divider>
            <NewsList data={data} currentPage={currentPage} total={total} isPagination={true}></NewsList>
            {/*<div style={{flex: 3}}>*/}
            {/*    <Divider orientation="left" style={{*/}
            {/*        fontFamily: "Merriweather",*/}
            {/*        fontSize: "24px",*/}
            {/*        fontWeight: "700",*/}
            {/*        color: "#1e90ff"*/}
            {/*    }}>Kết quả tìm kiếm</Divider>*/}
            {/*    <List*/}
            {/*        itemLayout="vertical"*/}
            {/*        size="small"*/}
            {/*        pagination={{*/}
            {/*            position: "bottom",*/}
            {/*            pageSize: 12,*/}
            {/*            defaultCurrent: 1,*/}
            {/*            total: total,*/}
            {/*            current: currentPage ? currentPage : 1,*/}
            {/*            onChange: onChangePageHandle,*/}
            {/*        }}*/}
            {/*        dataSource={data}*/}
            {/*        renderItem={(item) => (*/}
            {/*            <a href={'/news/' + item.id}>*/}
            {/*                <List.Item*/}
            {/*                    onClick={onListItemClick}*/}
            {/*                    key={item.title}*/}
            {/*                    extra={*/}

            {/*                        <img*/}
            {/*                            style={{*/}
            {/*                                width: '100%',*/}
            {/*                                maxWidth: 400,*/}
            {/*                                height: "auto"*/}
            {/*                            }}*/}
            {/*                            alt="logo"*/}
            {/*                            // src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"*/}
            {/*                            src={item ? item.imageUrl : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}*/}
            {/*                        />*/}

            {/*                    }*/}
            {/*                >*/}
            {/*                    <List.Item.Meta*/}
            {/*                        title={item.title}*/}
            {/*                        style={{fontSize: '50px'}}*/}
            {/*                    />*/}
            {/*                    {parse(item ? renderThumbnailText(item.content) : '<p>Nội dung</p>')}*/}
            {/*                </List.Item>*/}
            {/*            </a>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    )
}