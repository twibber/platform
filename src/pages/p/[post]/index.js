import Layout from "@/components/Layout";
import {useQuery} from "@tanstack/react-query";
import {CreatePost, Post} from "@/components/Post";
import {useRouter} from "next/router";
import {H1, H2, H3} from "@/components/Typography";

export default function PostWithReplies() {
	const router = useRouter() // get the router object from the useRouter hook to access the query parameters

	// get the user's account data
	const {data: accountData, isSuccess: accountSuccess} = useQuery({
		queryKey: ["/account"],
	});

	// get current post
	const {data: currentPostData} = useQuery({
		queryKey: [`/posts/${router.query.post}`],
	});

	// get the replies related to the current post
	const {data: repliesData} = useQuery({
		queryKey: [`/posts/${router.query.post}/replies`],
		refetchInterval: 5000, // Refetch the replies every 5 seconds
	});

	return (
		<Layout title={"Post"}>
			<div className={"space-y-2 py-4"}>
				{/* Show the current post */}
				{currentPostData && <Post post={currentPostData} key={currentPostData.id}/>}

				{/* Only show the reply creation if the user is authenticated and the user's connection is verified */}
				{accountSuccess && accountData?.connection?.verified && (
					<CreatePost replyTo={router.query.post}/>
				)}

				<div className={"flex flex-row justify-center items-center gap-2"}>
					<hr className={"w-full"}/>
					<p className={"text-xs font-medium text-muted-foreground"}>Replies</p>
					<hr className={"w-full"}/>
				</div>

				{/* Show the replies if they have been fetched */}
				{repliesData && repliesData?.map((post) => (
					<Post post={post} key={post.id}/>
				))}
			</div>
		</Layout>
	);
}

