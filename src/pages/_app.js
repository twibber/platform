import React from 'react'

// React Query
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {QueryClientProvider} from '@tanstack/react-query'
import {queryClient} from "@/lib/query";

// Tailwind CSS
import "@/styles/tailwind.css"
import Head from "next/head";

export default function App({Component, pageProps}) {
	return (
		<>
			<Head>
				<meta charSet="utf-8"/>
				<link rel="icon"
					  href="/favicon-dark.png"
					  media="(prefers-color-scheme: dark)"
				/>
				<link rel="icon"
					  href="/favicon-light.png"
					  media="(prefers-color-scheme: light)"
				/>
				<meta name="viewport" content="width=device-width"/>
			</Head>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
				{/* Devtools is only enabled when the app is run with next dev */}
				<ReactQueryDevtools/>
			</QueryClientProvider>
		</>
	)
}