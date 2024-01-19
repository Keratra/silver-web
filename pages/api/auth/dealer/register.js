import axios from 'axios';
import FormData from 'form-data';
import { saveCookie } from 'lib';

export default async function register(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/register`;

		const { invite_key, name, address, city, country, phone, email, password } =
			req.body;

		const formData = new FormData();

		formData.append('invite_key', invite_key);
		formData.append('name', name);
		formData.append('address', address);
		formData.append('city', city);
		formData.append('country', country);
		formData.append('phone', phone);
		formData.append('email', email);
		formData.append('password', password);

		const { data } = await axios.post(backendURL, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
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
