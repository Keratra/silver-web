import Layout from '@components/Layout';
import Product from '@components/Product';
import {
	Button,
	Card,
	Checkbox,
	Dialog,
	DialogContent,
	Fab,
	FormControl,
	FormControlLabel,
	InputLabel,
	Link,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextareaAutosize,
	TextField,
} from '@mui/material';
import {
	FiTrash,
	FiPlus,
	FiMinus,
	FiShoppingCart,
	FiSend,
	FiArrowLeft,
} from 'react-icons/fi';
import { useState, useReducer, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState, saveState, formatPrice, reducer } from 'lib';
import { CARGO_BRANDS, CART, CART_ACTIONS } from 'utils/constants';
import { MdPayment } from 'react-icons/md';
import { Formik } from 'formik';
import { orderModel, orderPaymentModel } from 'lib/yupmodels';
import { notify } from 'utils/notify.js';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";


const tableHeadClasses = `
  font-serif font-semibold text-lg md:text-xl
`;

const tableBodyClasses = `
text-md md:text-lg
`;

export default function DealerOrderConfirmPage({ paymentMethods }) {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});
	const [user, setUser] = useState(false);
	const [orderDescription, setOrderDescription] = useState('');
	const [open, setOpen] = useState(false);

	const Router = useRouter();

	const cart = loadState(CART)?.cart;
	
	useEffect(() => {
		const token = loadState('token')?.token;
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
		}
	}, []);

	const handleOrderSubmit = async (values, { setSubmitting }) => {
		try {			
			const [ products, quantities ] = Object.values(state?.cart)[0].map((_, colIndex) => Object.values(state?.cart).map(row => row[colIndex]))

			// console.log({ products })
			// console.log({ quantities })

			// notify('info', JSON.stringify(products.map(elem => elem.name)))
			// notify('info', JSON.stringify(quantities))

			if (!orderDescription || orderDescription === '') {
				setOrderDescription(() => 'No description');
			}

			const { cargo_brand, card_number, card_month, card_year, card_cvv, card_fullname, card_is_save  } = values;

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/create-order`;

			const { token } = loadState('token');

			if (products?.length === 0) {
				notify('warning', 'No products in the cart.');
				return;
			} else if (products?.length !== quantities?.length) {
				notify('warning', 'Products and quantities are not equal.');
				return;
			} else if (quantities?.length === 0) {
				notify('warning', 'No quantities in the cart.');
				return;
			}

			await axios.post(backendURL, {
				products: products?.map(elem => elem.id),
				quantities,
				description: orderDescription,
				cargo_brand,
				card_number,
				card_month,
				card_year,
				card_cvv,
				card_fullname,
				card_is_save
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			dispatch({ type: CART_ACTIONS.EMPTY });

			Router.push('/dealer/see-orders/WAIT?page=1&search=&isNameSearch=true');
		} catch (error) {
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

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
					<NextLink href='/dealer' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Products
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
							</span>
						</Link>
					</NextLink>

					{!!user ? (
						<>

						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						</>
						) : (
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
			<div className={`max-w-7xl mx-auto px-2 lg:px-12 min-h-screen`}>
				<section className={`flex`}>
					<h1 className={`flex-grow font-semibold text-xl md:text-3xl`}>
						Your Order
					</h1>
				</section>

				<Paper className='w-full shadow-md'>
					<TableContainer>
						<Table stickyHeader>
							<TableHead>
								<TableRow style={{ backgroundColor: '#212021' }}>
									<TableCell
										align='left'
										className={tableHeadClasses}
									>
										Product
									</TableCell>
									<TableCell
										align='center'
										className={tableHeadClasses}
									>
										Quantity
									</TableCell>
									<TableCell
										align='right'
										className={tableHeadClasses}
									>
										Price
									</TableCell>
									<TableCell
										align='right'
										className={tableHeadClasses}
									>
										Total
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{!!cart &&
									Object.values(cart).map(
										([
											{
												id,
												name,
												category_id,
												price,
												description,
												order_description,
											},
											amount,
										]) => (
											<TableRow
												hover
												role='checkbox'
												tabIndex={-1}
												key={id}
											>
												<TableCell align='left' className={tableBodyClasses}>
													{name}
												</TableCell>
												<TableCell align='center' className={tableBodyClasses}>
													{amount}
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(price)}
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(price * amount)}
												</TableCell>
											</TableRow>
										)
									)}
								{!!cart && (
									<TableRow hover role='checkbox' tabIndex={-1}>
										<TableCell
											align='left'
											className={tableBodyClasses + ' font-semibold'}
										></TableCell>
										<TableCell
											align='center'
											className={tableBodyClasses + ' font-semibold'}
										>
											Total{' '}
											<span className='font-normal'>
												{Object.values(cart)
													.map(([_, amount]) => amount)
													.reduce((partialSum, a) => partialSum + a, 0)}{' '}
												products
											</span>
										</TableCell>
										<TableCell
											align='right'
											className={tableBodyClasses + ' font-semibold'}
										></TableCell>
										<TableCell
											align='right'
											className={tableBodyClasses + ' font-semibold'}
										>
											Order Total{' '}
											<span className='font-normal'>
												{formatPrice(
													Object.values(cart)
														.map(([product, amount]) => product.price * amount)
														.reduce((partialSum, a) => partialSum + a, 0)
												)}
											</span>
										</TableCell>
									</TableRow>
								)}

								{!!cart && (
									<TableRow role='checkbox' tabIndex={-1}>
										<TableCell
											align='center'
											className={tableBodyClasses + ' font-semibold'}
											colSpan={4}
										>
											<div className='max-w-5xl mx-auto flex justify-center items-start p-0 m-0'>
												<TextareaAutosize
													className='p-2 font-sans w-full text-sm md:text-lg bg-slate-50'
													placeholder='Write an order description here...'
													style={{ resize: 'vertical' }}
													minRows={3}
													value={orderDescription}
													onChange={(e) => setOrderDescription(() => e.target.value)}
												/>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{!cart && (
							<div className='my-1 font-medium text-xl text-rose-600 text-center'>
								There are no products in your cart.
							</div>
						)}
					</TableContainer>
				</Paper>

				<section className='mx-auto '>
					{!!user ? (
						<Formik
						initialValues={orderModel.initials}
						validationSchema={orderModel.schema}
						onSubmit={handleClickOpen}
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
								className={`grid grid-cols-1 content-center place-content-center p-4`}
							>
								<Fab
									type='submit'
									variant='extended'
									className={`
										max-w-fit mx-auto mt-1
										bg-emerald-500  hover:bg-emerald-400 
										text-white text-xl tracking-wider uppercase
									`}
								>
									<MdPayment size={22} className='mr-2' /> Proceed to checkout
								</Fab>
							</form>
						)}
					</Formik>
					) : (
						<span>Please login to checkout</span>
					)}
				</section>

				<Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
					<DialogContent className=' p-4 '>
						<div className='mb-4 mt-2 text-center font-serif font-semibold text-xl md:text-3xl text-gray-800 cursor-default select-none'>
							Checkout
						</div>
						<div className=''>
							<Formik
								initialValues={{
									...orderPaymentModel.initials,
									payment_method: '',
								}}
								validationSchema={orderPaymentModel.schema}
								onSubmit={handleOrderSubmit}
							>
								{({
									values,
									errors,
									touched,
									handleChange,
									handleSubmit,
									setFieldValue,
									isSubmitting,
								}) => (
								<form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-6 content-center place-content-center `} >
									{(!!paymentMethods && paymentMethods?.length !== 0) && (
									<FormControl className="col-span-2">
										<InputLabel htmlFor="payment_method">Payment Method</InputLabel>
										<Select
											native
											label="Payment Method"
											value={values.payment_method}
											onChange={(e) => {
												setFieldValue('payment_method', e.target.value);
												const selectedId = parseInt(e.target.value);
												const selectedMethod = paymentMethods.find(method => method.id === selectedId);
												console.log(selectedMethod);
												if (selectedMethod) {
													setFieldValue('card_number', selectedMethod.card_number);
													setFieldValue('card_month', selectedMethod.month);
													setFieldValue('card_year', selectedMethod.year);
													setFieldValue('card_fullname', selectedMethod.full_name);
													setFieldValue('card_cvv', selectedMethod.cvv);
												} else {
													setFieldValue('card_number', '');
													setFieldValue('card_month', '');
													setFieldValue('card_year', '');
													setFieldValue('card_fullname', '');
													setFieldValue('card_cvv', '');
												}
											}}
											inputProps={{
												card_number: 'payment_method',
												id: 'payment_method',
											}}
										>
											<option value={0}>Select a payment method or enter a new one</option>
											{paymentMethods.map((method) => (
												<option key={method.id} value={method.id}>Card with No: {method.card_number}</option>
											))}
										</Select>
									</FormControl>
									)}

									<TextField
										id='card_number'
										name='card_number'
										label='Card Number'
										type='text'
										placeholder='Enter the card number...'
										className="col-span-2"
										fullWidth
										value={values.card_number}
										onChange={handleChange}
										error={touched.card_number && Boolean(errors.card_number)}
										helperText={touched.card_number && errors.card_number}
									/>

									<TextField
										id='card_month'
										name='card_month'
										label='Card Expiry Month'
										type='text'
										placeholder='Enter the card expiry month...'
										fullWidth
										value={values.card_month}
										onChange={handleChange}
										error={touched.card_month && Boolean(errors.card_month)}
										helperText={touched.card_month && errors.card_month}
									/>

									<TextField
										id='card_year'
										name='card_year'
										label='Card Expiry Year'
										type='text'
										placeholder='Enter the card expiry year...'
										fullWidth
										value={values.card_year}
										onChange={handleChange}
										error={touched.card_year && Boolean(errors.card_year)}
										helperText={touched.card_year && errors.card_year}
									/>

									<TextField
										id='card_fullname'
										name='card_fullname'
										label='Card Full Name'
										type='text'
										placeholder='Enter the card full name...'
										fullWidth
										value={values.card_fullname}
										onChange={handleChange}
										error={touched.card_fullname && Boolean(errors.card_fullname)}
										helperText={touched.card_fullname && errors.card_fullname}
									/>

									<TextField
										id='card_cvv'
										name='card_cvv'
										label='Card CVV'
										type='text'
										placeholder='Enter the card CVV...'
										fullWidth
										value={values.card_cvv}
										onChange={handleChange}
										error={touched.card_cvv && Boolean(errors.card_cvv)}
										helperText={touched.card_cvv && errors.card_cvv}
									/>

									
									<TextField
										id='cargo_brand'
										name='cargo_brand'
										label='Cargo Brand'
										type='text'
										placeholder='Enter the cargo brand...'
										className=""
										fullWidth
										select // Add select attribute to make it a select input
										value={values.cargo_brand}
										onChange={handleChange}
										error={touched.cargo_brand && Boolean(errors.cargo_brand)}
										helperText={touched.cargo_brand && errors.cargo_brand}
									>
										{CARGO_BRANDS.map((brand) => (
											<MenuItem key={brand} value={brand}>
												{brand}
											</MenuItem>
										))}
									</TextField>

									<FormControlLabel
										id='card_is_save'
										name='card_is_save'
										label='Save Card Information'
										control={
											<Checkbox
												checked={values.card_is_save === "1"}
												onChange={(e) => {
													const newValue = e.target.checked ? "1" : "0";
													handleChange({ target: { name: 'card_is_save', value: newValue } });
												}}
												color='secondary'
											/>
										}
									/>

									<Button
										variant='contained'
										color='primary'
										size='large'
										type='submit'
										className={`col-span-2 bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider uppercase`}
										disabled={isSubmitting}
									>
										Finish Checkout 
										<span className='ml-2 font-light'>
											( {formatPrice(
												Object.values(cart)
													.map(([product, amount]) => product.price * amount)
													.reduce((partialSum, a) => partialSum + a, 0)
											)} )
										</span>
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

// payments: [
//     {
//       card_number: '123456789',
//       created_at: '2024-01-21T15:55:48.345396+00:00',
//       cvv: '111',
//       dealer_id: 3,
//       full_name: 'Kerem Kaya',
//       id: 1,
//       month: '12',
//       year: '25'
//     }
//   ]

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;

		if (!token || token === '' || token === 'null' || token === null ) {
			return {
				props: {
					paymentMethods: [],
				},
			};
			} else {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/saved-payments`;
			
			const { data } = await axios.get(backendURL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return {
				props: {
					paymentMethods: data?.payments ?? [],
				},
			};
		}
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		return {
			props: {
				paymentMethods: [],
				errorMessage: 'An error occured.',
			},
		};
	}
}
