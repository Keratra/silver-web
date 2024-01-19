import axios from 'axios';
import FormData from 'form-data';
import { ORDER_CATEGORIES } from 'utils/constants';

export default async function getProducts(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`;

		const token = req.cookies.token;

		const formData = new FormData();

		formData.append('order_status', ORDER_CATEGORIES.PREP);
		// formData.append('dealer_id', 1);
		// formData.append('start_date', '2020-01-01');
		// formData.append('end_date', '2024-01-01');
		formData.append('dealer_id', '');
		formData.append('start_date', '');
		formData.append('end_date', '');

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
