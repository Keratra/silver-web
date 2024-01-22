import Layout from '@components/Layout';
import Product from '@components/Product';
import SizeSelector from '@components/SizeSelector';
import Searchy from '@components/Searchy';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogContent,
	Fab,
	Grid,
	IconButton,
	Link,
	Pagination,
	Stack,
	TextareaAutosize,
	TextField,
	Typography,
} from '@mui/material';
import { FiTrash, FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useState, useReducer, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import { loadState, saveState, formatPrice, parseJwt, fetcher, reducer } from 'lib';
import { productCartModel } from 'lib/yupmodels';
import { CART, CART_ACTIONS } from 'utils/constants';
import { Formik } from 'formik';
import Badge from '@mui/material/Badge';
import { notify } from 'utils/notify';
import { v4 as uuidv4 } from 'uuid';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";

const InfoBox = ({ title, info, colSpan = '1' }) => (
	<Box
		className={`
      col-span-full md:col-span-${colSpan}
      p-2 sm:p-6 rounded-md
      hover:scale-[105%]
      bg-slate-50
      shadow-md
      text-center break-words
      transition-all
    `}
	>
		<Typography
			className={`
        sm:-mt-3 mb-2 sm:mb-4 sm:-ml-2
        font-light text-md text-left
        text-amber-800
      `}
		>
			{title}
		</Typography>
		<p
			className={`
        mt-1 sm:mt-3 mb-1 sm:mb-3
        text-md text-center
      `}
		>
			{info}
		</p>
	</Box>
);

export default function DealerProductsPage({
	queryPage,
	queryCategories,
	querySearch,
	categories,
	categoryLabels,
	number_of_pages,
	errorMessage,
}) {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});

	const [productSize, setProductSize] = useState(3);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage ?? 1);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState({ showSkeleton: true });
	const [selectedCategories, setSelectedCategories] = useState(JSON.parse("[" + queryCategories + "]") ?? []);

	const [user, setUser] = useState(false);

	useEffect(() => {
		const token = loadState('token')?.token;
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
			if (parseJwt(token)?.sub?.user_type === 'admin') {
				setUser(() => "admin");
			}
		}
	}, []);

	useEffect(() => {
		if (selected.showSkeleton) return;

		const fetchData = async () => {
			try {
				const response = await fetch(`/api/dealer/get-a-product?id=${selected?.id}`);
				const data = await response.json();
			} catch (error) {
				console.error('Error fetching product information:', error);
			}
		};

		fetchData();
	}, [selected]);

	const Router = useRouter();

	const { data, error } = useSWR(
		`/api/dealer/get-products?page=${queryPage ?? 1}&categories=${queryCategories ?? []}&search=${
			querySearch ?? ''
		}`,
		fetcher
	);
	// TEMPORARY ERROR and LOADING screen RETURNS
	if (error)
		return (
			<Layout fullWidth>
			<div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex justify-between items-center select-none'>
				<NextLink href='/' passHref>
				<Link className='no-underline'>
				<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				</Link>
				</NextLink>
				<nav className='w-full flex justify-end items-center flex-wrap'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>
				</nav>
			</header>
			</div>
				<div className="w-full min-h-screen mt-12 flex justify-start items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
	if (!data)
		return (
			<Layout fullWidth>
			<div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex justify-between items-center select-none'>
				<NextLink href='/' passHref>
				<Link className='no-underline'>
				<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				</Link>
				</NextLink>
				<nav className='w-full flex justify-end items-center flex-wrap'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>
				</nav>
			</header>
			</div>
				<div className="w-full min-h-screen mt-12 flex justify-center items-center text-neutral-700 text-4xl font-['Roboto']">
					Loading...
				</div>
			</Layout>
		);

	if (!!data.message) {
		return (
			<Layout fullWidth>
			<div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex justify-between items-center select-none'>
				<NextLink href='/' passHref>
				<Link className='no-underline'>
				<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				</Link>
				</NextLink>
				<nav className='w-full flex justify-end items-center flex-wrap'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>
				</nav>
			</header>
			</div>
				<div className="w-full min-h-screen mt-12 flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
	}

	const { products } = data;

	const handleAdd = async (values, { setSubmitting }) => {
		try {
			const { amount } = values;

			notify('info', amount + ' ' + selected?.name + ' added to cart.');

			if (amount <= 0) {
				notify('warning', 'Please enter a valid amount.');
				return;
			}

			dispatch({
				type: CART_ACTIONS.ADD,
				newProduct: selected,
				amount,
			});
		} catch (error) {
			notify('error', 'Failed to add product to cart.');
		} finally {
			// console.log(loadState(CART).products);
			handleClose();
			setSubmitting(false);
		}
	};

	const handleSearch = async () => {
		Router.push({
			pathname: '/dealer',
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
			pathname: '/dealer',
			query: {
				page: value ?? 1,
				categories: selectedCategories ?? [],
				search: searchValue.toLowerCase() ?? '',
			},
		});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCategoriesChange = (newValue) => {
		setSelectedCategories(newValue);
	};

	if (!!errorMessage) {
		return (
			<Layout fullWidth>
				<header className='bg-white border-0 border-b border-solid border-neutral-300 container mx-auto py-2 px-4 flex justify-between items-center select-none'>
				<NextLink href='/' passHref>
				<Link className='no-underline'>
				<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				</Link>
				</NextLink>
				<nav className='w-full flex justify-end items-center flex-wrap'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>
				</nav>
			</header>
				<div className='flex justify-center items-center mt-12'>
					{errorMessage}
				</div>
			</Layout>
		);
	}

	return (
		<Layout fullWidth>	
			<div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex flex-col sm:flex-row justify-between items-center select-none'>
				<NextLink href='/' passHref>
				<Link className='no-underline'>
				<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				</Link>
				</NextLink>
				<nav className='w-full flex justify-center sm:justify-end items-center flex-wrap ml-2'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>

					<NextLink href='/dealer/cart' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiShoppingCart size={24} className='' /> Cart 
								{Object.values(state.cart ?? [])
									.map((elem) => elem[1])
									.reduce((partialSum, a) => partialSum + a, 0) !== 0 ? (
									<span className=' text-slate-900'>
										(
										{Object.values(state.cart ?? [])
											.map((elem) => elem[1])
											.reduce((partialSum, a) => partialSum + a, 0)}
										)
									</span>
								) : null}
							</span>
						</Link>
					</NextLink>

					{!!user ? ( user === "admin" ? (
						<NextLink href='/admin/settings' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
							) : (
						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						)) : (
						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center  gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiLogin size={24} className='' /> Login
								</span>
							</Link>
						</NextLink>
						)}
				</nav>
			</header>
			</div>
			<div className={`max-w-7xl mx-auto px-2 md:px-6 min-h-screen`}>
				<section className={`mb-3 flex justify-between items-center`}>
					<h1 className={`font-medium text-xl md:text-2xl`}>
						<span className='ml-1 pb-1'>
							<NextLink href='/dealer/cart' passHref>
								<Link className={`no-underline transition-colors  flex items-center gap-x-2`}>
									<Badge
										badgeContent={Object.values(state?.cart ?? []).length}
										color='secondary'
										className='mb-1 text-black flex items-center gap-x-2'
									>
										<FiShoppingBag size={24} className='text-black' />
									</Badge>
								</Link>
							</NextLink>
						</span>
					</h1>

					<SizeSelector
						productSize={productSize}
						setProductSize={setProductSize}
						className='hidden md:block'
					/>
				</section>

				<section className='mb-6 grid grid-cols-6 sm:grid-cols-12 gap-2'>
					<div className='col-span-6 bg-white flex justify-center items-center gap-4 '>
						<Autocomplete
							multiple
							id='categories-choose'
							className='flex-grow'
							options={categories.map(({ id, name }) => id)}
							getOptionLabel={(option) => categories[option - 1]?.name}
							value={selectedCategories}
							onChange={(e, newValue) => {
								console.log(e);
								handleCategoriesChange(newValue);
							}}
							disabled={categories.length === 0}
							renderInput={(params) => (
								<TextField
									{...params}
									label={
										categories.length !== 0 ? 'Chosen Categories' : 'No Categories Found'
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
					spacing={1}
					direction='row'
					justifyContent='center'
					alignItems='center'
					className='px-0.5 md:px-1.5 xl:px-0 mb-4'
				>
					{products.map((product, i) => (
						<Grid item xs={6} sm={6} md={productSize} key={i}>
							<Product
								product={product}
								size={productSize}
								categories={categoryLabels}
								fabFunc={() => {
									handleClickOpen();
									setSelected(() => product);
								}}
								hasPrice
								forCart
							/>
						</Grid>
					))}
					{!!products && products.length === 0 && (
						<div className='w-full my-12 flex justify-center items-center'>
							<h1 className='text-2xl font-light text-red-500'>
								No products found.
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


				<Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
					<DialogContent className=' p-4 '>
						<section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div>
								<Product product={{ id: selected.id, image: selected.image }} sendOnlyImage />
							</div>
							<div className='grid grid-cols-2 gap-4'>
								<InfoBox title='Product Name' info={selected.name} colSpan='2' />
								<InfoBox title='Price' info={formatPrice(selected.price)} colSpan='1' />
								<InfoBox title='Category' info={categoryLabels[parseInt(selected.category_id) - 1]} colSpan='1' />
								<InfoBox title='Description' info={selected.description} colSpan='2' />
							</div>
						</section>
						<div className='mt-6'>
						<Formik
								initialValues={productCartModel.initials}
								validationSchema={productCartModel.schema}
								onSubmit={handleAdd}
							>
								{({
									values,
									errors,
									touched,
									handleChange,
									handleSubmit,
									isSubmitting,
								}) => (
									<form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-6 content-center place-content-center `} >
										<TextField
											id='amount'
											name='amount'
											label='Quantity'
											type='number'
											placeholder='Enter the quantity...'
											fullWidth
											value={values.amount}
											onChange={handleChange}
											error={touched.amount && Boolean(errors.amount)}
											helperText={touched.amount && errors.amount}
											InputProps={{
												style: {
													fontSize: '24px',
													textAlign: 'center',
												},
											}}
										/>

										<Button
											variant='contained'
											color='primary'
											size='large'
											type='submit'
											className={`bg-[#212021] hover:bg-gray-600 font-medium text-sm sm:text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											Add to Cart
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const { page, categories: selectedCategories, search } = query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/categories`;
		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/products`;
		
		const token = req.cookies.token;

		const { data } = await axios.get(backendURL);

		const { data: dataMaxPage } = await axios.get(backendURLmaxPage, {
			data: {
				search: search ?? '',
				categories: selectedCategories ?? [],
				page_size: 10,
			},
		});

		const categoryLabels = data?.categories.map(({ id, name }) => name);

		const { number_of_pages } = dataMaxPage;

		return {
			props: {
				queryPage: page || 1,
				querySearch: search || '',
				queryCategories: selectedCategories ?? [],
				categories: data?.categories ?? [],
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
				queryCategories: [],
				categories: [],
				categoryLabels: [],
				number_of_pages: 1,
				errorMessage: 'An error occured.',
			},
		};
	}
}
