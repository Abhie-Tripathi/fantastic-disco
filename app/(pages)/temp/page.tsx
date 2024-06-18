import React from 'react'
import Script from 'next/script'

const Page = () => {
    return (
        <div>

            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></Script>
            <page-widget page-id={"381ccfe1-6b96-4398-b234-c3a36c98c607"}></page-widget>

        </div>
    )
}

export default Page