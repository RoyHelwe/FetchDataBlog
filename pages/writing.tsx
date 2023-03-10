import Head from 'next/head'
import Image from 'next/image'
import { GraphQLClient, gql } from 'graphql-request'
import Link from 'next/link'


const graphcms = new GraphQLClient(
  'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clcluf3o42j9j01ug2baub5m3/master')

const QUERY = gql`
    {
        researches {
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

export async function getStaticProps() {
  const researches = await graphcms.request(QUERY)
  return {
    props: {
        researches,
    },
    revalidate: 10,
  }
}

export default function Writing(researches: any) {
  console.log(researches.researches.researches)
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <div className='flex flex-col gap-10'>
          {
            researches.researches.researches.map((researche:any,index:any)=>(
                <div key={index}><Link href={"/Writing/"+researche.slug}>{researche.title}</Link></div>
            ))
          }
        </div>
      </main>
    </>
  )
}
