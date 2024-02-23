import React from 'react';
import Head from "next/head";
import {cn, formErrors, getFieldDefaults, getZodValidationSchema} from "@/lib/utils";

import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "next-themes"
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {ScrollArea} from "@/components/ui/scroll-area";
import Authentication from "@/components/Authentication";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useQuery} from "@tanstack/react-query";
import {Icon} from "@iconify/react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import DialogForm from "@/components/DialogForm";
import {apiFetch} from "@/lib/request";
import {queryClient} from "@/lib/query";
import {toast} from "sonner";

// Layout takes in a title and children and returns a layout with the title and children as well as the theming of the website
export default function Layout({children, title, className}) {
	// Get the account data from the server
	const {data: accountData, isSuccess} = useQuery({
		queryKey: ["/account"],
	});

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
		>
			{/* Set the title of the page */}
			<Head>
				<title>{(title ? title + " - " : null) + "Twibber"}</title>
			</Head>

			{/* Set the layout of the page */}
			<div className="max-w-screen-xl w-full h-full flex flex-row border-x mx-auto">
				{/* Split the page into 4 equal parts sidebar takes up 1/4 of the page */}
				<div className={"w-1/4 h-full"}>
					<Sidebar/>
				</div>

				{/* Children takes up 2/4 of the page */}
				<ScrollArea className={cn(
					"h-screen w-2/4 border-x px-4",
					className
				)}>
					{/* Account Verified Alert*/}
					{isSuccess && !accountData?.connection?.verified && (<VerificationAlert/>)}
					{children}
				</ScrollArea>

				{/*Filler for centering*/}
				<div className={"w-1/4 "}/>
			</div>

			{/* Set the toaster for the page */}
			<Toaster
				visibleToasts={5} // Maximum number of toasts to show at once
			/>
		</ThemeProvider>
	);
}

function VerificationAlert() {
	return (
		<Dialog>
			<Alert>
				<DialogTrigger asChild>
					<Button variant={"secondary"} className={"absolute right-4 top-4"}>
						Verify Account
					</Button>
				</DialogTrigger>

				<VerificationForm/>

				<Icon icon="lucide:alert-triangle"/>

				<AlertTitle>
					Your account is not verified
				</AlertTitle>
				<AlertDescription>
					Please verify your account to access all features
				</AlertDescription>
			</Alert>
		</Dialog>
	);
}

function VerificationForm() {
	const fields = [
		{
			name: "code",
			label: (
				<div className={"flex flex-row justify-between items-center"}>
					<span>Verification Code</span>
					<Button variant={"link"}
					        className={"p-0 h-auto"}
					        type={"button"}
					        onClick={() => apiFetch("POST", "/account/resend", null, {
						        notify: true,
					        }).then(r => toast.success("A new verification code has been sent to your email."))
						        .catch(e => console.error(e))
					        }
					>
						Haven&apos;t received a code?
					</Button>
				</div>
			),
			type: "text",
			autoComplete: "off",
			placeholder: "Verification Code",
			description: "Please enter the verification code sent to your email",
			validate: z.string().min(6).max(6),
		},
	];

	const form = useForm({
		resolver: zodResolver(getZodValidationSchema(fields)),
		defaultValues: getFieldDefaults(fields),
	});

	return (
		<DialogForm
			title={"Verify Account"}
			description={"A verification code has been sent to your email."}
			fields={fields}
			form={form}
			onSubmit={(data) => apiFetch("POST", "/account/verify", data, {
				notify: true,
			})
				.then(r => {
					toast.success("Account verified successfully.");
					void queryClient.invalidateQueries() // Invalidate the account query to refetch the data
				})
				.catch(e => formErrors(form, e)) // Handle any field errors
			}
			submitLabel={"Verify Account"}
		/>
	);
}

function Sidebar({children}) {
	const links = [
		{
			label: "Feed",
			href: '/',
		},
		{
			label: "Users",
			href: '/users',
		},
	]

	const pathname = usePathname();

	return (
		<div className="flex flex-col justify-between min-h-screen space-y-4 w-full">
			{/* Map over the links and create a link for each */}
			<div className={"flex flex-col gap-4 p-4"}>
				{/* Logo */}
				<Link href="/" className="py-2 text-2xl font-bold text-center w-full">
					TWIBBER
				</Link>

				{links.map((link, index) => (
					<Link key={index} href={link.href} className={buttonVariants({
						variant: link.href === pathname ? "secondary" : "outline",
					})}>
						{link.label}
					</Link>
				))}
			</div>

			<Authentication/>
		</div>
	)
}