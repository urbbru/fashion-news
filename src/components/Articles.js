import * as React from 'react'
import { Col, Pagination } from 'antd'

export default function Test(props) {
    return (
        <div>
                {props.showArticles(props.articles)}
                
                {/* Pagination total is from local state, divided by 2 because the plan is to show 2 per page*/}
                <Col xs={{ span: 22, offset: 1 }} className="pagination">
                    <Pagination defaultCurrent={1} total={Math.ceil(props.articles.length/2)*10}/>
                </Col>
        </div>
    )  
}