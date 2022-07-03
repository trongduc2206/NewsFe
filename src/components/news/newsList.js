import {Card, List, Modal, Pagination} from "antd";
import NewsShortcut from "./newsShortcut";
import {connect} from "react-redux";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";



export function NewsList(props) {
    const {data, currentPage, total, topicKey, isPagination} = props;
    const [page, setPage] = useState(null)
    // const {push, location: {search}} = {History}
    // const queryParams = useMemo(() => QueryString.parse(search.slice(1)), [search]);
    // const pushQueryParamsToUrl = useCallback((params) => {
    //     push({
    //         search: `?${QueryString.stringify(params)}`
    //     });
    // }, [push]);

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
    // const { confirm } = Modal;
    // const onDeleteNews = () => {
    //     confirm({
    //         title: 'Bạn có chắc muốn xóa bài báo này khỏi danh sách lưu?',
    //         icon: <ExclamationCircleOutlined />,
    //         // content: 'Some descriptions',
    //
    //         onOk() {
    //             console.log('OK');
    //             const request = {
    //
    //             }
    //             NewsService.softDeleteSavedNews()
    //         },
    //
    //         onCancel() {
    //             // console.log('Cancel');
    //         },
    //     });
    // }

    useEffect(() => {
        // const location = window.location.pathname.substring(1);
        // console.log(location);
        // const result = location.split(/[=&\s]/);
        // console.log(result);
        // setPage(result[3]);
        console.log(data)
        // console.log()
        // console.log(total)
        console.log(page)
    },[])
    const getCurrentPage = () => {
        const location = window.location.pathname.substring(1);
        console.log("at getCurrent",location);
        const result = location.split(/[=&\s]/);
        console.log(result);
        return result[3]
    }
    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()

    const onChangePageHandle = (page) => {
        console.log(page)
        const path = window.location.pathname
        console.log(window.location.search)
        if(window.location.search !== null) {
            let newUrl = ''
            if(searchParams.get('page') === null) {
                 // newUrl = window.location.href + "&page=" + page
                searchParams.append('page', page)
                setSearchParams(searchParams)
                window.location.reload()
                // window.location.href = newUrl
            } else {
                console.log(searchParams)
                searchParams.set('page', page)
                setSearchParams(searchParams)
                window.location.reload()
            }
        } else {
            setSearchParams(searchParams.append('page', page))
            // const newUrl = window.location.href + "?page=" + page
            // window.location.href = newUrl
        }
        // navigate(path + "?page=" + page)
        // window.location.reload();
        // navigate("/")
        // console.log(topicKey)
    }
    return (
        <div>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 3,
                    xl: 5,
                    xxl: 3,
                }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        {/*<Card title={item.title}>Card content</Card>*/}
                        {/*<NewsShortcut  title={item.title} content={item.summary} imageUrl={item.imageUrl} ></NewsShortcut>*/}
                        <NewsShortcut data={item} ></NewsShortcut>
                    </List.Item>
                )}
                pagination={isPagination?{
                    position: "bottom",
                    pageSize: 15,
                    // total: {total},
                    defaultCurrent: 1,
                    total: total,
                    current: currentPage?currentPage:1,
                    onChange: onChangePageHandle,
                    showSizeChanger: false
                    // current: 1
                }:isPagination}
            />
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
        // setPagination: (p, t) => dispatch({type: "GET_DATA_SUCCESS", page: p, total: t})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsList);