import Layout from '@components/Layout';
import {
	Box,
	Button,
	Card,
	createTheme,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextareaAutosize,
	TextField,
	Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { updateImageModel, updateProductModel } from 'lib/yupmodels';
import { useState } from 'react';
import axios from 'axios';
import { formatPrice, loadState } from 'lib';
import { useRouter } from 'next/router';
import Product from '@components/Product';
import { MdAddAPhoto } from 'react-icons/md';
import { notify } from 'utils/notify';
import { supabase } from 'lib/initSupabase';
import { v4 as uuidv4 } from 'uuid';

const classInput = '';

const InfoBox = ({ title, info, colSpan = '1' }) => (
	<Box
		className={`
      col-span-full md:col-span-${colSpan}
      p-6 rounded-md
      hover:scale-[105%]
      bg-white
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

export default function ProductDetailsPage({
	data,
	categories,
	categoryLabels,
}) {
	const Router = useRouter();

	const [image, setImage] = useState(null);
	const [createObjectURL, setCreateObjectURL] = useState('');
	const [page, setPage] = useState(0);
	const [imageNameX, setImageName] = useState('');


	const {
		id,
		name,
		image: imageName,
		category_id,
		description,
		created_at,
		is_active,
		price,
	} = data.product;

	const createdAtDate = new Date(created_at).toLocaleDateString('tr-TR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	});

	const handleProductUpdate = async (values, { setSubmitting }) => {
		try {
			const { token } = loadState('token');
			const { name, category_id, price, description } = values;

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/edit/${id}`;

			await axios.post(backendURL, {
				name,
				category_id,
				price,
				description,
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			Router.reload();
		} catch (error) {
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);

			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleImageUpdate = async (values, { setSubmitting }) => {
		try {
			const { token } = loadState('token');
			const { image } = values;

			const fileType = image?.name.split(".")[image?.name.split(".").length - 1];
			const tempImageName = `${uuidv4()}.${fileType}`;
			setImageName(tempImageName);

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/edit/${id}`;

			await axios.post(backendURL, {
				image: tempImageName,
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			try {
				
				const { data: dataSupabase, error: errorSupabase } = await supabase
				.storage
				.from('product_images')
				.upload(tempImageName, image, {
					cacheControl: '3600',
					upsert: false
				})

				console.log("dataSupabase")
				console.log(dataSupabase)
				console.log("errorSupabase")
				console.log(errorSupabase)
			} catch (error) {
				notify('error', error?.response?.data?.message?.message ?? error?.response?.data?.message ?? error?.message ?? 'Image could not be uploaded.');
				console.log(error);
			}

			Router.reload();
		} catch (error) {
			console.log(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);

			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
		}
	};

	const uploadToClient = (event) => {
		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0];

			setImage(i);
			setCreateObjectURL(URL.createObjectURL(i));
		}
	};

	const productInitialValues = { ...data.product };

	return (
		<Layout>
			<div className={`mt-24 px-12 grid grid-cols-1 md:grid-cols-2 gap-4 `}>
				<section>
					<Product product={{ id, image: imageName }} sendOnlyImage />
				</section>
				<section className=''>
					{page === 0 && (
						<div className={`grid grid-cols-2 gap-5 max-w-lg mx-auto`}>
							<Button
								className={`
                col-span-2  
                py-3 px-12
                bg-stone-300 hover:bg-stone-400
                text-black text-xl tracking-wider
                normal-case
              `}
								onClick={() => setPage(1)}
							>
								UPDATE INFORMATION
							</Button>

							<Typography
								className={`col-span-2 my-8 font-semibold text-3xl text-center`}
							>
								PRODUCT INFO
							</Typography>
							<InfoBox title='Product Name' info={name} colSpan='1' />
							<InfoBox title='Price' info={formatPrice(price)} colSpan='1' />
							<InfoBox title='Description' info={description} />
							<InfoBox
								title='Category'
								info={categoryLabels[parseInt(category_id) - 1]}
							/>
							<InfoBox
								title='Created at'
								info={createdAtDate}
								colSpan='2'
							/>
						</div>
					)}

					{page === 1 && (
						<div className={`grid grid-cols-2 gap-5 max-w-lg mx-auto`}>
							<Button
								className={`
                col-span-2  
                py-3 px-12
                bg-stone-300 hover:bg-stone-400
                text-black text-xl tracking-wider
                normal-case
              `}
								onClick={() => setPage(0)}
							>
								VIEW PRODUCT INFO
							</Button>

							<Typography
								className={`col-span-2 my-8 font-semibold text-3xl text-center`}
							>
								UPDATE INFORMATION
							</Typography>

							<Card
								className='
								col-span-full m-2 p-1 py-2 shadow-md 
								bg-white'
							>
								<Formik
									initialValues={productInitialValues}
									validationSchema={updateProductModel.schema}
									onSubmit={handleProductUpdate}
								>
									{({
										setFieldValue,
										values,
										errors,
										touched,
										handleChange,
										handleSubmit,
										isSubmitting,
									}) => (
										<form
											onSubmit={handleSubmit}
											className={`grid grid-cols-2 gap-6 content-center place-content-center p-4`}
										>
											<TextField
												id='name'
												name='name'
												label='Product Name'
												placeholder='Enter product name...'
												fullWidth
												className={'col-span-1 ' + classInput}
												value={values.name}
												onChange={handleChange}
												error={touched.name && Boolean(errors.name)}
												helperText={touched.name && errors.name}
											/>

											<TextField
												id='price'
												name='price'
												label='Price'
												placeholder='Enter product price...'
												fullWidth
												className={'col-span-1 ' + classInput}
												value={values.price}
												onChange={handleChange}
												error={touched.price && Boolean(errors.price)}
												helperText={touched.price && errors.price}
											/>

											<FormControl fullWidth className='col-span-2'>
												<InputLabel id={'category_label'} className={``}>
													Category
												</InputLabel>

												<Select
													id='category'
													name='category'
													label='Category'
													labelId='category_label'
													className=''
													fullWidth
													value={values.category_id}
													onChange={(e) => {
														setFieldValue('category_id', e.target.value);
													}}
													error={
														touched.category_id && Boolean(errors.category_id)
													}
												>
													{categories.map(({ id, name }) => (
														<MenuItem key={id} value={id}>
															{name}
														</MenuItem>
													))}
												</Select>
												<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 rounded-b-lg'>
													{errors.category &&
														touched.category &&
														errors.category}
												</p>
											</FormControl>

											<TextareaAutosize
												id='description'
												name='description'
												placeholder='Enter product description...'
												maxLength={500}
												minRows={3}
												maxRows={5}
												className={`col-span-2 p-2 bg-transparent border-neutral-600 hover:border-neutral-400 rounded-md text-black font-sans text-base resize-y`}
												value={values.description}
												onChange={handleChange}
												error={touched.description && errors.description}
											/>

											<p className='-my-4 ml-3 text-xs col-span-2 text-rose-600'>
												{errors.description &&
													touched.description &&
													errors.description}
											</p>

											<Button
												variant='contained'
												color='primary'
												size='large'
												type='submit'
												className={`col-span-2 mx-auto px-12 bg-emerald-600 hover:bg-emerald-400 font-medium text-lg text-white tracking-wider normal-case`}
												disabled={isSubmitting}
											>
												UPDATE
											</Button>
										</form>
									)}
								</Formik>
							</Card>

							<Card
								className='
                    col-span-full m-2 p-1 py-2 shadow-md 
                    bg-white'
							>
								<Formik
									initialValues={updateImageModel.initials}
									validationSchema={updateImageModel.schema}
									onSubmit={handleImageUpdate}
								>
									{({
										setFieldValue,
										values,
										errors,
										touched,
										handleChange,
										handleSubmit,
										isSubmitting,
									}) => (
										<form
											onSubmit={handleSubmit}
											className={`grid grid-cols-2 gap-6 content-center place-content-center p-4 text-white`}
										>
											<Button
												variant='contained'
												size='large'
												component='label'
												className={`col-span-2 md:col-span-1 mx-auto px-12 bg-sky-700 hover:bg-sky-500 font-medium text-lg text-white tracking-wider normal-case`}
											>
												<span>UPLOAD</span>
												<MdAddAPhoto size={22} className='ml-1.5' />
												<input
													hidden
													accept='image/*'
													name='productImage'
													type='file'
													onChange={(e) => {
														uploadToClient(e);
														setFieldValue('image', e.target.files[0]);
													}}
													className='border-2 border-solid'
												/>
											</Button>

											<span className='flex justify-center items-center shadow-md rounded-lg border-solid border border-gray-400 text-neutral-900'>
												{image?.name}

												<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-400 rounded-b-lg'>
													{errors.image && touched.image && errors.image}
												</p>
											</span>

											<Button
												variant='contained'
												color='primary'
												size='large'
												type='submit'
												className={`col-span-2 mx-auto px-12 bg-emerald-600 hover:bg-emerald-400 font-medium text-lg text-white tracking-wider normal-case`}
												disabled={isSubmitting}
											>
												CHANGE PICTURE
											</Button>
										</form>
									)}
								</Formik>
							</Card>
						</div>
					)}
				</section>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const { id } = query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/${id}`;

		const backendURLCategories = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		// console.log(data);

		const { data: categoryData } = await axios.get(backendURLCategories, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { categories } = categoryData;

		const categoryLabels = categories.map(({ id, name }) => name);

		return {
			props: {
				data,
				categories,
				categoryLabels,
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
				data: {
					message: 'Bilgi alınırken hata alındı',
				},
			},
		};
	}
}
