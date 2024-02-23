"use client"

import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import DialogForm from "@/components/DialogForm";
import {z} from "zod";
import {apiFetch} from "@/lib/request";
import {useQuery} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {formErrors, getFieldDefaults, getZodValidationSchema} from "@/lib/utils";
import {toast} from "sonner";
import {queryClient} from "@/lib/query";

export default function Authentication() {
	const {data: accountData, isSuccess, isLoading} = useQuery({
		queryKey: ["/account"],
	});

	return (
		<div className="border-t w-full">
			{isSuccess && accountData ? (
				<div className="flex items-center space-x-4 justify-between p-4">
					<div className="text-left space-y-1">
						<h3 className="text-sm font-medium leading-none">{accountData.connection.user.display_name}</h3>
						<p className="text-xs font-medium text-muted-foreground">@{accountData.connection.user.username}</p>
					</div>
					<Button className="ml-auto" size="sm" variant="destructive"
					        onClick={() => apiFetch("POST", "/account/logout", {}, {
						        notify: true,
					        })
						        .then(r => {
							        toast.success("Successfully logged out") // Notify the user that they have been logged out
							        void queryClient.invalidateQueries() // Invalidate the account query so the user is logged in
						        })
						        .catch(e => console.log(e))
					        }>Logout</Button>
				</div>
			) : (
				<div className={"w-full flex flex-row gap-2 p-4"}>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" className={"w-full"}>Login</Button>
						</DialogTrigger>

						<Login/>
					</Dialog>

					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" className={"w-full"}>Register</Button>
						</DialogTrigger>

						<Register/>
					</Dialog>
				</div>

			)}
		</div>
	);
}

function Login() {
	// Fields for the login form
	const fields = [
		{
			name: "email",
			label: "Email",
			type: "email",
			autoComplete: "email",
			placeholder: "Email",
			description: "This is the email you used to register.",
			validate: z.string().min(1, "Email is a required field").email("Email must be a valid email address"),
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			autoComplete: "current-password",
			placeholder: "Password",
			description: "Your password is case sensitive",
			validate: z.string().min(8, "Password must be at least 8 characters"),
		},
	];

	// initiate the form with zod validation and the default values provided
	const form = useForm({
		resolver: zodResolver(getZodValidationSchema(fields)),
		defaultValues: getFieldDefaults(fields),
	});

	return (
		<DialogForm
			title={"Login"}
			description={"Login to your account"}
			fields={fields}
			form={form}
			onSubmit={(data) => apiFetch("POST", "/auth/login", data, {
				notify: true,
			})
				.then(r => {
					toast.success("Successfully logged in")
					void queryClient.invalidateQueries() // Invalidate the account query so the user is logged in
				})
				.catch(e => formErrors(form, e))
			}
			submitLabel={"Login"}
		/>
	);
}

function Register() {
	// Fields for the registration form
	const fields = [
		{
			name: "display_name",
			label: "Display Name",
			type: "text",
			autoComplete: "name",
			placeholder: "Display Name",
			description: "This is the name that will be displayed to other users",
			validate: z.string().min(3, "Display name is a required field").max(255, "Display name must be less than 255 characters"),
		},
		{
			name: "username",
			label: "Username",
			type: "text",
			autoComplete: "username",
			placeholder: "Username",
			description: "This a unique identifier for your account",
			validate: z.string().min(3, "Username is a required field").max(255, "Username must be less than 255 characters"),
		},
		{
			name: "email",
			label: "Email",
			type: "email",
			autoComplete: "email",
			placeholder: "Email",
			description: "Your email is used for account recovery",
			validate: z.string().min(1, "Email is a required field").email("Email must be a valid email address").max(512, "Email must be less than 512 characters"),
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			autoComplete: "new-password",
			placeholder: "Password",
			description: "Your password is case sensitive",
			validate: z.string().min(8, "Password must be at least 8 characters"),
		},
		{
			name: "confirm_password",
			label: "Confirm Password",
			type: "password",
			autoComplete: "new-password",
			placeholder: "Confirm Password",
			description: "Please confirm your password",
			validate: z.string().refine((data) => data === form.getValues().password, {
				message: "Passwords do not match",
			}),
		}
	];

	// Zod schema for the login form, this will be used for client side validation so the request doesn't have to be sent to the server
	const form = useForm({
		resolver: zodResolver(getZodValidationSchema(fields)),
		defaultValues: getFieldDefaults(fields),
	});

	return (
		<DialogForm
			title={"Register"}
			description={"Create a new account"}
			fields={fields}
			form={form}
			onSubmit={(data) => apiFetch("POST", "/auth/register", data, {
				notify: true,
			})
				.then(r => {
					toast.success("Successfully registered")
					void queryClient.invalidateQueries() // Invalidate the account query so the user is logged in
				})
				.catch(e => formErrors(form, e))
			}
			submitLabel={"Register"}
		/>
	);
}