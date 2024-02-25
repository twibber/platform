import React from 'react';
import Layout from "@/components/Layout";
import {useQuery} from "@tanstack/react-query";

function Users(props) {
    // Get the current logged in user's account data
    const {data: accountData, isSuccess} = useQuery({
        queryKey: ["/account"],
    });

    // Get a list of users on the platform
    const {data: usersData, isSuccess: usersSuccess} = useQuery({
        queryKey: ["/users"],
    });

    return (
        <Layout title={"Users"}>
            <div className={"space-y-2 py-4"}>
                {/* Show the users if they have been fetched */}
                {usersSuccess && usersData?.map((user) => (
                    <div className={"flex flex-col p-4 border rounded-md"} key={user.id}>
                        <p className={"text-base font-medium"}>{user.display_name}</p>
                        <p className={"text-sm font-normal text-muted-foreground"}>@{user.username}</p>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Users;