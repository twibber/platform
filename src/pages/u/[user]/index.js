import Layout from "@/components/Layout";
import {useQuery} from "@tanstack/react-query";
import {CreatePost, Post} from "@/components/Post";
import {useRouter} from "next/router";
import {H1, H2, H3} from "@/components/Typography";

export default function UserWithPosts() {
    const router = useRouter() // get the router object from the useRouter hook to access the query parameters

    // get the user in the query
    const {data: userData} = useQuery({
        queryKey: [`/users/${router.query.user}`, "notify"],
    });

    // get the posts related to the current user
    const {data: postsData} = useQuery({
        queryKey: [`/users/${router.query.user}/posts`, "notify"],
    });

    return (
        <Layout title={"Post"}>
            <div className={"space-y-2 py-4"}>
                {/* Show the current user */}
                {userData && (
                    <div className={"flex flex-col p-4 border rounded-md"}>
                        <p className={"text-base font-medium"}>{userData.display_name}</p>
                        <p className={"text-sm font-normal text-muted-foreground"}>@{userData.username}</p>
                    </div>
                )}

                <div className={"flex flex-row justify-center items-center gap-2"}>
                    <hr className={"w-full"}/>
                    <p className={"text-xs font-medium text-muted-foreground"}>Posts</p>
                    <hr className={"w-full"}/>
                </div>

                {/* Show the posts if they have been fetched */}
                {postsData && postsData?.map((post) => (
                    <Post post={post} key={post.id}/>
                ))}
            </div>
        </Layout>
    );
}

