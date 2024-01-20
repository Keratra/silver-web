import axios from 'axios';
import { saveCookie } from 'lib';

export default async function register(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/register`;

		const { name, address, city, country, phone, email, password } =
			req.body;


		const { data } = await axios.post(backendURL, {
			name,
			address,
			city,
			country,
			phone,
			email,
			password,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
