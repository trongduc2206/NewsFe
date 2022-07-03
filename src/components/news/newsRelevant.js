import {Divider, List} from "antd";
import React from "react";
import {connect} from "react-redux";

export function NewsRelevant(props) {
    const {data} = props
    const renderPreviewDescription = (data) => {
        if(data) {
            const descriptionSplited = data.summary.split(/[.]/)
            return descriptionSplited[0]  + " ..."
        }
    }
    return (
        <div>
            {/*<Divider orientation="left" style={{*/}
            {/*    fontFamily: "Merriweather",*/}
            {/*    fontSize: "24px",*/}
            {/*    fontWeight: "700",*/}
            {/*    color: "#1e90ff"*/}
            {/*}}>Tâm điểm</Divider>*/}
            <List
                itemLayout="vertical"
                size="small"
                dataSource={data}
                renderItem={(item) => (
                    <a href={"/news/" + item.id}>
                    <List.Item
                        key={item.id}
                        // actions={[
                        //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                        // ]}
                        extra={
                            // <a href={"/news/" + item.id}>
                                <img
                                    width={250}
                                    alt="logo"
                                    src={item.imageUrl}
                                />
                            // </a>
                        }
                    >
                        <List.Item.Meta
                            // avatar={<Avatar src={item.avatar} />}
                            // title={<a href={"/news/" + item.id}>{item.title}</a>}
                            title={item.title}
                            // description={<a href={item.href}>{item.description}</a>}
                        />
                        {/*<a href={"/news/" + item.id}>*/}
                            {renderPreviewDescription(item)}
                        {/*</a>*/}
                        {/*<NewsShortcut></NewsShortcut>*/}
                    </List.Item>
                    </a>
                )}
            />
        </div>
    )
}

export default connect()(NewsRelevant)