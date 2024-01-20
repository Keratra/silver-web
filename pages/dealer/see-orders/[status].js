import Layout from '@components/Layout';
import Searchy from '@components/Searchy';
import { Link, Pagination, Stack, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState } from 'lib';
import { ORDER_CATEGORIES } from 'utils/constants';
import { OrderDisplayCard } from '@components/OrderDisplayCard';
import { OrderNavigation } from '@components/OrderNavigation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';

function handleFilterChange({ Router, startDate, endDate }) {
	Router.push({
		pathname: '/dealer/see-orders/' + Router.query.status,
		query: {
			page: 1,
			search: '',
			startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
			endDate:
				endDate.toISOString().split('T')[0] ??
				new Date().toISOString().split('T')[0],
		},
	});
}

export default function DealerOrdersPage({
	queryStatus,
	queryPage,
	querySearch,
	queryIsNameSearch,
	queryStartDate,
	queryEndDate,
	orders,
	number_of_pages,
	error,
}) {
	const Router = useRouter();

	const [startDate, setStartDate] = useState(new Date(queryStartDate));
	const [endDate, setEndDate] = useState(new Date(queryEndDate));

	const [selectedOrders, setSelectedOrders] = useState([]);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage);
	const [isNameSearch, setSearchType] = useState(queryIsNameSearch);

	useEffect(() => {
		handleFilterChange({
			Router,
			startDate,
			endDate,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startDate, endDate]);
	// don't add Router to the dependency array, it refreshes endlessly

	const handleSearch = async () => {
		Router.push({
			pathname: '/dealer/see-orders/' + queryStatus,
			query: {
				page: 1,
				search: searchValue.toLowerCase() ?? '',
				isNameSearch: isNameSearch ?? true,
				startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
				endDate:
					endDate.toISOString().split('T')[0] ??
					new Date().toISOString().split('T')[0],
			},
		});
	};

	const handlePageChange = async (event, value) => {
		setPage(value);
		Router.push({
			pathname: '/dealer/see-orders/' + queryStatus,
			query: {
				page: value ?? 1,
				search: searchValue.toLowerCase() ?? '',
				isNameSearch: true,
				startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
				endDate:
					endDate.toISOString().split('T')[0] ??
					new Date().toISOString().split('T')[0],
			},
		});
	};

	if (error) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className={``}>
				<OrderNavigation
					user='dealer'
					highlight={queryStatus}
					classExtension='mx-2 my-1'
				/>

				<section className=' mx-2 my-1 '>
					<div
						className='
            grid grid-cols-2 lg:grid-cols-4 gap-2 gap-y-4
						p-3.5
            bg-white border-neutral-200
            rounded-sm  shadow-md '
					>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DatePicker
								label='Başlangıç Tarihi'
								value={new Date(startDate)}
								onChange={(newValue) => {
									setStartDate(newValue.toDate());
								}}
								renderInput={(params) => <TextField {...params} />}
							/>

							<DatePicker
								label='Bitiş Tarihi'
								value={new Date(endDate)}
								onChange={(newValue) => {
									setEndDate(newValue.toDate());
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>

						<div className='col-span-2 flex items-center'>
							<Searchy
								forOrders
								value={searchValue}
								handleSearchChange={(e) => setSearch(() => e.target.value)}
								searchType={isNameSearch}
								handleSearchTypeChange={(e) =>
									setSearchType(() => e.target.value)
								}
								onSearchSubmit={handleSearch}
								className={'flex-grow'}
							/>
						</div>
					</div>
				</section>

				<section className='mx-2'>
					<OrderDisplayCard orders={orders} forDealers />
				</section>

				<Stack spacing={2} className='flex justify-center items-center my-6'>
					<Pagination
						count={number_of_pages}
						page={parseInt(page)}
						onChange={handlePageChange}
						variant='outlined'
						shape='rounded'
						size='large'
						showFirstButton
						showLastButton
					/>
				</Stack>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const status = query?.status ?? 'WAIT';
		const page = query?.page ?? 1;
		const search = query?.search ?? '';
		const isNameSearch = query?.isNameSearch ?? true;
		const startDate = query?.startDate ?? null;
		const endDate = query?.endDate ?? null;

		const token = req.cookies.token;

		const modifiedEndDate = !!endDate
			? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
					.toISOString()
					.split('T')[0]
			: null;

		const searchName =
			isNameSearch === 'true' || isNameSearch === true ? true : false;

		const order_status = ORDER_CATEGORIES[status];

		const queryData = {
			id_search: !searchName ? search : '',
			product_search: !!searchName ? search : '',
			order_status,
			start_date: startDate ?? '2022-01-01',
			end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
		};

		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/orders-max-pages`;
		const { data: dataMaxPage } = await axios.post(
			backendURLmaxPage,
			queryData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const { number_of_pages } = dataMaxPage;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/orders/${page}`;
		const { data: dataOrders } = await axios.post(backendURL, queryData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { orders, dealer_name } = dataOrders;

		return {
			props: {
				queryStatus: status,
				queryPage: parseInt(page) ?? 1,
				querySearch: search ?? '',
				queryIsNameSearch: isNameSearch ?? true,
				queryStartDate: startDate ?? '2022-01-01',
				queryEndDate: endDate ?? new Date().toISOString().split('T')[0],
				orders,
				number_of_pages,
			},
		};
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		return {
			props: {
				queryStatus: 'WAIT',
				queryPage: 1,
				querySearch: '',
				queryIsNameSearch: true,
				queryStartDate: '2022-01-01',
				queryEndDate: new Date().toISOString().split('T')[0],
				orders: [],
				number_of_pages: 1,
				error: true,
			},
		};
	}
}
