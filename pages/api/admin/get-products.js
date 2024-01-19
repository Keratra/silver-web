import axios from 'axios';

export default async function getProducts(req, res) {
	try {
		const { page, search } = req.query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${page}`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				search: search ?? '',
				page_size: 10,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				// data: {
				// 	search: search ?? '',
				// },
				// params: {
				// 	search: search?.toLowerCase() ?? '',
				// },
				// paramsSerializer: (params) => JSON.stringify(params),
			}
		);

		console.log(data);

		res.status(200).json(data);
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		res.status(error?.response?.status || 500).json({
			message:
				error?.response?.data?.message || error || 'Something went wrong',
		});
	}
}
