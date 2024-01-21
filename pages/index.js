/* eslint-disable @next/next/no-img-element */
import Layout from '../components/Layout';
import Product from '@components/Product';
import { Box, Button, Card, Dialog, DialogContent, Fab, Grid, Link, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
// import banner from '/public/jewel1.jpg';
import hero from 'public/images/silver_hero1.jpg';
import { loadState, saveState, formatPrice, fetcher, reducer } from 'lib';
import { CART, CART_ACTIONS } from 'utils/constants';
import { useEffect, useReducer, useState } from 'react';
import { notify } from 'utils/notify';
import axios from 'axios';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";
import { productCartModel } from 'lib/yupmodels';
import { Formik } from 'formik';


const InfoBox = ({ title, info, colSpan = '1' }) => (
	<Box
		className={`
      col-span-full md:col-span-${colSpan}
      p-6 rounded-md
      hover:scale-[105%]
      bg-slate-50
      shadow-md
      text-center break-words
      transition-all
    `}
	>
		<Typography
			className={`
        -mt-3 mb-4 -ml-2
        font-light text-md text-left
        text-amber-800
      `}
		>
			{title}
		</Typography>
		<p
			className={`
        mt-3 mb-3
        text-md text-center
      `}
		>
			{info}
		</p>
	</Box>
);

export default function Home({ categories, categoryLabels, products }) {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});

	const [user, setUser] = useState(false);
	const [open, setOpen] = useState(false);
	const [randomCategories, setRandomCategories] = useState([]);
	const [selected, setSelected] = useState({ showSkeleton: true });

	useEffect(() => {
		const token = loadState('token')?.token;
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
		}
		// notify('info', token);

		setRandomCategories(() => getRandomCategories(categories, products));
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

	// {
	// 	products: [
	// 	  {
	// 		category_id: 1,
	// 		created_at: '2024-01-19T19:19:35.471891+00:00',
	// 		description: 'It is an Android.',
	// 		id: 1,
	// 		image: '0ee5146f-74bb-4eff-bfcf-ca3bafd9bda5.jpg',
	// 		is_active: true,
	// 		name: 'Iphone 15 256 GB - Black',
	// 		price: 52897
	// 	  },
	// 	  {
	// 		category_id: 2,
	// 		created_at: '2024-01-19T20:41:12.55765+00:00',
	// 		description: 'Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image. Weather Input Image.',
	// 		id: 4,
	// 		image: '7c18e450-7499-4916-af93-53bbe7da930a.png',
	// 		is_active: true,
	// 		name: 'Test Product',
	// 		price: 2
	// 	  }
	// 	]
	//   }

	const getRandomCategories = (categories, products) => {
		const randomCategories = [];
		const categoryCount = categories.length;

		const categoriesWithProducts = categories.filter(category =>
			products.filter(product => product.category_id === category.id).length >= 1
		);

		if (categoriesWithProducts.length === 1) {
			return categoriesWithProducts;
		} else if (categoriesWithProducts.length === 0) {
			categories.sort((a, b) => {
				const productCountA = products.filter(product => product.category_id === a.id).length;
				const productCountB = products.filter(product => product.category_id === b.id).length;
				return productCountB - productCountA;
			});
			return categories;
		}

		const index1 = Math.floor(Math.random() * categoriesWithProducts.length);
		let index2 = Math.floor(Math.random() * categoriesWithProducts.length);

		while (index2 === index1) {
			index2 = Math.floor(Math.random() * categoriesWithProducts.length);
		}

		randomCategories.push(categoriesWithProducts[index1]);
		randomCategories.push(categoriesWithProducts[index2]);

		randomCategories.sort((a, b) => {
			const productCountA = products.filter(product => product.category_id === a.id).length;
			const productCountB = products.filter(product => product.category_id === b.id).length;
			return productCountB - productCountA;
		});

		return randomCategories;
	};

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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
		
	return (
		<Layout fullWidth>
			<div className='min-h-[100vh] bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100'>
				<header className='py-2 px-4 flex justify-between items-center select-none'>
					<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
						SILVER
					</h1>
					<nav className='w-full flex justify-end items-center flex-wrap'>
						<NextLink href='/dealer' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiViewGrid size={24} className='' /> Products
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

						<NextLink href='/dealer/cart' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiShoppingCart size={24} className='' /> Cart
								</span>
							</Link>
						</NextLink>

						{!!user ? (
						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						) : (
						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center  gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiLogin size={24} className='' /> Login
								</span>
							</Link>
						</NextLink>
						)}
					</nav>
				</header>

				<section className='px-4 py-24' style={{ backgroundImage: `url('${hero.src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
					<div className='grid grid-cols-1 gap-8'>

						<div className='mx-auto max-w-4xl px-8  backdrop-blur-lg backdrop-brightness-150 hover:animate-wiggle'>
							<div className='w-full text-2xl text-neutral-800 font-normal text-center mt-4 -mb-7'>
								Welcome to 
							</div>
							<h1 className='font-serif text-5xl font-medium leading-tight tracking-wide mb-6 text-center'>
								Silver Market
							</h1>
							<p className='text-xl text-neutral-800 font-normal mb-4 text-center'>
								A place where you can purchase excellent jewelry products
							</p>
						</div>

					</div>
				</section>
			
				<section className='px-4 min-h-[50vh] bg-white py-6 border-solid border-0 border-b border-neutral-300'>
					<h1 className='font-serif text-4xl font-medium leading-tight tracking-wide mb-12 text-center'>
						Our {randomCategories[0]?.name} Products
					</h1>

					<div className='max-w-7xl mx-auto grid grid-cols-1 gap-8'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='center'
							alignItems='center'
							className='px-2.5 md:px-1.5 xl:px-0 mb-4'
						>
							{products
								.filter(product => product.category_id === randomCategories[0]?.id)
								.slice(0, 4)
								.map((product, i) => (
								<Grid item sm={6} md={3} key={i}>
									<Product
										product={product}
										size={3}
										categories={categoryLabels}
										fabFunc={() => {
											handleClickOpen();
											setSelected(() => product);
										}}
										hasPrice
										forCart
									/>
								</Grid>
							)).splice(0, 4)}
						</Grid>

						<div className='w-full my-3 flex justify-center items-center'>
							<NextLink href='/dealer' passHref>
							<Link className='no-underline'>
							<Button
								variant='contained'
								color='primary'
								size='large'
								className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
							>
								View More
							</Button>
							</Link>
							</NextLink>
						</div>
						
					</div>
				</section>

				{randomCategories.length > 1 && (
				<section className='px-4 min-h-[50vh] bg-neutral-50 py-6 border-solid border-0 border-b border-neutral-300'>
					<h1 className='font-serif text-4xl font-medium leading-tight tracking-wide mb-12 text-center'>
						Our {randomCategories[1]?.name} Products
					</h1>

					<div className='max-w-7xl mx-auto grid grid-cols-1 gap-8'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='center'
							alignItems='center'
							className='px-2.5 md:px-1.5 xl:px-0 mb-4'
						>
							{products
								.filter(product => product.category_id === randomCategories[1]?.id)
								.slice(0, 4)
								.map((product, i) => (
								<Grid item sm={6} md={3} key={i}>
									<Product
										product={product}
										size={3}
										categories={categoryLabels}
										fabFunc={() => {
											handleClickOpen();
											setSelected(() => product);
										}}
										hasPrice
										forCart
									/>
								</Grid>
							)).splice(0, 4)}
						</Grid>

						<div className='w-full my-3 flex justify-center items-center'>
							<NextLink href='/dealer' passHref>
							<Link className='no-underline'>
							<Button
								variant='contained'
								color='primary'
								size='large'
								className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
							>
								View More
							</Button>
							</Link>
							</NextLink>
						</div>
						
					</div>
				</section>
				)}

				<Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
					<DialogContent className=' p-4 '>
						<section className='grid grid-cols-2 gap-4'>
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
											className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
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


export async function getServerSideProps({ req }) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/all-products`;
		const backendURLCategories = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/categories`;

		const { data: dataProducts } = await axios.get(backendURL);
		const { data: dataCategories } = await axios.get(backendURLCategories);

		const categoryLabels = dataCategories?.categories.map(({ id, name }) => name);

		return {
			props: {
				categories: dataCategories?.categories,
				categoryLabels,
				products: dataProducts?.products,
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
				categoryLabels: [],
				categories: [],
				products: [],
			},
		};
	}
}
