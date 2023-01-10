import React from 'react'
import Image from 'next/image'
import { GraphQLClient, gql } from 'graphql-request'
import Link from 'next/link'
import pThrottle from 'p-throttle';
const graphcms = new GraphQLClient(
  'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clcluf3o42j9j01ug2baub5m3/master')

const QUERY = gql`
    query MyQuery($slug : String!){
        author(where:{ slug: $slug }){
            avatar {
                url
            }
            name
            role
            slug
            bio
            socials
            researches {
                title
                slug
                createdAt
                seo
                content{
                  raw
                  json
                }
                authors {
                    name
                }
            }
        }
    }
`
const SLUGLIST = gql`
    {
        authors {
            slug
          }
    }
`
export async function getStaticPaths() {
  const { authors } = await graphcms.request(SLUGLIST)
  return {
    paths: authors.map((author: any) => ({ params: { slug: author.slug } })),
    fallback: false
  }
}


export async function getStaticProps({ params }: any) {
  const slug = params?.slug;
  const data = await throttledFetch({ slug });
  return {
    props: {
      author: data.author
    },
    revalidate: 10,
  }
}
const throttle = pThrottle({ limit: 1, interval: 1000 });
export const throttledFetch = throttle(async (...args) => {
  const [vars] = args;
  const data = await graphcms.request(QUERY, vars);
  const author = data.author;
  return {
    author,

  }
})

const AuthorDetails = ({ author }: any) => {
 
  return (
    <div>
      
    </div>
  )
}

export default AuthorDetails