import React, {useEffect, useState} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button, buttonVariants} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Textarea} from "@/components/ui/textarea";
import {apiFetch} from "@/lib/request";
import {formErrors} from "@/lib/utils";
import {Card, CardFooter, CardTitle} from "@/components/ui/card";
import {queryClient} from "@/lib/query";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {toast} from "sonner";

export function CreatePost({replyTo = null}) {
	const form = useForm({
		resolver: zodResolver(z.object({
			content: z.string().min(1, "Content is a required field.").max(512, "Content must be less than 512 characters."),
		})),
		defaultValues: {
			content: "",
		}
	});

	const onSubmit = (data) => apiFetch("POST", replyTo ? `/posts/${replyTo}/replies` : "/posts", data, {notify: true})
		.then(() => {
			form.reset(); // Reset the form after a successful post
			void queryClient.invalidateQueries({
				// Invalidate the current post and the replies to refetch the post to update the metrics such as reply and like count and replies
				queryKey: [replyTo ? `/posts/${replyTo}/replies` : "/posts", replyTo ? `/posts/${replyTo}` : null],
			});
		})
		.catch((e) => formErrors(form, e)); // Handle any field errors

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={"p-4 mt-4 space-y-4 rounded-md border"}>
				<FormField
					control={form.control}
					name={"content"}
					render={({field}) => (
						<FormItem>
							<FormLabel>{replyTo ? "Reply" : "Post"}</FormLabel>
							<FormControl>
								<Textarea placeholder={replyTo ? "What are your thoughts?" : "What's happening?"} {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>

				<Button type="submit"
				        variant={"default"}
				        className={"px-4 py-2 w-full"}
				>Post</Button>
			</form>
		</Form>
	);
}

export function Post({post, key}) {
	const [timeAgo, setTimeAgo] = useState("");

	// Updates the time ago display every second.
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeAgo(formatElapsedTime()); // Update state to force re-render.
		}, 1000);

		// Cleanup function to clear the interval.
		return () => clearInterval(timer);
	}, [post]);

	// Calculate and format the elapsed time since the post was created.
	const formatElapsedTime = () => {
		// Time intervals in seconds.
		const timeIntervals = [
			{seconds: 31536000, name: "year"},
			{seconds: 2592000, name: "month"},
			{seconds: 86400, name: "day"},
			{seconds: 3600, name: "hour"},
			{seconds: 60, name: "minute"},
			{seconds: 1, name: "second"},
		];

		// Calculate the elapsed time in seconds.
		let seconds = Math.floor((new Date() - new Date(post.created_at)) / 1000);
		let elapsedTime = "Just now"; // Default text.

		// Loop through the time intervals to find the appropriate one.
		for (let i = 0; i < timeIntervals.length; i++) {
			// Calculate the interval.
			const interval = Math.floor(seconds / timeIntervals[i].seconds);

			// If the interval is greater than 1, set the elapsed time and break the loop.
			if (interval >= 1) {
				// Set the elapsed time and break the loop.
				elapsedTime = `${interval} ${timeIntervals[i].name}${interval > 1 ? 's' : ''} ago`;
				break; // Break the loop.
			}
		}

		// Return the elapsed time.
		return elapsedTime;
	};

	// Initial calculation for the time ago value.
	useEffect(() => {
		setTimeAgo(formatElapsedTime());
	}, [post]); // on mount and when the post changes.

	const {data: user} = useQuery({
		queryKey: ["/account"],
	});

	return (
		<Card className={"p-4 flex flex-col gap-2"} key={key}>
			<CardTitle className={"flex flex-row justify-between items-start"}>
				<div className={"flex flex-col"}>
					<p className={"text-sm font-medium"}>{post.author.display_name}</p>
					<p className={"text-xs font-normal text-muted-foreground"}>@{post.author.username}</p>
				</div>

				<p className={"text-xs font-normal"}>{timeAgo}</p>
			</CardTitle>

			<div className={"text-sm whitespace whitespace-pre-wrap"}>
				{post.content}
			</div>

			<CardFooter className={"flex flex-row gap-2 p-0"}>
				<Button
					variant={post.liked ? "destructive" : "default"}
					onClick={() => {
						if (user?.connection?.verified !== true) {
							toast.error("You must be authenticated and verified to like a post.");
							return;
						}

						// Toggle the liked state and increment the like count to make it seem instant.
						post.liked = !post.liked;
						post.counts.likes += post.liked ? 1 : -1;

						let method = post.liked ? "POST" : "DELETE";

						// Send a request to the server to increment the like count.
						apiFetch(method, `/posts/${post.id}/likes`, {}, {notify: true})
							.then(() => void queryClient.invalidateQueries({
								queryKey: ["/posts"],
							}))
					}}
				>{`${post.liked ? "Unlike" : "Like"} (${post.counts.likes})`}</Button>

				{/* Link to the post page */}
				<Link
					className={buttonVariants({ variant: "default" })}
					href={`/p/${post.id}`}
				>Replies ({post.counts.replies})</Link>

				<div className="flex-grow"/>
				{/* The user is the author, and the post is less than 5 minutes old. */}
				{user?.connection?.user?.id === post.author.id && new Date(post.created_at) > new Date(Date.now() - 5 * 60 * 1000) && (
					<Button
						variant={"destructive"}
						onClick={() => apiFetch("DELETE", `/posts/${post.id}`, {}, {notify: true})
						        .then(() => void queryClient.invalidateQueries({
							        queryKey: ["/posts"],
						        }))}
					>Delete</Button>
				)}
			</CardFooter>
		</Card>
	);
}