import * as React from 'react'
import Articles from './Articles';
import getNewsArticles from '../lib/getNewsArticles';
import { urlTheTitle } from '../lib/utils';
import { DEFAULT_IMAGE, dummyDesc } from '../lib/constants';
import { Switch, Route } from "react-router-dom";
import { Col, Spin, Modal, Pagination } from 'antd';

class ArticlesContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            newsArticles: [], 
            totalArticles: [],
            limit: 2,
            offset: 0,
            visible: false
        };
    }

    async componentWillMount() {
        //get paginated articles
        const variables = {
            keywords: ['hunkemoller'],
            limit: this.state.limit,
            offset: this.state.offset
        };

        //get total amount of articles
        const varsForTotal = {
            keywords: ['hunkemoller']
        };

        const paginated = await getNewsArticles(variables);
        const total = await getNewsArticles(varsForTotal);
        
        this.setState({
            newsArticles: paginated.fashionunitedNlNewsArticles,
            totalArticles: total.fashionunitedNlNewsArticles,
        });
    }

    // set previous location to check for modal
    previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        let { location } = this.props;
        // set previousLocation if props.location is not modal
        if ( nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)) 
        {
            this.previousLocation = this.props.location;
        }
    }

    paginate = (page) => {
        // state controls the pagination, skip is the page number
        // -1 because array index starts at 0
        // anonymous callback function on updated state 
        // to get the articles on current page
        this.setState({ ...this.state, offset: (page-1) * 2 }, async () => {
            const variables = {
                keywords: ['hunkemoller'],
                limit: this.state.limit,
                offset: this.state.offset
            };
            
            const paginated = await getNewsArticles(variables);
            
            this.setState({
                newsArticles: paginated.fashionunitedNlNewsArticles
            });
        });
    }

    Dialog = ({ match, history }) => {
        // find specific article
        let article = this.state.newsArticles.find(newsArticle => {
            let url = urlTheTitle(newsArticle.title)
            // array index was used for id because there is no unique post id 
            // thats why .icludes() is used to match url to post
            if(match.params.id.includes(url)) return newsArticle
        });
        if (!article) return null;

        // show the modal to user
        let visible = true;
        
        // hide the modal when a user clicks outside the modal or on 'X'
        let close = e => {
          e.stopPropagation();
          history.goBack();
          visible = false;
        };
      
        return (
            <Modal
                title={article.title}
                visible={visible}
                onCancel={close}
                style={{top:0, margin:"3% auto", paddingBottom: 0}}
                width="95%"
                footer={null}
            >
                <img className="dialog-img" src={article.imageUrl || DEFAULT_IMAGE} />
                <p>{dummyDesc}</p>
            </Modal>
        );
    }

    NewsArticle = ({ match }) => { 
        console.log(this.state)
        // find the specific article and return it       
        let article = this.state.totalArticles.find(newsArticle => {
            let url = urlTheTitle(newsArticle.title)
            // array index was used for id because there is no unique post id 
            // thats why .icludes() is used to match url to post
            if(match.params.id.includes(url)) {
                if(!newsArticle.imageUrl) newsArticle.imageUrl = DEFAULT_IMAGE
                return newsArticle
            }
        })
        if (!article) return null
        return (
            <div>
                <h1>{article.title}</h1>
                <img className="dialog-img" src={article.imageUrl} />
            </div>
        )
    }

    render() {
        let { location } = this.props

        // sets isModal true or false depending on location.state and previousLocation
        // checking if user came from a link or clicked on an article
        let isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location
        ) // not initial render

        if(this.state.newsArticles.length === 0) return (
            <div className="loader">
                <Spin />
            </div>
        )
        return (
                <div>
                    <Switch location={isModal ? this.previousLocation : location}>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <div>
                                    <Articles 
                                        articles={this.state.newsArticles}
                                    />
                                    {/* Pagination total is from local state
                                    divided by 2 because the plan is to show 2 per page*/}
                                    <Col xs={{ span: 22, offset: 1 }} className="pagination">
                                        <Pagination 
                                            defaultCurrent={1} 
                                            total={Math.ceil(this.state.totalArticles.length/2)*10}
                                            onChange={this.paginate}
                                        />
                                    </Col>
                                </div>
                                )
                            }}
                        />
                        <Route path="/article/:id" component={this.NewsArticle} />
                    </Switch>
                    {isModal ? <Route path="/article/:id" component={this.Dialog} /> : null}
                </div>
        );
    }
}
export default ArticlesContainer;