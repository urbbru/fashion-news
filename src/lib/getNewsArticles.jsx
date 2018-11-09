import { request } from 'graphql-request';

const endpoint = 'https://fashionunited.info/graphql/';

const query = `
    query NewsArticles($keywords: [String], $limit: Int, $offset: Int) {
        fashionunitedNlNewsArticles(keywords: $keywords, limit: $limit, offset: $offset) {
            title
            url
            imageUrl
        }
    }
`;

export default function getNewsArticles(variables) {
    return request(endpoint, query, variables);
}