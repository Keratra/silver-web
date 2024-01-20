import axios from 'axios';
import FormData from 'form-data';
import { ORDER_CATEGORIES } from 'utils/constants';

// ORDER_CATEGORIES = {
//   WAIT: 'Bekliyor',
//   PREP: 'Hazırlanıyor',
//   CARG: 'Kargoya Verildi',
//   DELI: 'Teslim Edildi',
//   CANC: 'İptal Edildi',
// };

export default async function getDealerOrders(req, res) {
	try {
		console.log('\n< ' + new Date().toTimeString().split(' ')[0] + ' >');

		const { query } = req;

		const status = req.query?.status;
		const page = query?.page ?? '1';
		const search = query?.search ?? '';
		const isNameSearch = query?.isNameSearch ?? true;
		const startDate = query?.startDate ?? null;
		const endDate = query?.endDate ?? null;

		const token = req.cookies.token;

		console.table({
			status,
			page,
			search,
			isNameSearch,
			startDate,
			endDate,
		});

		const modifiedEndDate = !!endDate
			? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
					.toISOString()
					.split('T')[0]
			: null;

		const searchName =
			isNameSearch === 'true' || isNameSearch === true ? true : false;

		const formData = new FormData();
		formData.append('id_search', !searchName ? search : '');
		formData.append('product_search', !!searchName ? search : '');
		formData.append('order_status', ORDER_CATEGORIES.WAIT);
		formData.append('start_date', startDate ?? '2022-01-01');
		formData.append(
			'end_date',
			modifiedEndDate ?? new Date().toISOString().split('T')[0]
		);

		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders-max-page`;
		const { data: dataMaxPage } = await axios.post(
			backendURLmaxPage,
			{
				dealer_search: !searchName ? search : '',
				product_search: !!searchName ? search : '',
				order_status: ORDER_CATEGORIES.WAIT,
				start_date: startDate ?? '2022-01-01',
				end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const { page_number: number_of_pages } = dataMaxPage;
		
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${page}`;
		const { data: dataOrders } = await axios.post(
			backendURL,
			{
				id_search: !searchName ? search : '',
				product_search: !!searchName ? search : '',
				order_status: ORDER_CATEGORIES.WAIT,
				start_date: startDate ?? '2022-01-01',
				end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		// queryPage: page || 1,
		// querySearch: search || '',
		// queryIsNameSearch: isNameSearch ?? true,
		// queryStartDate: startDate ?? '2022-01-01',
		// queryEndDate: endDate ?? new Date().toISOString().split('T')[0],

		// props: {
		//   queryPage: 1,
		//   querySearch: '',
		//   queryIsNameSearch: true,
		//   queryStartDate: '2022-01-01',
		//   queryEndDate: new Date().toISOString().split('T')[0],
		//   data: {},
		//   number_of_pages: 1,
		//   error: true,
		// },

		const data = {
			orders: dataOrders.orders,
			maxPage: number_of_pages,
		};

		res.status(200).json(data);
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		res.status(error.response?.status || 500).json({
			message:
				error?.response?.data?.message || error || 'Something went wrong',
		});
	}
}
