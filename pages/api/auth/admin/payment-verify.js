import axios from 'axios';
import FormData from 'form-data';

export default async function verify(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/payment/verify`;

		const token = req.cookies.token;

		const { password } = req.body;

		const formData = new FormData();

		formData.append('balance_password', password);

		const { data } = await axios.post(backendURL, formData, {
			headers: {
				Authorization: `Bearer ${token}`,
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
