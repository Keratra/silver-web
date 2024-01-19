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

export default function CategoriesPage({ categories, categoryLabels }) {
	const Router = useRouter();

	const [open, setOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const handleAddCategory = async () => {
        try {
            if (categoryName === '') throw 'Error - Category name cannot be empty';

            const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/add-categories`;

            const { token } = loadState('token');

            const { data } = await axios.post(backendURL, {
                name: categoryName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            notify('success', 'Category added successfully.');
            setCategoryName('');
        
            Router.reload();
        } catch (error) {
            notify('error', 'Could not add category.');
            console.log(
                error?.response?.data?.message?.message ??
                    error?.response?.data?.message ??
                    error?.message ?? error
            );
        }
    }


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
					<section className={`my-3 flex items-center gap-4 mb-8`}>
						<h1 className={`font-semibold text-3xl`}>
							Categories
						</h1>
                        <span className='flex-grow flex justify-start items-center gap-4 font-normal text-xl'>
                            {categories?.length ?? 0} items received
                        </span>
                        <div>
                            <Button
                                className={`py-2 px-4
                                bg-sky-600 hover:bg-sky-400
                                normal-case text-white
                                shadow-lg rounded-2xl text-xl
                            `}
                                onClick={() => handleClickOpen()}
                            >
                                NEW CATEGORY
                            </Button>
                        </div>
					</section>
					<Grid container spacing={2}>
						{!!categories &&
							categories.map(
								({
									id,
									name,
									created_at,
								}) => (
									<Grid item key={id} xs={12}>
										<div className=''>
											<Card className='flex justify-start items-center gap-2 rounded-lg p-4 shadow-md bg-white overflow-x-auto'>
												<span className='rounded-sm border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-b-slate-400 hover:border-orange-500 cursor-default'>
													ID #{id}
												</span>
												<div className='ml-6 flex-grow h-full'>
													<span className='text-3xl rounded-sm text-neutral-900 cursor-default'>
														{name}
														{/* <span className='italic font-light text-slate-600'>

														</span> */}
													</span>
												</div>
                                                <div className='ml-2 h-full'>
													<span className='text-xl rounded-sm text-neutral-900 cursor-default'>
														<span className='italic font-light text-slate-600'>
                                                            Created at{' '}
                                                            {new Date(
                                                                created_at
                                                            ).toLocaleDateString()}
														</span>
													</span>
												</div>
												<div className='ml-3 flex justify-center gap-4'>
													{/* <Button
														className={`
                                                            py-2 pb-1 px-4
                                                            bg-rose-600 hover:bg-rose-400
                                                            normal-case text-white
                                                            shadow-lg
                                                        `}
														onClick={() => handleReject(id)}
													>
														DELETE
													</Button>
													<Button
														className={`
                                                            py-2 pb-1 px-4
                                                            bg-sky-600 hover:bg-sky-400
                                                            normal-case text-white
                                                            shadow-lg
                                                        `}
														onClick={() => handleAccept(id)}
													>
														EDIT
													</Button> */}
												</div>
											</Card>
										</div>
									</Grid>
								)
							)}
						{!!categories &&
							categories.length === 0 && (
								<div className='w-full my-12 flex justify-center items-center'>
									<h1 className='text-2xl font-light text-red-600'>
										No categories were found...
									</h1>
								</div>
							)}
					</Grid>
				</Box>
				<Dialog open={open} onClose={handleClose}>
					<DialogContent className='p-6 pb-2 bg-neutral-200 '>
						<DialogContentText className='text-2xl text-neutral-900'>
                            New Category
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Name'
                            type='text'
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                        />
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => {
                                handleClose();
                                handleAddCategory();
                            }}>Add</Button>
                        </DialogActions>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const categoryLabels = data?.categories.map(({ id, name }) => name);

        console.log(data);

		return {
			props: {
                categories: data?.categories,
				categoryLabels,
			},
		};
	} catch (error) {
		console.log();
		return {
			props: {
                categories: [],
				categoryLabels: [],
			},
		};
	}
}
