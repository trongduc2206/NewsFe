import {Breadcrumb, Button, Divider, Form, Input, Layout, Menu, Modal, Popover, Space} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import './layout.css';
import Search from "antd/es/input/Search";
import {connect} from 'react-redux';
import {
    BellOutlined, ExclamationCircleOutlined,
    FacebookFilled,
    FacebookOutlined,
    GoogleOutlined,
    HomeOutlined,
    InstagramFilled, StarTwoTone,
    UserOutlined
} from "@ant-design/icons";
import {BrowserRouter, Route, Switch, Routes, useNavigate, Outlet, useParams, useLocation} from "react-router-dom";
import HomePage from "../homePage/homePage";
import NewsDetail from "../news/newsDetail";
import NewsTopics from "../news/newsTopics";
import TopicService from "../../service/topic.service";
import {NewsSearchResult} from "../news/newsSearchResult";
import SavedNews from "../news/savedNews";
import ScrollToTop from "./MainContentContainer";
import {useForm} from "antd/es/form/Form";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
// import { GoogleLogin } from 'react-google-login';
import UserService from "../../service/user.service";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import {useGoogleLogin} from "react-google-login";

export function MainLayout(props) {
    const {login, isLogin, username, signup, isSignupSuccess, resetSignupStatus, logout} = props
    const [today, setToday] = useState("")
    const [visibleLogin, setVisibleLogin] = useState(false);
    const [visibleSignup, setVisibleSignup] = useState(false);
    const [logined, setLogined] = useState(false);
    const [topicList, setTopicList] = useState([]);
    const [currentTopicKey, setCurrentTopicKey] = useState([]);
    let params = useParams();
    const [form] = useForm()

    const responseFacebook = (response) => {
        console.log(response)
        const userInfo = {
            thirdPartyId: response.id,
            username: response.name,
            email: response.email,
            accessToken: response.accessToken,
            type: 'FACEBOOK'
        }
        UserService.signup({
            thirdPartyId: userInfo.thirdPartyId,
            type: 'FACEBOOK',
            username: userInfo.username,
            email: userInfo.email
        }).then(
            response => {
                const returnId = response.data.data;
                if (returnId) {
                    userInfo.id = returnId
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    window.location.reload();
                }
            }
        )
        // localStorage.setItem("user", JSON.stringify(userInfo));
        // window.location.reload();
    }

    const responseGoogle = (response) => {
        console.log(response);
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });

    const componentClicked = (data) => {
        console.log(data)
    }
    const onMenuClick = (e) => {
        debugger
        if (currentUser) {
            const request = {
                "userId": currentUser.id,
                "topicKey": e.key
            }
            TopicService.saveTopicClick(request).then(
                response => {
                    console.log("saved topic click")
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        }
    }
    const {confirm} = Modal;

    const onLogout = () => {
        confirm({
            title: "Bạn có chắc muốn đăng xuất",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                localStorage.removeItem("user");
                window.location.reload();
            },
            onCancel() {
                // console.log('Cancel');
            }
        })
        // localStorage.removeItem("user");
        // window.location.reload();
        // logout();
    }
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const processTopicDataToDisplay = () => {

    }
    // let today;
    useEffect(() => {
        // console.log("menuItems", me nuItems);
        // console.log(window.location.pathname);
        const location = window.location.pathname.substring(1);
        console.log(location);
        const result = location.split(/[/\s]/);
        console.log(result[1]);
        setCurrentTopicKey(result[1]);
        const date = new Date();
        // console.log(date);
        processCurrentDate(date);
        // console.log(today);
        if (isSignupSuccess) {
            setVisibleLogin(true);
            setVisibleSignup(false);
            resetSignupStatus();
        }
        if (currentUser) {
            TopicService.getTopicDisplayUser(currentUser.id).then(
                response => {
                    const topicListResponse = response.data.data;
                    const topicListResponseConverted = topicListResponse.map((topic) => {
                        // console.log(topic)
                        const href = "/topic/" + topic.key
                        // console.log(href);
                        return {
                            icon: topic.recommended ? <StarTwoTone/> : null,
                            label: <a href={href}>{topic.label}</a>,
                            // label: topic.key,
                            key: topic.key,
                            children: topic.children ? topic.children.map((child) => {
                                // const childHref = href + "/" + child.key
                                const childHref = "/topic/" + child.key
                                if (child.children.length > 0) {
                                    return {
                                        type: 'submenu',
                                        label: <a href={childHref}>{child.label}</a>,
                                        key: child.key,
                                        children: child.children ? child.children.map((subChild) => {
                                            const childHref = "/topic/" + subChild.key
                                            return {
                                                label: <a href={childHref}>{subChild.label}</a>,
                                                key: subChild.key
                                            }
                                        }) : null,
                                        onTitleClick: (e) => {
                                            // debugger
                                            const currentUser = JSON.parse(localStorage.getItem('user'));
                                            // debugger
                                            if (currentUser && e.key !== 'home') {
                                                const request = {
                                                    "userId": currentUser.id,
                                                    "topicKey": e.key
                                                }
                                                TopicService.saveTopicClick(request).then(
                                                    response => {
                                                        console.log("saved topic click")
                                                    }
                                                ).catch(
                                                    error => {
                                                        console.log(error)
                                                    }
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    return {
                                        label: <a href={childHref}>{child.label}</a>,
                                        key: child.key
                                    }
                                }
                            }) : null
                        }
                    })
                    const topicAllToDisplay = topicListResponseConverted.map((topic) => {
                        return {
                            type: 'group',
                            label: topic.label,
                            // label: topic.key,
                            key: topic.key,
                            children: topic.children
                        }
                    })
                    // topicListResponseConverted.unshift(
                    //     {
                    //         key: 'all',
                    //         label: 'Tất cả',
                    //         children: topicAllToDisplay
                    //     }
                    // )
                    topicListResponseConverted.unshift({
                        icon: <HomeOutlined/>,
                        key: 'home',
                        label:
                            <a href='/'>
                                Trang chủ
                            </a>
                    })
                    // topicListResponseConverted.push(
                    //     {
                    //         key: 'all',
                    //         label: 'Tất cả',
                    //         children: topicAllToDisplay
                    //     }
                    // )

                    // console.log(topicListResponseConverted);
                    setTopicList(topicListResponseConverted);
                }
            )
        } else {
            TopicService.getTopicDisplay().then(
                response => {
                    // console.log(response.data.data);
                    setTopicList(response.data.data);
                    const topicListResponse = response.data.data;
                    const topicListResponseConverted = topicListResponse.map((topic) => {
                        // console.log(topic)
                        const href = "/topic/" + topic.key
                        // console.log(href);
                        return {
                            label: <a href={href}>{topic.label}</a>,
                            // label: topic.key,
                            key: topic.key,
                            children: topic.children ? topic.children.map((child) => {
                                // const childHref = href + "/" + child.key
                                const childHref = "/topic/" + child.key
                                if (child.children.length > 0) {
                                    return {
                                        type: 'submenu',
                                        label: <a href={childHref}>{child.label}</a>,
                                        key: child.key,
                                        children: child.children ? child.children.map((subChild) => {
                                            const childHref = "/topic/" + subChild.key
                                            return {
                                                label: <a href={childHref}>{subChild.label}</a>,
                                                key: subChild.key
                                            }
                                        }) : null,
                                        onTitleClick: (e) => {
                                            // debugger
                                            const currentUser = JSON.parse(localStorage.getItem('user'));
                                            // debugger
                                            if (currentUser && e.key !== 'home') {
                                                const request = {
                                                    "userId": currentUser.id,
                                                    "topicKey": e.key
                                                }
                                                TopicService.saveTopicClick(request).then(
                                                    response => {
                                                        console.log("saved topic click")
                                                    }
                                                ).catch(
                                                    error => {
                                                        console.log(error)
                                                    }
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    return {
                                        label: <a href={childHref}>{child.label}</a>,
                                        key: child.key
                                    }
                                }
                            }) : null
                        }
                    })
                    const topicAllToDisplay = topicListResponseConverted.map((topic) => {
                        return {
                            type: 'submenu',
                            label: topic.label,
                            // label: topic.key,
                            key: topic.key,
                            children: topic.children
                        }
                    })

                    // topicListResponseConverted.unshift(
                    //     {
                    //         key: 'all',
                    //         label: 'Tất cả',
                    //         children: topicAllToDisplay
                    //     }
                    // )
                    topicListResponseConverted.unshift({
                        icon: <HomeOutlined/>,
                        key: 'home',
                        label:
                            <a href='/'>
                                Trang chủ
                            </a>
                    })
                    // topicListResponseConverted.push(
                    //     {
                    //         key: 'all',
                    //         label: 'Tất cả',
                    //         children: topicAllToDisplay
                    //     }
                    // )
                    // console.log(topicListResponseConverted);
                    setTopicList(topicListResponseConverted);
                }
            );
        }
        // setTopicList()
        console.log(params.topicKey)

        window.scrollTo(0, 0);

        // window.fbAsyncInit = function() {
        //     let FB;
        //     FB.init({
        //         appId: '571704337888304',
        //         cookie: true,  // enable cookies to allow the server to access
        //         // the session
        //         xfbml: true,  // parse social plugins on this page
        //         version: 'v2.1' // use version 2.1
        //     })
        //
        //     (function(d, s, id){
        //         var js, fjs = d.getElementsByTagName(s)[0];
        //         if (d.getElementById(id)) {return;}
        //         js = d.createElement(s); js.id = id;
        //         js.src = "https://connect.facebook.net/en_US/sdk.js";
        //         fjs.parentNode.insertBefore(js, fjs);
        //     }(document, 'script', 'facebook-jssdk'));
        // }
    }, [isSignupSuccess])

    const processCurrentDate = (date) => {
        let dayInWeek
        // console.log(date);
        // console.log(date.getDay());
        switch (date.getDay()) {
            case 0:
                dayInWeek = "Chủ nhật";
                break;
            case 1:
                dayInWeek = "Thứ hai";
                break;
            case 2:
                dayInWeek = "Thứ ba";
                break;
            case 3:
                dayInWeek = "Thứ tư";
                break;
            case 4:
                dayInWeek = "Thứ năm";
                break;
            case 5:
                dayInWeek = "Thứ sáu";
                break;
            case 6:
                dayInWeek = "Thứ bảy";
        }

        const current = `${dayInWeek}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        setToday(current)
    }

    const onLoginHandler = () => {
        setVisibleLogin(true);
    }
    const handleLoginModalCancel = () => {
        setVisibleLogin(false);
    }

    const onSignUpAppear = () => {
        setVisibleLogin(false);
        setVisibleSignup(true);
    }

    const onLoginAppear = () => {
        setVisibleSignup(false);
        setVisibleLogin(true);
    }

    const handleSignupModalCancel = () => {
        setVisibleSignup(false);
    }
    const onLoginFormFinish = (values) => {
        // console.log('Login success:', values);
        login(values.username, values.password);
    };

    const onLoginFormFinishFailed = (errorInfo) => {
        // console.log('Login failed:', errorInfo);
    };

    const onSignupFormFinish = (values) => {
        // console.log('Sign up success: ', values);
        signup(values.username, values.password, values.email);
    }

    const onSignupFormFinishFailed = (values) => {
        // console.log('Sign up failed: ', values);
    }

    // let navigate = useNavigate()
    const onSearch = (values) => {
        console.log(values)
        const searchPageUrl = '/search?q=' + values
        window.location.href = searchPageUrl
    }

    return (
        <BrowserRouter>
            <GoogleOAuthProvider clientId="2270790339-n2niqsp2h15felguam5h3nnrpbsvqiin.apps.googleusercontent.com">
                <Layout
                    style={{
                        // height:"100vh"
                    }}
                >
                    <Header
                        style={{
                            position: 'fixed',
                            zIndex: 1,
                            width: '100%',
                            background: "white",
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 0
                        }}
                    >

                        <div style={{
                            display: 'flex',
                            height: '45px'
                        }}>
                            <div className="logo"/>
                            <Divider type="vertical" style={{marginTop: "8px", height: "80%"}}/>
                            {/*<div className='time-now' style={{marginTop: '24px', lineHeight: "0"}}>*/}
                            {/*    <span>{today}</span>*/}
                            {/*</div>*/}
                            <div style={{
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '14px',
                                color: '#757575', width: '100%'
                            }}>
                                <span>{today}</span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    marginRight: "60px"
                                }}>
                                <Space style={{marginRight: "15px"}}>
                                    <Search placeholder="Tìm kiếm" allowClear style={{width: 200, marginTop: "17px"}}
                                            onSearch={onSearch}/>
                                    {currentUser ? null
                                        : <a style={{color: "#000000"}}> <UserOutlined className="icon" style={{
                                            marginLeft: "10px",
                                            marginRight: "8px"
                                        }}/> </a>
                                    }

                                    {currentUser ?
                                        <Popover
                                            // style={{
                                            //     position: 'fixed !important',
                                            //     color: 'blue'
                                            // }}
                                            placement='bottom'
                                            content={
                                                <div
                                                >
                                                    <a href="#">
                                                        <p>Thông tin tài khoản</p>
                                                    </a>
                                                    <Divider style={{marginTop: "7px", marginBottom: "7px"}}></Divider>
                                                    <a href={'/save/' + currentUser.id}>
                                                        <p>Tin đã lưu</p>
                                                    </a>
                                                    <Divider style={{marginTop: "7px", marginBottom: "7px"}}></Divider>
                                                    <a href="#" onClick={onLogout}>
                                                        <p>Đăng xuất</p>
                                                    </a>
                                                </div>
                                            }
                                            overlayStyle={{
                                                position: 'fixed'
                                            }}
                                            title={currentUser.username} trigger="click">
                                            <a href="#">{currentUser.username}</a>
                                        </Popover>
                                        : <a href="#" onClick={onLoginHandler}>Đăng nhập</a>}

                                    {currentUser ?
                                        <BellOutlined/>
                                        : null
                                    }
                                </Space>
                            </div>
                        </div>

                        <div style={{
                            // width: '100%',
                            lineHeight: '40px',
                            borderTopStyle: 'ridge',
                            borderTopWidth: 'thin',
                            // display: 'flex',
                            backgroundColor: 'white',
                            // display: 'flex'
                            flex: 4
                        }}>
                            <div
                                // style={{flex: 4}}
                            >
                                <Menu
                                    mode="horizontal"
                                    // mode="inline"
                                    // defaultSelectedKeys={['2']}
                                    // items={menuItems}
                                    selectedKeys={[currentTopicKey]}
                                    items={topicList}
                                    style={{fontWeight: '600', color: '#4f4f4f', height: '100%', width: '100%'}}
                                    // onClick={onMenuClick}
                                    onClick={(e) => {
                                        const currentUser = JSON.parse(localStorage.getItem('user'));
                                        // debugger
                                        if (currentUser && e.key !== 'home') {
                                            const request = {
                                                "userId": currentUser.id,
                                                "topicKey": e.key
                                            }
                                            TopicService.saveTopicClick(request).then(
                                                response => {
                                                    console.log("saved topic click")
                                                }
                                            ).catch(
                                                error => {
                                                    console.log(error)
                                                }
                                            )
                                        }
                                    }}
                                    // onSelect={(e) => {console.log(e)}}
                                />
                            </div>
                            {/*<div style={{*/}
                            {/*    // marginRight: '15px',*/}
                            {/*    flex: 4*/}
                            {/*}}>*/}
                            {/*<Menu*/}
                            {/*    items={[{*/}
                            {/*        key: 'all',*/}
                            {/*        label: 'Tất cả tất cả '*/}
                            {/*    }]}*/}
                            {/*/>*/}
                            {/*</div>*/}
                        </div>
                    </Header>


                    <Content
                        className="site-layout"
                        style={{
                            padding: '0 50px',
                            marginTop: 100,
                            // backgroundColor: "white"
                        }}
                    >
                        <ScrollToTop>
                            <Routes>
                                <Route path='/' element={<HomePage/>}/>
                                {/*<Route path='/' element={<NewsList/>}/>*/}
                                <Route path='/news/:id' element={<NewsDetail/>}/>
                                {/*<Route path='topic' element={<NewsTopics/>}>*/}
                                {/*    <Route path=':topicKey' element={<NewsTopic/>}/>*/}
                                {/*</Route>*/}
                                <Route path='/topic/:topicKey' element={<NewsTopics/>}/>
                                <Route path='/search' element={<NewsSearchResult/>}/>
                                <Route path='/save/:userId' element={<SavedNews/>}/>
                            </Routes>
                        </ScrollToTop>
                        <Outlet/>
                    </Content>

                    <Footer
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <div>
                            <Divider style={{width: "100%"}}>Báo điện tử</Divider>
                        </div>
                        <div style={{display: "flex"}}>
                            <div>
                                Báo điện tử
                            </div>
                            <div style={{marginLeft: "auto"}}>
                                <Space>
                                    <span style={{color: "#757575"}}> Theo dõi trên </span>
                                    <a style={{color: "#757575"}}> <FacebookFilled/> </a>
                                    <a style={{color: "#757575"}}> <InstagramFilled/> </a>
                                </Space>
                            </div>
                        </div>
                        <div>

                        </div>
                    </Footer>
                </Layout>
                <div>
                    {/*<LoginModal visible={visibleLogin}></LoginModal>*/}
                    <Modal
                        title="Đăng nhập"
                        visible={visibleLogin}
                        onCancel={handleLoginModalCancel}
                        footer={[
                            <a style={{color: "#000000"}} onClick={onSignUpAppear}>Chưa có tài khoản ?</a>
                        ]}
                    >
                        <div style={{display: "flex", justifyContent: "space-around"}}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <p style={{alignContent: "center"}}>Đăng nhập với tài khoản</p>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    name="form_in_modal"
                                    onFinish={onLoginFormFinish}
                                    onFinishFailed={onLoginFormFinishFailed}
                                >
                                    <Form.Item
                                        name="username"
                                        label="Tên đăng nhập"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Tên đăng nhập không được đẻ trống!',
                                            },
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mật khẩu không được đẻ trống!',
                                            },
                                        ]}
                                    >
                                        <Input.Password/>
                                    </Form.Item>
                                    <Form.Item
                                    >
                                        <Button type="primary" htmlType="submit">
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div>
                                <Divider type="vertical" style={{height: "95%"}}></Divider>
                            </div>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <p>Đăng nhập với</p>
                                <div
                                    style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div style={{display: "flex", marginTop: "10px"}}>
                                        {/*<FacebookOutlined style={{fontSize: "32px", marginRight: "5px"}}></FacebookOutlined>*/}
                                        {/*<Button>*/}
                                        {/*    Facebook*/}
                                        {/*</Button>*/}
                                        <FacebookLogin
                                            size='small'
                                            appId="571704337888304"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            onClick={componentClicked}
                                            callback={responseFacebook}
                                            render={renderProps => (
                                                <Button onClick={renderProps.onClick}
                                                        style={{
                                                            fontFamily: 'Roboto',
                                                            // fontSize: "14px",
                                                            color: "white",
                                                            backgroundColor: "#3b5998"
                                                        }}
                                                        icon={<FacebookOutlined style={{fontSize: "18px"}} />}
                                                >
                                                    Đăng nhập với Facebook
                                                </Button>
                                            )
                                            }
                                        />
                                    </div>
                                    <div style={{display: "flex", marginTop: "15px"}}>
                                        {/*<GoogleOutlined style={{fontSize: "32px", marginRight: "5px"}}></GoogleOutlined>*/}
                                        {/*<Button>Google</Button>*/}
                                        {/*<GoogleLogin*/}
                                        {/*    clientId="2270790339-n2niqsp2h15felguam5h3nnrpbsvqiin.apps.googleusercontent.com"*/}
                                        {/*    buttonText="Login with google"*/}
                                        {/*    onSuccess={responseGoogle}*/}
                                        {/*    onFailure={responseGoogle}*/}
                                        {/*    cookiePolicy={'single_host_origin'}*/}
                                        {/*/>*/}

                                        <GoogleLogin
                                            onSuccess={(credentialResponse) => {
                                                console.log(credentialResponse);
                                            }}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                            // useOneTap
                                        />
                                        {/*<Button onClick={loginGoogle} >Login With Google</Button>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal
                        title="Đăng ký"
                        visible={visibleSignup}
                        onCancel={handleSignupModalCancel}
                        footer={[
                            <a style={{color: "#000000"}} onClick={onLoginAppear}>Đã có tài khoản ?</a>
                        ]}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            name="form_in_modal"
                            onFinish={onSignupFormFinish}
                            onFinishFailed={onSignupFormFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                label="Tên đăng nhập"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên đăng nhập không được đẻ trống!',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không được đẻ trống!',
                                    },
                                ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email không được đẻ trống!',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </GoogleOAuthProvider>
        </BrowserRouter>
    )
}

const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    // console.log(state)
    return {
        isLogin: state.auth.loginStatus,
        isSignupSuccess: state.auth.signupStatus,
        username: state.auth.userName
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        login: (u, p) => dispatch({type: "CHECK_LOGIN_API", userName: u, passWord: p}),
        signup: (u, p, e) => dispatch({type: "CHECK_SIGNUP_API", userName: u, passWord: p, email: e}),
        resetSignupStatus: () => dispatch({type: "RESET_SIGNUP_STATUS"}),
        logout: () => dispatch({type: "LOGOUT"})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

