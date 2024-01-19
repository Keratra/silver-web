import Layout from '@components/Layout';
import Product from '@components/Product';
import SizeSelector from '@components/SizeSelector';
import Searchy from '@components/Searchy';
import { Grid, Pagination, Stack } from '@mui/material';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import { loadState } from 'lib';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DealerNewProductsPage({
	queryPage,
	querySearch,
	categoryLabels,
	number_of_pages,
	errorMessage,
}) {
	const { data, error } = useSWR(
		`/api/dealer/get-new-products?page=${queryPage ?? 1}&search=${
			querySearch ?? ''
		}`,
		fetcher
	);

	const Router = useRouter();

	const [productSize, setProductSize] = useState(3);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage ?? 1);

	if (error)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					Bir hata oluştu.
				</div>
			</Layout>
		);
	if (!data)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-orange-500 text-2xl font-['Roboto']">
					Yükleniyor...
				</div>
			</Layout>
		);

	if (!!data.message) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					Bir hata oluştu.
				</div>
			</Layout>
		);
	}

	const { dealer_name: dealerName, new_products: products } = data;

	const handlePriceOffer = async (product_id) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/new-product/offer`;

			const { token } = loadState('token');

			const formData = new FormData();

			formData.append('product_id', product_id);

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			Router.replace('/dealer/new-products');
		} catch (error) {
			notify('error', 'Fiyat teklifi edilemedi.');
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		}
	};

	const handleSearch = async () => {
		Router.push({
			pathname: '/dealer/new-products',
			query: {
				page: 1,
				search: searchValue.toLowerCase() ?? '',
			},
		});
	};

	const handlePageChange = async (event, value) => {
		setPage(value);
		Router.push({
			pathname: '/dealer/new-products',
			query: {
				page: value ?? 1,
				search: searchValue.toLowerCase() ?? '',
			},
		});
	};

	return (
		<Layout>
			<div className={`px-2 md:px-12`}>
				<section className={`mb-3 flex justify-between items-center`}>
					<h1 className={`font-medium text-xl md:text-2xl`}>Yeni Ürünler</h1>

					<SizeSelector
						productSize={productSize}
						setProductSize={setProductSize}
						className='hidden md:block'
					/>
				</section>

				<section className='mb-6'>
					<Searchy
						value={searchValue}
						handleSearchChange={(e) => setSearch(() => e.target.value)}
						onSearchSubmit={handleSearch}
					/>
				</section>

				<Grid
					container
					spacing={2}
					direction='row'
					justifyContent='flex-start'
					alignItems='center'
				>
					{products.map((product) => (
						<Grid item md={productSize} key={product.id}>
							<Product
								product={product}
								size={productSize}
								categories={categoryLabels}
								fabFunc={() => handlePriceOffer(product.id)}
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
		const { page, search } = query;

		const token = req.cookies.token;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/product/categories`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL}/dealer/new-product-max-pages`;

		const { data: dataMaxPage } = await axios.get(backendURLmaxPage, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				search: search ?? '',
			},
		});

		const { categories } = data;

		const categoryLabels = categories.map(({ id, name }) => name);

		const number_of_pages = dataMaxPage?.max_pages;

		console.log(dataMaxPage);

		return {
			props: {
				queryPage: page || 1,
				querySearch: search || '',
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
				categoryLabels: [],
				number_of_pages: 1,
				errorMessage: 'Bir hata oluştu.',
			},
		};
	}
}
