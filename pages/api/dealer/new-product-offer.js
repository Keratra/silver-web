import axios from 'axios';
import FormData from 'form-data';

export default async function createProduct(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/new-product/offer`;

		const { product_id } = req.body;

		const formData = new FormData();

		formData.append('product_id', product_id);

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
