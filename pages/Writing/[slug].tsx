import React from 'react'
import Image from 'next/image'
import { GraphQLClient, gql } from 'graphql-request'
import Link from 'next/link'
import pThrottle from 'p-throttle';
const graphcms = new GraphQLClient(
  'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clcluf3o42j9j01ug2baub5m3/master')

const QUERY = gql`
    query MyQuery($slug : String!){
        research(where:{ slug: $slug }){
            coverPhoto {
                url
              }
              title
              slug
              seo
              authors {
                name
                bio
                avatar {
                  url
                }
              }
              content {
                html
                json
                raw
              }
        }
    }
`
const SLUGLIST = gql`
    {
        researches {
            slug
          }
    }
`
export async function getStaticPaths() {
  const { researches } = await graphcms.request(SLUGLIST)
  return {
    paths: researches.map((research: any) => ({ params: { slug: research.slug } })),
    fallback: false
  }
}


export async function getStaticProps({ params }: any) {
  const slug = params?.slug;
  const data = await throttledFetch({ slug });
  return {
    props: {
        research: data.research
    },
    revalidate: 10,
  }
}
const throttle = pThrottle({ limit: 1, interval: 1000 });
export const throttledFetch = throttle(async (...args) => {
  const [vars] = args;
  const data = await graphcms.request(QUERY, vars);
  const research = data.research;
  return {
    research,

  }
})

const AuthorDetails = ({ research }: any) => {
 

  const getContentFragment = (index: any, text: any, obj: any, type: any) => {
    let modifiedText = text;

    if (obj) {
      

      if (obj.italic) {
        modifiedText = (<em key={index}>{modifiedText}</em>);
      }
      if (obj.bold) {
        modifiedText = (<b key={index}>{modifiedText}</b>);
      }
      if (obj.underline) {
        modifiedText = (<u key={index}>{modifiedText}</u>);
      }
    }

    switch (type) {
      case 'heading-one':
        return <h1 key={index} className="text-6xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h1>;
      case 'heading-two':
        return <h2 key={index} className="text-5xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h2>;
      case 'heading-three':
        return <h3 key={index} className="text-4xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'heading-three':
        return <h3 key={index} className="text-4xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'heading-four':
        return <h4 key={index} className="text-3xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
      case 'heading-five':
        return <h5 key={index} className="text-2xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h5>;
      case 'heading-six':
        return <h6 key={index} className="text-xl font-bold leading-normal mt-0 mb-2">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h6>;
      case 'paragraph':
        return <p key={index} className="mb-8">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
      case 'heading-four':
        return <h4 key={index} className="text-md font-semibold mb-4">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
      case 'link':
        return <a key={index} href={modifiedText.href} className="text-md font-semibold mb-4">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</a>;
      case 'script':
        return <script key={index} className="text-md font-semibold mb-4">{modifiedText.map((item:any, i:any) => <React.Fragment key={i}>{item}</React.Fragment>)}</script>;
      case 'image':
        return (
          <img
            key={index}
            alt={obj.title}
            height={obj.height}
            width={obj.width}
            src={obj.src}
          />
        );
      default:
        return modifiedText;
    }
  };
  return (
    
    <div>
      {research.title}
      {research.content.raw.children.map((typeObj:any, index:any) => {
          const children = typeObj.children.map((item:any, itemindex:any) => getContentFragment(itemindex, item.text, item))
          return getContentFragment(index, children, typeObj, typeObj.type)
        })}
    </div>
  )
}

export default AuthorDetails