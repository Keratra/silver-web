/* eslint-disable @next/next/no-img-element */
import Layout from '../components/Layout';
import { Card, Link } from '@mui/material';
import NextLink from 'next/link';
// import banner from '/public/jewel1.jpg';
import hero from 'public/images/silver_hero1.jpg';

export default function Home() {
	return (
		<Layout fullWidth>
			<div className='h-[100vh] bg-gradient-to-b from-slate-100 via-neutral-700 to-black'>
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

						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-80 hover:rounded-md transition-all'>
									Dealer Login
								</span>
							</Link>
						</NextLink>

						<NextLink href='/admin/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white p-4 opacity-90 hover:rounded-md transition-all'>
									Admin Login
								</span>
							</Link>
						</NextLink>
					</nav>
				</header>

				<section className='bg-gradient-to-b from-gray-800 to-black text-white'>
					<div className='container mx-auto px-4 py-24'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
							<div className='max-w-lg'>
								<h1 className='font-serif text-5xl font-medium leading-tight tracking-wide mb-6'>
									Welcome to Silver Market
								</h1>
								<p className='text-xl text-neutral-400 font-light mb-8 text-justify'>
									Silver Workshop is an extremely user-friendly site where you can purchase your jewelry products. 
									Admins can add products to the site, and dealers can place orders by writing notes for these products. 
									All transactions are carried out easily and quickly.
									Sign up now and enjoy getting your products!
								</p>

								<div className='flex justify-around items-center gap-12 '>
									<NextLink href='/dealer/login' passHref>
										<span className='cursor-pointer bg-white text-gray-800 px-2 py-2 rounded-md font-medium opacity-70 hover:opacity-100 transition-opacity'>
											<Link className='mx-1 p-1 text-black no-underline transition-colors'>
												<span className='text-sm md:text-base tracking-wider transition-colors select-none uppercase'>
													Dealer Login
												</span>
											</Link>
										</span>
									</NextLink>

									<NextLink href='/admin/login' passHref>
										<span className='cursor-pointer bg-white text-gray-800 px-2 py-2 rounded-md font-medium opacity-70 hover:opacity-100 transition-opacity'>
											<Link className='mx-1 p-1 text-black no-underline transition-colors'>
												<span className='text-sm md:text-base tracking-wider transition-colors select-none uppercase'>
													Admin Login
												</span>
											</Link>
										</span>
									</NextLink>
								</div>
							</div>
							<div className='flex justify-center items-center select-none'>
								<img src={hero.src} alt='Hero' className='w-full' />
							</div>
						</div>
					</div>
				</section>

				<footer className='bg-black text-gray-100 py-2'>
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
						</nav>
					</div>
				</footer>
			</div>
		</Layout>
	);
}
