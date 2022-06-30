import {Divider, List} from "antd";
import React from "react";
import {connect} from "react-redux";

export function NewsSpotLight(props) {
    const {data} = props
    return (
        <div>
            <Divider orientation="left" style={{
                fontFamily: "Merriweather",
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e90ff"
            }}>Tâm điểm</Divider>
            <List
                itemLayout="vertical"
                size="small"
                // pagination={{
                //     onChange: (page) => {
                //         console.log(page);
                //     },
                //     pageSize: 3,
                // }}
                dataSource={data}
                // footer={
                //     <div>
                //         <NewsList></NewsList>
                //     </div>
                // }
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        // actions={[
                        //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                        // ]}
                        extra={
                            <a href={item.href}>
                                <img
                                    width={400}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            </a>
                        }
                    >
                        <List.Item.Meta
                            // avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            // description={<a href={item.href}>{item.description}</a>}
                        />
                        <a href={item.href}>{item.content}</a>
                        {/*<NewsShortcut></NewsShortcut>*/}
                    </List.Item>
                )}
            />
        </div>
    )
}

export default connect()(NewsSpotLight)