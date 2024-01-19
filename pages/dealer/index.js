import Layout from '@components/Layout';
import Product from '@components/Product';
import SizeSelector from '@components/SizeSelector';
import Searchy from '@components/Searchy';
import {
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
} from '@mui/material';
import { FiTrash, FiShoppingBag } from 'react-icons/fi';
import { useState, useReducer } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import { loadState, saveState, formatPrice } from 'lib';
import { productCartModel } from 'lib/yupmodels';
import { CART, CART_ACTIONS } from 'utils/constants';
import { Formik } from 'formik';
import Badge from '@mui/material/Badge';
import { notify } from 'utils/notify';
import { v4 as uuidv4 } from 'uuid';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function reducer(state, action) {
	let newState;
	let newCart;
	let currentAmount;
	let newAmount;
	let new_id;
	switch (action.type) {
		case CART_ACTIONS.CREATE:
			if (
				action.newProduct?.product_id === null ||
				action.newProduct?.product_id === undefined
			)
				return state;

			new_id = uuidv4();

			newState = {
				...state,
				cart: {
					...state.cart,
					[new_id]: [
						{
							...action.newProduct,
							order_description: action.order_description,
							cart_id: new_id,
						},
						action.amount,
					],
				},
			};

			console.log(newState.cart);

			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.ADD: // it is increment now
			if (
				action.newProduct?.product_id === null ||
				action.newProduct?.product_id === undefined
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct.cart_id.toString()
				)
			) {
				// console.log('item already in cart ' + action.newProduct.product_id);
				currentAmount = state.cart[action.newProduct.cart_id][1] ?? 0;
				newAmount = currentAmount + 1;
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.cart_id]: [action.newProduct, newAmount],
					},
				};
			} else {
				// console.log('item not in cart' + action.newProduct.product_id);
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.cart_id.toString()]: [action.newProduct, 1],
					},
				};
			}
			// console.log(
			//   Object.values(newState.cart).map((elem) => elem[0].product_id)
			// );
			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.DECREMENT:
			if (
				action.newProduct?.product_id === null ||
				action.newProduct?.product_id === undefined ||
				state.cart[action.newProduct.cart_id][1] === 1
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct.cart_id.toString()
				)
			) {
				// console.log('item already in cart ' + action.newProduct.product_id);
				currentAmount = state.cart[action.newProduct.cart_id][1] ?? 0;

				newAmount = currentAmount - 1;
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.cart_id]: [action.newProduct, newAmount],
					},
				};
			} else {
				newState = state;
			}
			// console.log(
			//   Object.values(newState.cart).map((elem) => elem[0].product_id)
			// );
			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.DELETE:
			if (
				action.newProduct?.product_id === null ||
				action.newProduct?.product_id === undefined
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct.cart_id.toString()
				)
			) {
				newCart = state.cart;
				delete newCart[action.newProduct.cart_id];

				newState = {
					...state,
					cart: {
						...newCart,
					},
				};
			} else {
				newState = state;
			}

			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.EMPTY:
			newState = { ...state, cart: {} };
			saveState(CART, newState);
			return newState;

		default:
			return state;
	}
}

export default function DealerProductsPage({
	queryPage,
	querySearch,
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

	const Router = useRouter();

	const { data, error } = useSWR(
		`/api/dealer/get-products?page=${queryPage ?? 1}&search=${
			querySearch ?? ''
		}`,
		fetcher
	);
	// TEMPORARY ERROR and LOADING screen RETURNS
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

	const { dealer_name: dealerName, products } = data;

	const handleAdd = async (values, { setSubmitting }) => {
		try {
			const { amount, description } = values;

			if (amount <= 0) {
				notify('warning', 'Geçerli bir miktar giriniz.');
				return;
			}

			dispatch({
				type: CART_ACTIONS.CREATE,
				newProduct: selected,
				amount,
				order_description: description,
			});
		} catch (error) {
			notify('error', 'Ürün sepete eklenemedi.');
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
		<Layout title={`${dealerName} Ürünleri`}>
			<div className={`px-2 md:px-12`}>
				<section className={`mb-3 flex justify-between items-center`}>
					<h1 className={`font-medium text-xl md:text-2xl`}>
						{dealerName} Ürünleri{' '}
						<span className='ml-1 pb-1'>
							<NextLink href='/dealer/cart' passHref>
								<Link className={`no-underline transition-colors`}>
									<Badge
										badgeContent={Object.values(state?.cart ?? []).length}
										color='secondary'
										className='mb-1'
									>
										<FiShoppingBag size={25} className='text-black' />
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
					className='px-2.5 md:px-1.5 xl:px-0 mb-4'
				>
					{products.map((product) => (
						<Grid item sm={6} md={productSize} key={product.product_id}>
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
								Herhangi bir ürün bulamadı.
							</h1>
						</div>
					)}
				</Grid>

				{/* <div className='grid grid-cols-3 gap-3 place-items-center my-12'>
					<Fab
						variant='extended'
						className={`
                place-self-start
                bg-rose-700 hover:bg-rose-600
                text-white text-xl tracking-wider normal-case
              `}
						onClick={handleEmpty}
					>
						<FiTrash size={22} className='mr-2' /> Sil
					</Fab>

					<NextLink href='/dealer/cart' passHref>
						<Link className={`no-underline transition-colors`}>
							<Fab
								variant='extended'
								className={`
                bg-neutral-200  hover:bg-white 
                text-black text-xl tracking-wider normal-case
              `}
							>
								<FiShoppingCart size={22} className='mr-2' /> Sepet{' '}
								{Object.values(state.cart ?? [])
									.map((elem) => elem[1])
									.reduce((partialSum, a) => partialSum + a, 0) !== 0 ? (
									<span className='ml-1 text-slate-900'>
										(
										{Object.values(state.cart ?? [])
											.map((elem) => elem[1])
											.reduce((partialSum, a) => partialSum + a, 0)}
										)
									</span>
								) : null}
							</Fab>
						</Link>
					</NextLink>
				</div> */}

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

				<Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
					<DialogContent className='my-12 p-4 '>
						<section>
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
									<form
										onSubmit={handleSubmit}
										className={`grid grid-cols-1 gap-6 content-center place-content-center max-w-sm mx-auto`}
									>
										<span
											className={`text-3xl font-semibold text-center text-gray-700 drop-shadow-md`}
										>
											{selected?.name}
										</span>

										<TextField
											id='amount'
											name='amount'
											label='Miktar'
											type='number'
											placeholder='Miktarı giriniz...'
											fullWidth
											value={values.amount}
											onChange={handleChange}
											error={touched.amount && Boolean(errors.amount)}
											helperText={touched.amount && errors.amount}
										/>

										<TextareaAutosize
											id='description'
											name='description'
											placeholder='Sipariş için açıklama giriniz...'
											maxLength={500}
											minRows={3}
											maxRows={5}
											className={`p-2 bg-slate-100 border-neutral-400 hover:border-black rounded-md font-sans text-base resize-y ${
												touched.description && Boolean(errors.description)
													? 'border-rose-500 hover:border-rose-600'
													: ''
											} `}
											value={values.description}
											onChange={handleChange}
											error={touched.description && errors.description}
										/>

										<p className='-my-4 ml-3 text-xs text-rose-600'>
											{errors.description &&
												touched.description &&
												errors.description}
										</p>

										<Button
											variant='contained'
											color='primary'
											size='large'
											type='submit'
											className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											Sepete Ekle
										</Button>
									</form>
								)}
							</Formik>
						</section>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const page = query?.page ?? 1;
		const search = query?.search ?? '';

		const token = req.cookies.token;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/product/categories`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL}/dealer/products-max-page`;

		const { data: dataMaxPage } = await axios.get(backendURLmaxPage, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				search: search ?? '',
			},
		});

		const categoryLabels = data?.categories.map(({ id, name }) => name);

		const number_of_pages = dataMaxPage?.max_page;

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
