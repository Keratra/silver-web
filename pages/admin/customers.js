import Layout from '@components/Layout';
import Product from '@components/Product';
import {
	Alert,
	Box,
	Button,
	Card,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function InquiriesPage({ 
	queryPage, 
	number_of_pages
}) {
	const { data, error } = useSWR(`/api/admin/get-customers`, fetcher);
	const Router = useRouter();

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

    const customers = data?.dealers;

	return (
		<Layout>
			<div className={`px-4 lg:px-12 `}>
				<Box className={`mt-6  mb-4`}>
					<section className={`my-3 flex items-center gap-4 mb-8`}>
						<h1 className={`font-semibold text-3xl`}>
							Customers
						</h1>
                        <span className='flex-grow flex justify-start items-center gap-4 font-normal text-xl'>
                            {customers?.length ?? 0} items received
                        </span>
					</section>
					<Grid container spacing={2}>
						{!!customers &&
							customers.map(
								({
									id,
									name,
                                    email,
                                    address,
                                    city,
                                    country,
                                    phone,
									created_at,
								}) => (
									<Grid item key={id} xs={12}>
										<div className=''>
											<Card className='flex flex-col justify-start items-start gap-2 rounded-lg p-2 sm:p-4 shadow-md bg-white overflow-x-auto'>
												<span className='text-xs sm:text-base rounded-sm border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-b-slate-400 hover:border-orange-500 cursor-default'>
													ID #{id}
												</span>
												<div className='w-full flex flex-grow justify-center items-center'>
													<div className='text-center ml-3 sm:ml-6 flex-grow h-full'>
														<span className='mb-2 text-lg sm:text-xl rounded-sm text-neutral-900 cursor-default'>
															{name}
														</span>
														<div className='w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4'>
															<span className='ml-2 sm:ml-4 text-sm italic font-normal text-slate-600'>
																{email}
															</span>
															<span className='ml-1 text-sm italic font-normal text-slate-600'>
																{phone}
															</span>
														</div>
													</div>
                                                </div>

                                                <div className='w-full flex flex-col sm:flex-row justify-between items-center gap-2'>
													<div className="mt-2">
														<span className='text-sm sm:text-base rounded-sm text-neutral-700 cursor-default'>
															{address}, {city} / {country}
														</span>
													</div>
												
													<div className='text-end'>
														<span className='text-sm sm:text-base rounded-sm text-neutral-900 cursor-default'>
															<span className='italic font-light text-slate-600'>
																Registered in{' '}
																{new Date(
																	created_at
																).toLocaleDateString()}
															</span>
														</span>
													</div>
												</div>
											</Card>
                                            
                                            
										</div>
									</Grid>
								)
							)}
						{!!customers &&
							customers.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-600'>
										No customers were found...
									</h1>
								</div>
							)}
					</Grid>
				</Box>
			</div>
		</Layout>
	);
}