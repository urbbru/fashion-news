import React, {Component} from 'react';
import ArticlesContainer from './components/ArticlesContainer';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Row, Col, Spin, Card, Pagination } from 'antd';
const { Header, Footer, Content } = Layout;
const { Meta } = Card;

class App extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <h1 className="title">Fashion News</h1>
                </Header>

                <Content id="main">
                    <Row gutter={48}>
                        <Router>
                            <Route path="/" component={ArticlesContainer} />
                        </Router>
                    </Row>
                </Content>

                <Footer>
                    Fashion News 2018
                </Footer>
            </Layout>
        );
    }
}
export default App;