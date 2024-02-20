import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {z} from "zod"

export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

// process all the form errors returned from the API
export function formErrors(form, res) {
	// Iterate through any fields provided in the error details and set errors on the form
	for (const field of res?.details?.fields || []) { // if undefined use an empty array to avoid additional errors
		form.setError(field.name, {
			type: "manual", // required when setting errors manually
			message: field.errors.join("|"), // join all errors for a field into one string
		});
	}
}

// get the default values for a form based on the fields provided
export function getFieldDefaults(fields) {
	return fields.reduce((acc, {name, defaultValue}) => {
		acc[name] = defaultValue || "";
		return acc;
	}, {});
}

export function getZodValidationSchema(fields) {
	// create a new zod object schema
	let zodSchema = {};

	// iterate through the fields and use the validate attribute to attach the validation to the zod schema
	fields.map((field) => {
		if (field.validate) {
			zodSchema[field.name] = field.validate;
		}
	})

	// return a zod object schema with the fields
	return z.object(zodSchema);
}