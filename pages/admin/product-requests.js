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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ViewPriceRequests({ categoryLabels }) {
	const { data, error } = useSWR('/api/admin/get-product-offers', fetcher);

	const Router = useRouter();

	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState({ showSkeleton: true });

	// TEMPORARY ERROR and LOADING screen RETURNS
	if (error)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto'] text-center">
					An error occured.
				</div>
			</Layout>
		);
	if (!data)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-orange-500 text-2xl font-['Roboto'] text-center">
					Loading...
				</div>
			</Layout>
		);

	if (!!data.message) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto'] text-center">
					An error occured. <br /> Please try again.
				</div>
			</Layout>
		);
	}
	const { dealers, special_product_offers } = data;

	const handleAccept = async (offer_id) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/special-product-offer/accept`;

			const { token } = loadState('token');

			let price = prompt('Ürünün fiyatını girin');

			while (!/^[+-]?\d+(\.\d+)?$/.test(price)) {
				if (price === null) throw 'Kera - Action cancelled by user';
				price = prompt('Ürünün fiyatını girin (geçerli bir sayı girin)');
			}

			price = parseFloat(price);

			const formData = new FormData();

			formData.append('special_product_id', offer_id);
			formData.append('price', price);

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			Router.reload();
		} catch (error) {
			notify('error', 'Ürün teklifi kabul edilemedi.');
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		}
	};

	const handleReject = async (offer_id) => {
		if (confirm('Bu teklifi reddetmek istediğinizden emin misiniz?')) {
			try {
				const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/special-product-offer/reject`;

				const { token } = loadState('token');

				const formData = new FormData();

				formData.append('special_product_id', offer_id);

				const { data } = await axios.post(backendURL, formData, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				});

				Router.reload();
			} catch (error) {
				notify('error', 'Ürün teklifi reddedilemedi.');
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
			}
		}
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Layout>
			<div className={`px-4 lg:px-12 `}>
				<Box className={`mt-6  mb-4`}>
					<section className={`my-3 flex`}>
						<h1 className={`flex-grow font-semibold text-3xl`}>
							Bütün Ürün İstekleri
						</h1>
					</section>
					<Grid container spacing={2}>
						{!!special_product_offers &&
							special_product_offers.map(
								({
									id: offer_id,
									dealer_name,
									name: product_name,
									category_id,
									description: product_description,
								}) => (
									<Grid item key={offer_id} xs={12}>
										<div className=''>
											<Card className='flex justify-start items-center gap-2 rounded-lg p-4 shadow-md bg-white overflow-x-auto'>
												<span className='rounded-sm border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-b-slate-400 hover:border-orange-500 cursor-default'>
													{dealer_name}{' '}
													<span className='italic font-light text-slate-600'>
														tarafından
													</span>
												</span>
												<div className='ml-2 flex-grow h-full'>
													<span className='rounded-sm text-neutral-900 cursor-default'>
														{categoryLabels[parseInt(category_id) - 1]}{' '}
														<span className='italic font-light text-slate-600'>
															kategorili
														</span>
													</span>
													<span className='ml-2 rounded-sm text-slate-900 cursor-default'>
														{product_name}{' '}
														<span className='italic font-light text-slate-600'>
															ürünü
														</span>
													</span>

													{/* <span className='block max-h-[70px] p-1 overflow-y-auto italic font-light rounded-md text-sm text-neutral-900 cursor-default'>
														{product_description}{' '}
														<span className='italic font-light text-slate-600'>
															açıklamalı
														</span>
													</span> */}
												</div>
												<div className='ml-3 flex justify-center gap-4'>
													<Button
														className={`
                            py-2 pb-1 px-4
                            bg-slate-700 hover:bg-slate-500
                            normal-case text-white
                            shadow-lg
                          `}
														onClick={() => {
															handleClickOpen();
															setSelected({
																id: offer_id,
																name: product_name,
																category_id,
																description: product_description,
															});
														}}
													>
														Ürünü Gör
													</Button>
													<Button
														className={`
                            py-2 pb-1 px-4
                            bg-rose-600 hover:bg-rose-400
                            normal-case text-white
                            shadow-lg
                          `}
														onClick={() => handleReject(offer_id)}
													>
														Reddet
													</Button>
													<Button
														className={`
                            py-2 pb-1 px-4
                            bg-emerald-600 hover:bg-emerald-400
                            normal-case text-white
                            shadow-lg
                          `}
														onClick={() => handleAccept(offer_id)}
													>
														Kabul et
													</Button>
												</div>
											</Card>
										</div>
									</Grid>
								)
							)}
						{!!special_product_offers &&
							special_product_offers.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-600'>
										Herhangi bir ürün önerisi bulunamadı.
									</h1>
								</div>
							)}
					</Grid>
				</Box>
				<Dialog open={open} onClose={handleClose}>
					<DialogContent className='p-0 bg-neutral-200 '>
						<Product
							product={selected}
							size={3}
							categories={categoryLabels}
							displayOnly
							hasDifferentImageSource
						/>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/add`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const categoryLabels = data?.categories.map(({ id, name }) => name);

		return {
			props: {
				categoryLabels,
			},
		};
	} catch (error) {
		console.log();
		return {
			props: {
				categoryLabels: [],
			},
		};
	}
}
