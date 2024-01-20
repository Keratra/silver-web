/* eslint-disable @next/next/no-img-element */
import Layout from '../components/Layout';
import Product from '@components/Product';
import { Card, Grid, Link } from '@mui/material';
import NextLink from 'next/link';
// import banner from '/public/jewel1.jpg';
import hero from 'public/images/silver_hero1.jpg';
import { loadState } from 'lib';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ categories, categoryLabels, products }) {
	const [user, setUser] = useState(false);

	useEffect(() => {
		const token = loadState('token');
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
		}
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
						SILVER MARKET
					</h1>
					<nav>
						<NextLink href='/contact' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-80 hover:rounded-md transition-all'>
									Contact
								</span>
							</Link>
						</NextLink>

						<NextLink href='/map' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-80 hover:rounded-md transition-all'>
									Map / Weather
								</span>
							</Link>
						</NextLink>

						{!!user ? (
						<NextLink href='/dealer/cart' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-80 hover:rounded-md transition-all'>
									Cart
								</span>
							</Link>
						</NextLink>
						) : (
						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-80 hover:rounded-md transition-all'>
									Customer Login
								</span>
							</Link>
						</NextLink>
						)}
					</nav>
				</header>

				<section className='px-4 border-dashed border'>
					<div className='grid grid-cols-1 gap-8'>

						<div className='mx-auto max-w-4xl px-4 border-dashed border'>
							<div className='w-full text-2xl text-neutral-600 font-light text-center mt-4 -mb-7'>
								Welcome to 
							</div>
							<h1 className='font-serif text-5xl font-medium leading-tight tracking-wide mb-6 text-center'>
								Silver Market
							</h1>
							<p className='text-xl text-neutral-600 font-light mb-4 text-center'>
								An extremely user-friendly site where you can purchase your jewelry products
							</p>

							<div className='flex justify-center items-center gap-12 '>
								{!user && (
								<NextLink href='/dealer/login' passHref>
									<span className='cursor-pointer bg-white text-gray-800 px-2 py-2 rounded-md font-medium opacity-70 hover:opacity-100 transition-opacity'>
										<Link className='mx-1 p-1 text-black no-underline transition-colors'>
											<span className='text-sm md:text-base tracking-wider transition-colors select-none uppercase'>
												Customer Login
											</span>
										</Link>
									</span>
								</NextLink>	
								)}
							</div>
						</div>

						{/* <div className='flex justify-center items-center select-none'>
							<img src={hero.src} alt='Hero' className='w-full' />
						</div> */}

					</div>
				</section>
			
				<section className='px-4 border-dashed border min-h-[50vh]'>
					<h1 className='font-serif text-4xl font-medium leading-tight tracking-wide mb-6 text-center'>
						Popular Products
					</h1>

					<div className='grid grid-cols-1 gap-8'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='flex-start'
							alignItems='center'
							className='px-2.5 md:px-1.5 xl:px-0 mb-4'
						>
							{products.map((product, i) => (
								<Grid item sm={6} md={2} key={i}>
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
							))}

							{!!products && products.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-500'>
										No products were found.
									</h1>
								</div>
							)}
						</Grid>
						
					</div>
				</section>

				<footer className='absolute bottom-0 w-full bg-black text-gray-100 py-2'>
					<div className='container mx-auto flex flex-wrap justify-between px-4'>
						<p className='text-sm'>
							&copy; 2024 Silver Market. All rights reserved.
						</p>
						<nav className='text-sm'>
							<a href='#' className='text-gray-100 hover:text-gray-300 mx-3'>
								Terms of Service
							</a>
							<a href='#' className='text-gray-100 hover:text-gray-300 mx-3'>
								Privacy Policy
							</a>

							<NextLink href='/admin/login' passHref>
								<Link className='mx-3 no-underline'>
									<span className='text-gray-100 hover:text-gray-300'>
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
