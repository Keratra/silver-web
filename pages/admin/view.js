import Layout from '@components/Layout';
import Product from '@components/Product';
import DealerSelector from '@components/DealerSelector';
import Searchy from '@components/Searchy';
import {
	Box,
	Button,
	Card,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Pagination,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { loadState } from 'lib';
import { notify } from 'utils/notify';

function handleFilterChange({ Router, selectedDealer, setPage, setSearch }) {
	setPage(() => 1);
	setSearch(() => '');
	Router.push({
		pathname: '/admin/view',
		query: {
			page: 1,
			search: '',
			selectedDealer: selectedDealer ?? 1,
		},
	});
}

export default function View({
	queryPage,
	querySearch,
	querySelectedDealer,
	data,
	dealer,
	dealers,
	categoryLabels,
	number_of_pages,
	errorMessage,
}) {
	const Router = useRouter();

	const [selectedDealer, setSelectedDealer] = useState(
		querySelectedDealer ?? ''
	);

	const [productSize, setProductSize] = useState(3);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage ?? 1);

	useEffect(() => {
		handleFilterChange({
			Router,
			selectedDealer,
			setPage,
			setSearch,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDealer]);
	// don't add Router to the dependency array, it refreshes endlessly

	const { dealer_products: products } = data;

	const handlePriceChange = async (product_id, selectedDealer) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer/update-price`;

			const { token } = loadState('token');

			let newPrice = prompt('Ürünün yeni fiyatını girin');

			while (!/^[+-]?\d+(\.\d+)?$/.test(newPrice)) {
				if (newPrice === null) throw 'Kera - Action cancelled by user';
				newPrice = prompt(
					'Ürünün yeni fiyatını girin (geçerli bir sayı girin)'
				);
			}

			newPrice = parseFloat(newPrice);

			const formData = new FormData();

			formData.append('product_id', product_id);
			formData.append('dealer_id', selectedDealer);
			formData.append('price', newPrice);

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			Router.reload();
		} catch (error) {
			notify('error', 'Fiyat değiştirilemedi.');
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		}
	};

	const handleDealerChange = (e) => {
		setSelectedDealer(e.target.value);
	};

	const handleSearch = async () => {
		Router.push({
			pathname: '/admin/view',
			query: {
				page: 1,
				search: searchValue.toLowerCase() ?? '',
				selectedDealer,
			},
		});
	};

	const handlePageChange = async (event, value) => {
		setPage(value);
		Router.push({
			pathname: '/admin/view',
			query: {
				page: value ?? 1,
				search: searchValue.toLowerCase() ?? '',
				selectedDealer,
			},
		});
	};

	if (!!errorMessage) {
		return (
			<Layout>
				<div className='flex justify-center items-center mt-12'>
					{errorMessage}
				</div>
			</Layout>
		);
	}

	const classInfoTitle = ' font-medium text-slate-800 mr-1 select-none ';

	return (
		<Layout>
			<div className={`px-4 lg:px-12`}>
				<section
					className='
            mt-6
            bg-white
            rounded-sm
          '
				>
					<DealerSelector
						title='Customers'
						emptyOptionTitle='Select a customer...'
						dealers={dealers}
						selectedDealer={selectedDealer}
						handleDealerChange={handleDealerChange}
					/>
				</section>

				{!selectedDealer && (
					<Card className=' mt-4 mb-6 p-2 bg-transparent shadow-none text-white '>
						<div
							className={`mt-12 font-light text-center text-2xl text-orange-600 drop-shadow-md`}
						>
							Please select a customer.
						</div>
					</Card>
				)}

				{!!selectedDealer && (
					<>
						<section className='mt-4'>
							<Searchy
								value={searchValue}
								handleSearchChange={(e) => setSearch(() => e.target.value)}
								onSearchSubmit={handleSearch}
							/>
						</section>
						<section
							className='
								p-4
							'
						>
							<div className='flex flex-wrap justify-center items-center gap-4 text-sm md:text-base text-slate-800'>
								<span className='p-2 rounded-sm shadow-md bg-white '>
									<span className={classInfoTitle}>Ad:</span> {dealer?.name}
								</span>
								<span className='p-2 rounded-sm shadow-md bg-white '>
									<span className={classInfoTitle}>E-posta:</span>{' '}
									{dealer?.email}
								</span>
								<span className='p-2 rounded-sm shadow-md bg-white '>
									<span className={classInfoTitle}>Telefon:</span>{' '}
									{dealer?.phone}
								</span>
								<span className='p-2 rounded-sm shadow-md bg-white'>
									<span className={classInfoTitle}>Adres:</span>{' '}
									{dealer?.address}, {dealer?.city} / {dealer?.country}
								</span>
							</div>
						</section>
					</>
				)}

				{!!selectedDealer && (
					<section className=''>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='flex-start'
							alignItems='center'
							className='px-4 md:px-2 xl:px-0'
						>
							{products.map((product) => (
								<Grid item sm={6} md={productSize} key={product.product_id}>
									<Product
										product={product}
										size={productSize}
										categories={categoryLabels}
										handlePriceChange={handlePriceChange}
										selectedDealer={selectedDealer}
										hasPrice
									/>
								</Grid>
							))}
							{!!products && products.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-200'>
										Herhangi bir ürün bulamadı.
									</h1>
								</div>
							)}
						</Grid>
					</section>
				)}

				{!!selectedDealer && (
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
				)}

				{/* <Box className={`mx-2 mt-6`}>
						<section className={`mt-6 mb-3 flex`}>
							<h1 className={`flex-grow font-semibold text-3xl`}>
							{!!selectedBayi
								? selectedBayi.name + ' Ürünleri'
								: 'Bütün Ürünler'}
							</h1>
							<SizeSelector
							productSize={productSize}
							setProductSize={setProductSize}
							/>
						</section>
						<Grid container spacing={2}>
							{!!selectedBayi &&
							data.products.map((product) => (
								<Grid item md={productSize} key={product.name}>
								<Product product={product} />
								</Grid>
							))}
						</Grid>
					</Box> */}
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const { page, search, selectedDealer } = query;
		const token = req.cookies.token;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer/${
			selectedDealer === '' ? 1 : selectedDealer ?? 1
		}/products/${page ?? 1}`;

		const { data } = await axios.post(
			backendURL,
			{
				search: search ?? '',
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const backendURLDealer = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer/${
			selectedDealer === '' ? 1 : selectedDealer ?? 1
		}`;

		const { data: dealerData } = await axios.get(backendURLDealer, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLDealers = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer-names`;

		const { data: dealersData } = await axios.get(backendURLDealers, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLCategories = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;

		const { data: categoryData } = await axios.get(backendURLCategories, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLmaxPage = `${
			process.env.NEXT_PUBLIC_API_URL
		}/admin/dealer/${selectedDealer === '' ? 1 : selectedDealer ?? 1}/products`;

		const { data: dataMaxPage } = await axios.get(backendURLmaxPage, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				search: search ?? '',
			},
		});

		const categoryLabels = categoryData?.categories.map(({ id, name }) => name);

		const { number_of_pages } = dataMaxPage;

		return {
			props: {
				queryPage: parseInt(page) ?? 1,
				querySearch: search ?? '',
				querySelectedDealer: selectedDealer ?? null,
				data,
				dealer: dealerData,
				dealers: dealersData.dealer_names,
				categoryLabels,
				number_of_pages: number_of_pages,
				errorMessage: '',
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
				queryPage: 1,
				querySearch: '',
				data: {},
				dealer: {},
				dealers: [],
				querySelectedDealer: null,
				categoryLabels: [],
				number_of_pages: 1,
				errorMessage: 'An error occured.',
			},
		};
	}
}
