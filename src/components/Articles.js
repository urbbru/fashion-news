import * as React from 'react'
import { newsArticles } from '../lib/utils';

export default function Articles(props) {
    return (
        <div>
                {newsArticles(props.articles)}
        </div>
    )  
}