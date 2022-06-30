import {useLocation, useParams} from "react-router-dom";
import {useEffect} from "react";
import {connect} from "react-redux";
import {MainLayout} from "./layout";
import InteractNewsService from "../../service/interact-news.service";

const ScrollToTop = (props) => {
    const {isEnterNews, enterTime, enterNews, leaveNews, newsId, isScroll, scroll} = props
    const location = useLocation();
    let params = useParams();
    useEffect(() => {

        console.log(location)
        //check if previous location is belong to news detail path
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser) {
            if (isEnterNews) {
                console.log("user have just come here from a news page")
                const leaveTime = new Date()
                console.log("enterTime",enterTime)
                console.log("isScroll ", isScroll)
                if ((leaveTime.getTime() - enterTime.getTime()) / 1000 > 10.0 && isScroll) {
                    //call api to save read interact
                    console.log("user have read a news")
                    const request = {
                        userId: currentUser.id,
                        newsId: newsId,
                        type: "READ",
                        interactTime: enterTime
                    }
                    InteractNewsService.insertInteractNews(request).then(
                        response => {
                            if (response.data.status && response.data.status.code === 'success') {
                                console.log("user read in save to db")
                            }
                        }
                    )
                }
            }
            //check if current location is belong to news detail path
            if(location.pathname) {
                if (location.pathname.includes("/news/")) {
                    const locationSplited = location.pathname.split(/[/\s]/)
                    // console.log(locationSplited[2])
                    console.log("user start read a news " + locationSplited[2])
                    enterNews(locationSplited[2])
                } else {
                    if (isEnterNews) {
                        console.log("user have just leave reading a news")
                        leaveNews()
                    }
                }
            }
        }
        window.scrollTo(0, 0);
        window.onscroll = () => {
            if(location.pathname.includes("/news/") && window.scrollY > 450) {
                scroll()
            }
        }


    }, [location]);

    return <>{props.children}</>
};


const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    // console.log(state)
    return {
        isEnterNews: state.interact.isEnterNewsDetail,
        enterTime: state.interact.enterTime,
        newsId: state.interact.newsId,
        isScroll: state.interact.scrollNews
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        enterNews: (n) => dispatch({type: "ENTER", newsId: n}),
        leaveNews: () => dispatch({type: "LEAVE"}),
        scroll: () => dispatch({type: "SCROLL"})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ScrollToTop);
// export default ScrollToTop;