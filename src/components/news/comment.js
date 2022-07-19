import moment from "moment";
import {Comment, List, Tooltip} from "antd";
import {connect} from "react-redux";

export function CommentList(props) {
    // const data = [
    //     {
    //         actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    //         author: 'Han Solo',
    //         avatar: 'https://joeschmoe.io/api/v1/random',
    //         content: (
    //             <p>
    //                 We supply a series of design principles, practical patterns and high quality design
    //                 resources (Sketch and Axure), to help people create their product prototypes beautifully and
    //                 efficiently.
    //             </p>
    //         ),
    //         datetime: (
    //             <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
    //                 <span>{moment().subtract(1, 'days').fromNow()}</span>
    //             </Tooltip>
    //         ),
    //     },
    //     {
    //         actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    //         author: 'Han Solo',
    //         avatar: 'https://joeschmoe.io/api/v1/random',
    //         content: (
    //             <p>
    //                 We supply a series of design principles, practical patterns and high quality design
    //                 resources (Sketch and Axure), to help people create their product prototypes beautifully and
    //                 efficiently.
    //             </p>
    //         ),
    //         datetime: (
    //             <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
    //                 <span>{moment().subtract(2, 'days').fromNow()}</span>
    //             </Tooltip>
    //         ),
    //     },
    // ];
    const {data} = props

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const renderAuthorCommentName = (username) => {
        if(currentUser !== null && currentUser.username === username) {
            return username + " - Bạn"
        } else {
            return username
        }
    }
    return (
        <div>
                <List
                    className="comment-list"
                    // header={`${data.length} replies`}
                    itemLayout="horizontal"
                    dataSource={data ? data : []}
                    renderItem={(item) => (
                        <li>
                            <Comment
                                // actions={[<span key="comment-list-reply-to-0">Reply to</span>]}
                                // author={item.username}
                                author={renderAuthorCommentName(item.username)}
                                // avatar={item.avatar}
                                content={item.content}
                                datetime={
                                    <Tooltip title={moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                                        <span>{moment(item.createTime).fromNow()}</span>
                                    </Tooltip>
                                }
                            />
                        </li>
                    )}
                />

        </div>
    );
}

export default connect()(CommentList);