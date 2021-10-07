import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Meta = ({
  title = 'AJU Maven',
  keywords = '',
  description = '',
  image = `${process.env.NEXT_PUBLIC_APP_URL}/images/maven_logo_white.png`,
}) => {
  const router = useRouter()
  return (
    <Head>
      <title>{title}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} key="keywords" />
      <meta name="description" content={description} key="descriptions" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`}
      />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta charSet="utf-8" />

      <link rel="icon" href="/favicon.png" />
    </Head>
  )
}

export default Meta
