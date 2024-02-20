// Get the full URL using the env variable for the API URL
import {toast} from "sonner";

export function getURL(path) {
	return process.env.NEXT_PUBLIC_API_URL + path;
}

// apiFetch is responsible for making HTTP requests to the API in a consistent manner
export function apiFetch(method, path = "/", body, options = {}) {
	// Log the details for debugging
	console.debug("API Request:", method, path, body, options);

	// Get the full URL for the request
	const url = getURL(path);

	// Prepare the fetch request
	// The 'credentials' option is set to 'include' to ensure cookies are sent to the API,
	// as we are using HTTP-only cookies for security
	const fetchOptions = {
		method,
		headers: {
			"Content-Type": "application/json", // We always send JSON to the API
			...options.headers, // additional headers can be provided in the options
		},
		body: body ? JSON.stringify(body) : undefined, // Convert the body to JSON if provided
		credentials: "include", // Include cookies in the request
	};

	// Execute the request
	return fetch(url, fetchOptions)
		.then(async res => {
			// Check if body is JSON
			const contentType = res.headers.get("content-type");
			const isJson = contentType?.includes("application/json");

			// Parse the response based on the content type
			const data = isJson ? await res.json() : await res.text();

			// If the response is successful, return the parsed data, otherwise reject the promise with the error data from the API
			if (res.ok) {
				return data;
			} else {
				return Promise.reject({
					api: true,
					...data // spread the data into the error object for easier access
				});
			}
		})
		.catch(error => {
			// This block is responsible as the final catch for any errors that occur during the request.

			// Define the default error data
			let errData = {
				code: "INTERNAL_SERVER_ERROR",
				message: error.message || "An unexpected error occurred",
				details: null,
			};

			// If the error returns an error code, use it instead of the default
			if (error?.api) {
				errData = error;
			}

			// Log the error for debugging
			console.error("API Error:", errData);

			// If the 'notify' option is enabled, send a toast notification
			if (options.notify) {
				toast.error(errData.message); // Send a toast as a notification of the error
			}

			// Return the error data
			return Promise.reject(errData);
		});
}


export const apiQuery = async ({queryKey}) => apiFetch("GET", queryKey[0], null, {
	notify: queryKey[1] === "notify", // Enable notifications for "notify" queries
});