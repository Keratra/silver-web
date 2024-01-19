import axios from 'axios';

export default async function getProducts(req, res) {
	try {
		const { page, search } = req.query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/products/${page}`;
		// const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/products`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				search: search ?? '',
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
