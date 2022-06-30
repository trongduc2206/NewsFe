import {Breadcrumb, Divider, Layout, Menu, Space} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import './layout.css';
import Search from "antd/es/input/Search";
import {FacebookFilled, InstagramFilled, UserOutlined} from "@ant-design/icons";
import {BrowserRouter, Route, Switch, Routes} from "react-router-dom";
import {HomePage} from "../homePage/homePage";
export function MainLayoutTest(props){
    const [today, setToday] = useState("")
    // let today;
    useEffect(() => {
        const date = new Date();
        console.log(date);
        processCurrentDate(date);
        console.log(today);
    }, [])

    const processCurrentDate = (date) => {
        let dayInWeek
        console.log(date);
        console.log(date.getDay());
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

        const current = `${dayInWeek}, ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        setToday(current)
    }
    return (
        <Layout
            style={{height:"100vh", display: "flex", flexDirection: "column"}}
        >
            <Header
                style={{
                position: 'sticky',
                top: 0,
                width: '100%',

            }} >
                Header
            </Header>
            {/*<Content>*/}
            {/* content*/}
            {/*</Content>*/}

            <Content
                className="site-layout"
                style={{
                    padding: '0 50px',
                    marginTop: 64,
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 380,
                    }}
                >
                    Content
                </div>
            </Content>
            <Footer>
                Footer
            </Footer>
        </Layout>
    )
}