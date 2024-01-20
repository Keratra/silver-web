/* eslint-disable @next/next/no-img-element */
import Layout from '../components/Layout';
import Product from '@components/Product';
import { Button, Card, Fab, Grid, Link } from '@mui/material';
import NextLink from 'next/link';
// import banner from '/public/jewel1.jpg';
import hero from 'public/images/silver_hero1.jpg';
import { loadState } from 'lib';
import { useEffect, useState } from 'react';
import { notify } from 'utils/notify';
import axios from 'axios';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";


export default function Home({ categories, categoryLabels, products }) {
	const [user, setUser] = useState(false);

	useEffect(() => {
		const token = loadState('token')?.token;
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
		}
		// notify('info', token);
	}, []);

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

	// {
	// 	categories: [
	// 	  {
	// 		created_at: '2024-01-19T19:18:36.119725+00:00',
	// 		id: 1,
	// 		name: 'Phone'
	// 	  },
	// 	  {
	// 		created_at: '2024-01-19T19:50:20.289034+00:00',
	// 		id: 2,
	// 		name: 'Computer'
	// 	  },
	// 	  {
	// 		created_at: '2024-01-19T19:50:44.79253+00:00',
	// 		id: 3,
	// 		name: 'Keyboard'
	// 	  }
	// 	]
	//   }
		
	return (
		<Layout fullWidth>
			<div className='h-[100vh] bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100'>
				<header className='container mx-auto py-2 px-4 flex justify-between items-center select-none'>
					<h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
						SILVER
					</h1>
					<nav className='w-full flex justify-end items-center flex-wrap'>
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

						<NextLink href='/dealer' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiViewGrid size={24} className='' /> Products
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
						<>
						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						</>
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
								A place where you can purchase your jewelry products
							</p>
						</div>

					</div>
				</section>
			
				<section className='px-4 min-h-[50vh] bg-white py-6 border-solid border-0 border-b border-neutral-300'>
					<h1 className='font-serif text-4xl font-medium leading-tight tracking-wide mb-12 text-center'>
						Popular Products
					</h1>

					<div className='max-w-7xl mx-auto grid grid-cols-1 gap-8'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='flex-start'
							alignItems='center'
							className='px-2.5 md:px-1.5 xl:px-0 mb-4'
						>
							{products.map((product, i) => (
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

							{!!products && products.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-500'>
										No products were found.
									</h1>
								</div>
							)}
						</Grid>

						<div className='w-full my-3 flex justify-center items-center'>
							<Button
								variant='contained'
								color='primary'
								size='large'
								className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
							>
								View More
							</Button>
						</div>
						
					</div>
				</section>

				
			
				<section className='px-4 min-h-[50vh] bg-neutral-50 py-6 border-solid border-0 border-b border-neutral-300'>
					<h1 className='font-serif text-4xl font-medium leading-tight tracking-wide mb-12 text-center'>
						New Products
					</h1>

					<div className='max-w-7xl mx-auto grid grid-cols-1 gap-8'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='flex-start'
							alignItems='center'
							className='px-2.5 md:px-1.5 xl:px-0 mb-4'
						>
							{products.map((product, i) => (
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

							{!!products && products.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-500'>
										No products were found.
									</h1>
								</div>
							)}
						</Grid>

						<div className='w-full my-3 flex justify-center items-center'>
							<Button
								variant='contained'
								color='primary'
								size='large'
								className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
							>
								View More
							</Button>
						</div>
						
					</div>
				</section>

				<footer className='w-full bg-black text-gray-100 py-2'>
					<div className='container mx-auto flex flex-wrap justify-between px-4'>
						<p className='text-sm'>
							&copy; 2024 Silver Market. All rights reserved.
						</p>
						<nav className='text-sm flex items-center'>
							<a href='#' className='text-gray-100 hover:text-gray-300 mx-3 transition-colors'>
								Terms of Service
							</a>
							<a href='#' className='text-gray-100 hover:text-gray-300 mx-3 transition-colors'>
								Privacy Policy
							</a>

							<NextLink href='/admin/login' passHref>
								<Link className='mx-3 no-underline'>
									<span className='text-gray-100 hover:text-gray-300 transition-colors'>
										Admin Login
									</span>
								</Link>
							</NextLink>
						</nav>
					</div>
				</footer>
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
