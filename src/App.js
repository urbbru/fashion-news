import React, {Component} from 'react';
import getNewsArticles from './getNewsArticles';
import { DEFAULT_IMAGE, dummyDesc } from './constants';
import { Layout, Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Footer, Content } = Layout;
const { Meta } = Card;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { newsArticles: [] };
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
    
    newsArticles() {
        return this.state.newsArticles.map((newsArticle, index) => {
            //replaces all spaces in title with dashes and turns all letters lowercase
            //ready to be placed in url
            const titleForUrl = newsArticle.title.replace(/ /g, '-').toLowerCase();
            return (<Col className="gutter-row" xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset:0 }}>
                        <Card
                            key={index}
                            style={{ minWidth: 200, marginTop:'10%'}}
                            cover={<img src={newsArticle.imageUrl || DEFAULT_IMAGE} class="articleImg"/>}
                            hoverable
                        >
                            <Meta
                            //no post ID or post description available, which is why index and dummy description is used
                            title={<Link to={`/${titleForUrl}-${index}`}>{newsArticle.title}</Link>}
                            description={dummyDesc}
                            />
                        </Card>
                    </Col>)
        })
    }

    render() {
        return (
            <Layout>
                <Header>
                    <h1 class="title">Fashion News</h1>
                </Header>

                <Content id="main">
                    <Row gutter={48}>
                        {this.newsArticles()}
                    </Row>
                </Content>

                <Footer>Footer</Footer>
            </Layout>
        );
    }
}
export default App;