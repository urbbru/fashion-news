import * as React from 'react'
import Articles from './Articles';
import getNewsArticles from '../lib/getNewsArticles';
import { DEFAULT_IMAGE, dummyDesc, urlTheTitle } from '../lib/constants';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Col, Spin, Card, Modal, Pagination } from 'antd';
const { Meta } = Card;

class ArticlesContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            newsArticles: [], 
            visible: false, 
            skip: 0, 
            take: 2
        };
    }

    async componentWillMount() {
        const variables = {
            keywords: ['hunkemoller']
        };

        const result = await getNewsArticles(variables);
        
        this.setState({
            newsArticles: result.fashionunitedNlNewsArticles,
        });
    }

    // set previous location to check for modal
    previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        let { location } = this.props;
        // set previousLocation if props.location is not modal
        if (
        nextProps.history.action !== "POP" &&
        (!location.state || !location.state.modal)
        ) {
        this.previousLocation = this.props.location;
        }
    }

    paginate = (page) => {
        // state controls the pagination, skip is the page number
        // -1 because array index starts at 0
        this.setState({ ...this.state, skip: page-1 })
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
                style={{top:0, margin:"3% auto"}}
                width="95%"
                footer={null}
            >
                <img className="dialog-img" src={article.imageUrl || DEFAULT_IMAGE} />
                <p>{dummyDesc}</p>
            </Modal>
        );
    }

    NewsArticle = ({ match }) => { 
        // find the specific article and return it       
        let article = this.state.newsArticles.find((newsArticle, index) => {
            const url = urlTheTitle(newsArticle.title) + "-" + index
            if(url === match.params.id) return newsArticle
        })
        if (!article) return null
        return (
            <div>
                <h1>{article.title}</h1>
                <img src={article.imageUrl} />
            </div>
        )
    }
    
    newsArticles(articles, take, skip) {
        // get certain part of articles array to display on a page
        const currentPage = articles.slice(skip * take, (skip + 1) * take);

        //return that part of the array as a page
        return currentPage.map((newsArticle, index) => {
            // replaces all spaces in title with dashes and turns all letters lowercase
            // ready to be placed in url
            const url = urlTheTitle(newsArticle.title) + "-" + index;
            return (
                    <Col key={index} className="gutter-row" xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset:0 }}>
                        <Card
                            style={{ minWidth: 200, marginTop:'10%'}}
                            cover={<img src={newsArticle.imageUrl || DEFAULT_IMAGE} className="articleImg"/>}
                            hoverable
                        >
                            <Meta
                            // no post ID or post description available, which is why index and dummy description is used
                            // <Link to={`/${titleForUrl}-${index}`}>
                            title={
                                <Link
                                    key={index}
                                    to={{
                                    pathname: `/article/${url}`,
                                    // this is the trick!
                                    state: { modal: true }
                                    }}
                                >{newsArticle.title}</Link>}
                            description={dummyDesc}
                            />
                        </Card>
                    </Col>
            )
        })
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
                                        showArticles={this.newsArticles} 
                                        skip={this.state.skip}
                                        take={this.state.take}
                                    />
                                    {/* Pagination total is from local state
                                    divided by 2 because the plan is to show 2 per page*/}
                                    <Col xs={{ span: 22, offset: 1 }} className="pagination">
                                        <Pagination 
                                            defaultCurrent={1} 
                                            total={Math.ceil(this.state.newsArticles.length/2)*10}
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