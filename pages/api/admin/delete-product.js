import axios from 'axios';
import FormData from 'form-data';

export default async function deleteProduct(req, res) {
	try {
		const token = req.cookies.token;

		const { id } = req.body;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/delete/${id}`;

		const { data } = await axios.delete(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
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
