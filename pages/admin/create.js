/* eslint-disable @next/next/no-img-element */
import Layout from '@components/Layout';
import Product from '@components/Product';
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
import useSWR from 'swr';
import Image from 'next/image';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { notify } from 'utils/notify';
import { supabase } from 'lib/initSupabase';
import { v4 as uuidv4 } from 'uuid';

const fetcher = (url) => fetch(url).then((res) => res.json());

const classInput = 'bg-slate-100 rounded-b-lg';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 90,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
}

export default function CreateProduct() {
	const { data, error } = useSWR('/api/admin/get-categories', fetcher);

	const Router = useRouter();

	const [testProduct, setTestProduct] = useState(registerProductModel.initials);

	const [image, setImage] = useState(null);
	const [imageName, setImageName] = useState('');

	const [createObjectURL, setCreateObjectURL] = useState('');

	// const [crop, setCrop] = useState();
	// const [imageUrl, setImageUrl] = useState('');
	// const [output, setOutput] = useState(null);
	// const [src, setSrc] = useState(null);

	// const allowedFileTypes = `image/gif image/png, image/jpeg, image/x-png`;
	// const [viewImage, setViewImage] = useState(undefined);
	// const [crop, setCrop] = useState({
	//   aspect: 1 / 1,
	//   height: 468,
	//   unit: 'px',
	//   width: 468,
	//   x: 0,
	//   y: 107,
	// });
	// const [image, setImage] = useState(undefined);
	// const [imageUrl, setImageUrl] = useState(undefined);

	const auth = loadState('token');

	const token = auth?.token;

	if (error)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					An error occured.
				</div>
			</Layout>
		);
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

	const { categories } = data;

	const labels = categories.map(({ id, name }) => name);

	const handleProductSubmit = async (values, { setSubmitting }) => {
		try {
			const fileType = image?.name.split(".")[image?.name.split(".").length - 1];
			const tempImageName = `${uuidv4()}.${fileType}`;
			setImageName(tempImageName);

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/add`;

			const { name, category, description, price } = values;

			const { data } = await axios.post(backendURL, {
				name,
				category_id: category,
				description,
				price,
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
			} catch (error) {
				notify('error', error?.response?.data?.message?.message ?? error?.response?.data?.message ?? error?.message ?? 'Image could not be uploaded.');
				console.log(error);
			}

			Router.replace('/admin/products');
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

			if (i?.size / 1024 / 1024 > 10) {
				notify('warning', 'Maksimum boyut 10 Megabayttır.');
				return;
			}

			setImage(i);
			setCreateObjectURL(URL.createObjectURL(i));
		}
	};

	// function onImageLoad(e) {
	//   // console.log(e);
	//   const { width, height } = e.currentTarget;
	//   setCrop(centerAspectCrop(width, height, 1 / 1));
	// }

	// // const uploadToServer = async (event) => {
	// //   const body = new FormData();
	// //   body.append('file', image);
	// //   const response = await fetch('/api/file', {
	// //     method: 'POST',
	// //     body,
	// //   });
	// // };

	// function imageCropComplete(crop) {
	//   // userCrop(crop);
	//   console.log(crop);
	//   console.log(image);
	// }

	// async function userCrop(crop) {
	//   if (image && crop.width && crop.height) {
	//     await getCroppedImage(image, crop, 'newFile.jpeg');
	//   }
	// }

	// function getCroppedImage(image, crop, fileName) {
	//   const imageCanvas = document.createElement('canvas');

	//   console.log(image);

	//   const scaleX = image.naturalWidth / image.width;
	//   const scaleY = image.naturalHeight / image.height;

	//   imageCanvas.width = crop.width;
	//   imageCanvas.height = crop.height;

	//   const imgCtx = imageCanvas.getContext('2d');

	//   console.log(imgCtx);

	//   imgCtx.drawImage(
	//     image,
	//     crop.x * scaleX,
	//     crop.y * scaleY,
	//     crop.width * scaleX,
	//     crop.height * scaleY,
	//     0,
	//     0,
	//     crop.width,
	//     crop.height
	//   );

	//   return new Promise((reject, resolve) => {
	//     imageCanvas.toBlob((blob) => {
	//       if (!blob) {
	//         reject(new Error('the image canvas is empty'));
	//         return;
	//       }
	//       blob.name = fileName;
	//       let imageURL;
	//       window.URL.revokeObjectURL(imageURL);
	//       imageURL = window.URL.createObjectURL(blob);
	//       resolve(imageURL);
	//       setImageUrl(blob);
	//     }, 'image/jpeg');
	//   });
	// }

	return (
		<Layout>
			<h1 className={`flex-grow font-semibold text-3xl text-center`}>
				Product Creation
			</h1>
			<div
				className={`mt-6 px-2 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-4`}
			>
				{/* <section className='bg-[#111] border-solid hover:ring-4 ring-[#ffd700] border-zinc-600 hover:border-[#ffd700] shadow-none hover:shadow-2xl transition-all'>
          {image !== null && (
            <ReactCrop
              crop={crop}
              aspect={1 / 1}
              onChange={(c) => setCrop(c)}
              onComplete={imageCropComplete}
            >
              <img
                src={createObjectURL}
                onLoad={onImageLoad}
                alt='uploaded product'
                className='bg-neutral-900'
              />
            </ReactCrop>
          )}
        </section> */}

				<section className='aspect-square bg-white border-solid border-zinc-200 shadow-md hover:shadow-2xl transition-all'>
					<Card className=' mx-auto bg-white rounded-none shadow-none hover:shadow-2xl transition-all cursor-none'>
						{image !== null && (
							<Image
								src={createObjectURL}
								alt='uploaded product'
								width={1000}
								height={1000}
								className='bg-white'
							/>
						)}
					</Card>
				</section>

				<Box className={``}>
					<Card className='max-w-2xl mx-auto shadow-xl m-2 p-1 bg-stone-50 border-solid border-2 border-slate-200'>
						<Formik
							initialValues={testProduct}
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
									onChange={(e) =>
										setTestProduct({
											...testProduct,
											[e.target.name]: e.target.value,
										})
									}
									className={`grid grid-cols-2 gap-6 content-center place-content-center p-4`}
								>
									<TextField
										id='name'
										name='name'
										label='Product Name'
										placeholder='Enter product name...'
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
										className={`col-span-2 lg:col-span-1 mx-auto px-12 bg-sky-700 hover:bg-sky-500 font-medium text-lg tracking-wider normal-case`}
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

									<span className='col-span-2 lg:col-span-1 py-1 flex justify-center items-center shadow-md rounded-lg border-solid border border-gray-400 text-slate-500  bg-slate-100'>
										{image?.name}

										<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 bg-neutral-50 rounded-b-lg'>
											{errors.image && touched.image && errors.image}
										</p>
									</span>

									<FormControl fullWidth className='col-span-2'>
										<InputLabel id={'category_label'} className={``}>
											Category
										</InputLabel>
										<Select
											id='category'
											name='category'
											label='Category'
											labelId='category_label'
											className='bg-slate-100'
											fullWidth
											value={values.category}
											onChange={(e) => {
												setTestProduct({
													...testProduct,
													[e.target.name]: labels[parseInt(e.target.value) - 1],
												});
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
											{errors.category && touched.category && errors.category}
										</p>
									</FormControl>

									

									<TextField
										id='price'
										name='price'
										label='Price'
										placeholder='Enter product price...'
										fullWidth
										className={'col-span-2 ' + classInput}
										value={values.price}
										onChange={handleChange}
										error={touched.price && Boolean(errors.price)}
										helperText={touched.price && errors.price}
									/>

									<TextareaAutosize
										id='description'
										name='description'
										placeholder='Enter product description...'
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
										CREATE
									</Button>
								</form>
							)}
						</Formik>
					</Card>
				</Box>

				{/* <button className='' type='submit' onClick={uploadToServer}>
          Send to server
        </button> */}
			</div>
		</Layout>
	);
}
