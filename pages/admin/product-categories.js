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
					<section className={`my-3 flex flex-wrap items-center gap-4 mb-8`}>
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
                                shadow-lg rounded-2xl text-base sm:text-xl
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
											<Card className='flex flex-col justify-start items-start gap-2 rounded-lg p-4 shadow-md bg-white overflow-x-auto'>
												<span className='text-xs sm:text-base rounded-sm border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-b-slate-400 hover:border-orange-500 cursor-default'>
													ID #{id}
												</span>
												<div className='ml-0 sm:ml-6 mt-2 flex-grow h-full'>
													<span className='text-2xl sm:text-3xl rounded-sm text-neutral-900 cursor-default'>
														{name}
													</span>
												</div>

												<div className='w-full text-end'>
													<span className='text-sm sm:text-base rounded-sm text-neutral-900 cursor-default'>
														<span className='italic font-light text-slate-600'>
															Created at{' '}
															{new Date(
																created_at
															).toLocaleDateString()}
														</span>
													</span>
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
