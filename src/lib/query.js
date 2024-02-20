import {QueryClient} from "@tanstack/react-query";
import {apiQuery} from "@/lib/request";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: apiQuery,
			// if the query fails, retry it 3 times unless the environment is development
			retry: process.env.NODE_ENV === "development" ? 0 : 3,
		},
	},
})
