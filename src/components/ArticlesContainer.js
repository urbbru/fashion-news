import * as React from 'react'
import Articles from './Articles';
import getNewsArticles from '../lib/getNewsArticles';
import { DEFAULT_IMAGE, dummyDesc, urlTheTitle } from '../lib/constants';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Col, Spin, Card, Modal } from 'antd';
const { Meta } = Card;

class ArticlesContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { newsArticles: [], visible: false };
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

    paginate = () => {}

    Dialog = ({ match, history }) => {
        let article = this.state.newsArticles.find((newsArticle, index) => {
            let url = urlTheTitle(newsArticle.title) + "-" + index
            if(url === match.params.id) return newsArticle
        });
        if (!article) return null;

        let visible = true
      
        let back = e => {
          e.stopPropagation();
          history.goBack();
          visible = false
        };
      
        return (
            <Modal
                title={article.title}
                visible={visible}
                onCancel={back}
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
    
    newsArticles(articles) {
        return articles.map((newsArticle, index) => {
            //replaces all spaces in title with dashes and turns all letters lowercase
            //ready to be placed in url
            const url = urlTheTitle(newsArticle.title) + "-" + index;
            return (
                    <Col className="gutter-row" xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset:0 }}>
                        <Card
                            key={index}
                            style={{ minWidth: 200, marginTop:'10%'}}
                            cover={<img src={newsArticle.imageUrl || DEFAULT_IMAGE} class="articleImg"/>}
                            hoverable
                        >
                            <Meta
                            //no post ID or post description available, which is why index and dummy description is used
                            //<Link to={`/${titleForUrl}-${index}`}>
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
                            render={() => 
                                <Articles 
                                    articles={this.state.newsArticles} 
                                    showArticles={this.newsArticles} 
                                />
                            }
                        />
                        <Route path="/article/:id" component={this.NewsArticle} />
                    </Switch>
                    {isModal ? <Route path="/article/:id" component={this.Dialog} /> : null}
                </div>
        );
    }
}
export default ArticlesContainer;