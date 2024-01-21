import Layout from '@components/Layout';
import Product from '@components/Product';
import SizeSelector from '@components/SizeSelector';
import Searchy from '@components/Searchy';
import { Autocomplete, Button, Grid, Link, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminProducts({
	queryPage,
	queryCategories,
	querySearch,
	categoryLabels,
	raw_categories,
	number_of_pages,
	errorMessage,
}) {
	const { data, error } = useSWR(
		`/api/admin/get-products?page=${queryPage ?? 1}&categories=${queryCategories ?? []}&search=${
			querySearch ?? ''
		}`,
		fetcher
	);

	const Router = useRouter();

	const [productSize, setProductSize] = useState(3);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage ?? 1);
	const [selectedCategories, setSelectedCategories] = useState(JSON.parse("[" + queryCategories + "]") ?? []);

	if (error) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
	}

	if (!data)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-orange-500 text-2xl font-['Roboto']">
					Loading...
				</div>
			</Layout>
		);

	if (!!data.message) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
	}

	const { products } = data;

	const handleSearch = () => {
		Router.push({
			pathname: '/admin/products',
			query: {
				page: 1,
				categories: selectedCategories ?? [],
				search: searchValue.toLowerCase() ?? '',
			},
		});
	};

	const handlePageChange = async (event, value) => {
		setPage(value);
		Router.push({
			pathname: '/admin/products',
			query: {
				page: value ?? 1,
				categories: selectedCategories ?? [],
				search: searchValue.toLowerCase() ?? '',
			},
		});
	};

	const handleDelete = async (id) => {
		if (confirm('Are you sure want to delete this product?')) {
			try {
				await axios.post('/api/admin/delete-product', {
					id,
				});

				Router.reload();
				notify('success', 'Product successfully deleted');
			} catch (error) {
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
				notify('error', 'An error occured whilst deleting the product');
			}
		}
	};

	const handleCategoriesChange = (newValue) => {
		setSelectedCategories(newValue);
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

	return (
		<Layout>
			<div className={`px-4 lg:px-12`}>
				<section
					className={`grid grid-cols-1 md:grid-cols-3 place-items-center mt-6 mb-3`}
				>
					<h1
						className={`col-span-1 place-self-start font-semibold text-xl lg:text-3xl drop-shadow-md`}
					>
						Products
					</h1>

					<NextLink href='/admin/create' passHref>
						<Link className={`no-underline`}>
							<span
								className={`
									col-span-1
									py-2 px-3 rounded-md
									bg-slate-700 hover:bg-slate-600
									text-white text-base lg:text-xl tracking-wider
									shadow-md font-medium
									uppercase transition-colors
								`}
							>
								NEW PRODUCT
							</span>
						</Link>
					</NextLink>

					<SizeSelector
						productSize={productSize}
						setProductSize={setProductSize}
						className=' col-span-1 hidden lg:block place-self-end '
					/>
				</section>

				<section className='mb-6 grid grid-cols-12 gap-2'>
					<div className='col-span-6 bg-white flex justify-center items-center gap-4 '>
						<Autocomplete
							multiple
							id='categories-choose'
							className='flex-grow'
							options={raw_categories.map(({ id, name }) => id)}
							getOptionLabel={(option) => raw_categories[option - 1]?.name}
							value={selectedCategories}
							onChange={(e, newValue) => {
								console.log(e);
								handleCategoriesChange(newValue);
							}}
							disabled={raw_categories.length === 0}
							renderInput={(params) => (
								<TextField
									{...params}
									label={
										raw_categories.length !== 0 ? 'Chosen Categories' : 'No Categories Found'
									}
									placeholder='Choose categories...'
								/>
							)}
						/>
					</div>

					<div className='col-span-6'>
					<Searchy
						value={searchValue}
						handleSearchChange={(e) => setSearch(() => e.target.value)}
						onSearchSubmit={handleSearch}
					/>
					</div>
				</section>

				<Grid
					container
					spacing={2}
					direction='row'
					justifyContent='center'
					alignItems='center'
					className=''
				>
					{products.map((product) => (
						<Grid item md={productSize} key={product.id}>
							<Product
								product={product}
								size={productSize}
								categories={categoryLabels}
								fabFunc={() => handleDelete(product.id)}
								adminView
							/>
						</Grid>
					))}
					{!!products && products.length === 0 && (
						<div className='w-full my-12 flex justify-center items-center'>
							<h1 className='text-2xl font-light text-red-500'>
								No products found...
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
		const { page, categories: selectedCategories, search } = query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;
		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL}/admin/products`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataMaxPage } = await axios.get(backendURLmaxPage, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				search: search ?? '',
				categories: selectedCategories ?? [],
				page_size: 10,
			},
		});

		const categoryLabels = data?.categories.map(({ id, name }) => name);

		const { page_number } = dataMaxPage;

		return {
			props: {
				queryPage: parseInt(page) ?? 1,
				querySearch: search ?? '',
				queryCategories: selectedCategories ?? [],
				categoryLabels,
				raw_categories: data?.categories ?? [],
				number_of_pages: page_number,
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
				queryCategories: [],
				categoryLabels: [],
				raw_categories: [],
				number_of_pages: 1,
				errorMessage: 'An error occured.',
			},
		};
	}
}
