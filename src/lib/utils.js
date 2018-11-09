import * as React from 'react'
import { Col, Card } from 'antd';
import { DEFAULT_IMAGE, dummyDesc } from '../lib/constants';
import { Link } from "react-router-dom";
const { Meta } = Card;

// this renders the news articles each in their own column for responsiveness
export function newsArticles(articles) {
    
    return articles.map((newsArticle, index) => {
        // replaces all spaces in title with dashes & turns all letters lowercase
        // ready to be placed in url
        const url = urlTheTitle(newsArticle.title) + `-${index}`;
        return (
                <Col key={index} className="gutter-row" xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset:0 }}>
                    {/* no post ID or post description available
                    which is why index and dummy description is used */}
                    <Link
                                key={index}
                                to={{
                                    pathname: `/article/${url}`,
                                    state: { modal: true }
                                }}
                    >
                        <Card
                            style={{ minWidth: 200, marginTop:'10%'}}
                            cover={<img src={newsArticle.imageUrl || DEFAULT_IMAGE} className="articleImg"/>}
                            hoverable
                        >
                            <Meta
                                title={newsArticle.title}
                                description={dummyDesc}
                            />
                        </Card>
                    </Link>
                </Col>
        )
    })
}

//makes any title url friendly --> lowercase and with dashes instead of spaces
export function urlTheTitle(title) { return title.replace(/ /g, '-').toLowerCase(); }