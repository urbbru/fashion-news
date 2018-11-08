import * as React from 'react'
import { Col, Card } from 'antd';
import { DEFAULT_IMAGE, dummyDesc } from '../lib/constants';
import { Link } from "react-router-dom";
const { Meta } = Card;

// this renders the news articles each in their own column for responsiveness
// argument 1 takes the array of article objects
// argument 2 takes how many articles per page for pagination
// argument 3 takes the page currently on
export function newsArticles(articles, take, skip) {
    // get certain part of articles array to display on a page
    const currentPage = articles.slice(skip * take, (skip + 1) * take);

    //return that part of the array as a page
    return currentPage.map((newsArticle, index) => {
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