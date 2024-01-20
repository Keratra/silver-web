import Layout from '@components/Layout';
import {
	Box,
	Button,
	Card,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextareaAutosize,
	TextField,
	Typography,
} from '@mui/material';
import { MdAddAPhoto } from 'react-icons/md';
import { Formik } from 'formik';
import { useState } from 'react';
import { registerProductModel } from 'lib/yupmodels';
import axios from 'axios';
import Image from 'next/image';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

const classInput = 'bg-slate-100 rounded-b-lg';

export default function CreateProductOffer({ categories, labels }) {
	const Router = useRouter();

	const [image, setImage] = useState(null);
	const [createObjectURL, setCreateObjectURL] = useState('');

	const token = loadState('token')?.token;

	const handleProductSubmit = async (values, { setSubmitting }) => {
		try {
			// const { data } = await axios.post(`/api/asd/asd`, {
			//   ...values,
			// });

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/products/offer`;

			const { name, category, description } = values;

			const formData = new FormData();

			formData.append('product_name', name);
			formData.append('category_id', category);
			formData.append('product_description', description);
			formData.append('image', image);

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			Router.replace('/dealer');
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

	// const uploadToServer = async (event) => {
	//   const body = new FormData();
	//   body.append('file', image);
	//   const response = await fetch('/api/file', {
	//     method: 'POST',
	//     body,
	//   });
	// };

	return (
		<Layout>
			<div className={`px-2 md:px-12`}>
				<Box className={`mx-2 mt-6`}>
					<section className={`mt-6 mb-3 flex`}>
						<h1 className={`flex-grow font-semibold text-3xl text-center`}>
							Ürün Oluşturma Ekranı
						</h1>
					</section>
					<section className={`grid grid-cols-2 gap-4`}>
						<Card className='col-span-2 lg:col-span-1 max-w-[750px] max-h-[750px] aspect-square bg-white border-solid border-zinc-200 shadow-md hover:shadow-2xl transition-all'>
							{image !== null && (
								<Image
									src={createObjectURL}
									alt='uploaded product'
									width={1000}
									height={1000}
									className='bg-white'
								/>
							)}
							<span className='h-full flex justify-center items-center font-medium text-xl animate-pulse'>
								Bir resim yükleyiniz...
							</span>
						</Card>
						<div className='col-span-2 lg:col-span-1'>
							<Card className='m-1 p-1 bg-stone-50 shadow-xl border-solid border-2 border-slate-200'>
								<Formik
									initialValues={registerProductModel.initials}
									validationSchema={registerProductModel.schema}
									onSubmit={handleProductSubmit}
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
												label='Ürün Adı'
												placeholder='Ürün adını giriniz...'
												fullWidth
												className={'col-span-2 ' + classInput}
												value={values.name}
												onChange={handleChange}
												error={touched.name && Boolean(errors.name)}
												helperText={touched.name && errors.name}
											/>

											<Button
												variant='contained'
												size='large'
												component='label'
												className={`col-span-2 lg:col-span-1 mx-auto px-12 bg-sky-600 hover:bg-sky-400 font-medium text-lg tracking-wider normal-case`}
											>
												<span>Yükle</span>
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

											<span className='col-span-2 lg:col-span-1 min-h-[2rem] flex justify-center items-center px-2 shadow-md rounded-lg border-solid border border-gray-400 text-slate-500  bg-slate-100'>
												{image?.name}

												<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 bg-neutral-50 rounded-b-lg'>
													{errors.image && touched.image && errors.image}
												</p>
											</span>

											<FormControl fullWidth className='col-span-2'>
												<InputLabel id={'category_label'} className={``}>
													Kategori
												</InputLabel>
												<Select
													id='category'
													name='category'
													label='Kategori'
													labelId='category_label'
													className='bg-slate-100'
													fullWidth
													value={values.category}
													onChange={(e) => {
														setFieldValue('category', e.target.value);
													}}
													error={touched.category && Boolean(errors.category)}
												>
													{categories.map(({ id, name }) => (
														<MenuItem key={id} value={id}>
															{name}
														</MenuItem>
													))}
												</Select>
												<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 bg-neutral-50 rounded-b-lg'>
													{errors.category &&
														touched.category &&
														errors.category}
												</p>
											</FormControl>

											<TextareaAutosize
												id='description'
												name='description'
												placeholder='Ürün açıklaması giriniz...'
												maxLength={500}
												minRows={3}
												maxRows={5}
												className={`col-span-2 p-2 bg-slate-100 border-neutral-400 hover:border-black rounded-md font-sans text-base resize-y ${
													touched.description && Boolean(errors.description)
														? 'border-rose-500 hover:border-rose-600'
														: ''
												} `}
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
												className={`col-span-2 mx-auto px-12 bg-emerald-700 hover:bg-emerald-500 font-medium text-lg tracking-wider normal-case`}
												disabled={isSubmitting}
											>
												Gönder
											</Button>
										</form>
									)}
								</Formik>
							</Card>
						</div>
					</section>
				</Box>

				{/* <button className='' type='submit' onClick={uploadToServer}>
          Send to server
        </button> */}
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/product/categories`;

	const token = req.cookies.token;

	const { data } = await axios.get(backendURL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const { categories } = data;

	const labels = categories.map(({ id, name }) => name);

	return {
		props: {
			categories,
			labels,
		},
	};
}
