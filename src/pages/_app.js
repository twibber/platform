import React from 'react'

// React Query
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {QueryClientProvider} from '@tanstack/react-query'
import {queryClient} from "@/lib/query";

// Tailwind CSS
import "@/styles/tailwind.css"

export default function App({Component, pageProps}) {
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			{/* Devtools is only enabled when the app is run with next dev */}
			<ReactQueryDevtools/>
		</QueryClientProvider>
	)
}