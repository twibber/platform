"use client"

import React from 'react';

import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

function DialogForm({title, description, fields, form, onSubmit, submitLabel}) {
	return (
		<DialogContent>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className={"w-full flex flex-col gap-6"}>
					{/* Header */}
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					{/* Render each field */}
					{fields.map((definedField) => (
						<FormField
							key={definedField.name}
							control={form.control}
							name={definedField.name}
							render={({field}) => (
								<FormItem>
									<FormLabel>{definedField.label}</FormLabel>
									<FormControl>
										<Input type={definedField.type}
										       autoComplete={definedField.autoComplete}
										       placeholder={definedField.placeholder}
										       {...field}
										/>
									</FormControl>
									{definedField.description &&
										<FormDescription>{definedField.description}</FormDescription>}
									<FormMessage/>
								</FormItem>
							)}
						/>
					))}

					<DialogFooter>
						<Button type="submit">{submitLabel}</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

export default DialogForm;