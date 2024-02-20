import {H1} from "@/components/Typography";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import Layout from "@/components/Layout";
import {useQuery} from "@tanstack/react-query";
import CodeBlock from "@/components/Codeblock";

export default function Home() {
	// Get account data if authenticated it will return the data, otherwise it will return an error
	const {data: accountData, error: accountError} = useQuery({
		queryKey: ["/account"],
	});

	// Get server status data, always returns the same data, and it's not an error
	const {data: serverData, error: serverError} = useQuery({
		queryKey: ["/"],
	});

	return (
		<Layout title={"Feed"} className={"flex flex-col gap-8"}>

		</Layout>
	);
}

