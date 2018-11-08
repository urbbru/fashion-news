import * as React from 'react'
import { Col, Pagination } from 'antd'

export default function Articles(props) {
    return (
        <div>
                {props.showArticles(props.articles, props.take, props.skip)}
        </div>
    )  
}