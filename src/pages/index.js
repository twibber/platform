import Layout from "@/components/Layout";
import {useQuery} from "@tanstack/react-query";
import {CreatePost, Post} from "@/components/Post";

export default function Home() {
	// get the user's account data
	const {data: accountData, isSuccess: accountSuccess} = useQuery({
		queryKey: ["/account"],
	});

	// get a list of posts from the API
	const {data: postsData, isSuccess: postsSuccess} = useQuery({
		queryKey: ["/posts"],
	});

	return (
		<Layout title={"Feed"}>
			{/* Only show the content creation if the user is authenticated and the user's connection is verified */}
			{accountSuccess && accountData?.connection?.verified && (
				<CreatePost/>
			)}

			<div className={"space-y-2 py-4"}>
				{/* Show the posts if they have been fetched */}
				{postsSuccess && postsData?.map((post) => (
					<Post post={post} key={post.id}/>
				))}
			</div>
		</Layout>
	);
}

