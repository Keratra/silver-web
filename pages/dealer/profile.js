import Layout from '@components/Layout';
import {
	Box,
	Button,
	Card,
	FormControl,
	InputLabel,
	Link,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { dealerProfile } from 'lib/yupmodels';
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { notify } from 'utils/notify';

const fetcher = (url) => fetch(url).then((res) => res.json());

const classInput = 'bg-slate-100 rounded-b-lg';

const InfoBox = ({ title, info, colSpan = '1' }) => (
	<Box
		className={`
      col-span-full md:col-span-${colSpan}
      p-6 rounded-md
      bg-white 
      shadow-lg hover:shadow-xl
      text-center break-words
      transition-all
    `}
	>
		<Typography
			className={`
        -mt-3 mb-4 -ml-2
        font-normal text-md text-left
        drop-shadow-md text-orange-600
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

export default function Profile() {
	const { data, error } = useSWR('/api/dealer/get-info', fetcher);

	const Router = useRouter();

	const [page, setPage] = useState(0);

	const token = loadState('token')?.token;

	if (error)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					Bir hata oluştu.
				</div>
			</Layout>
		);
	if (!data)
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-orange-500 text-2xl font-['Roboto']">
					Yükleniyor...
				</div>
			</Layout>
		);

	if (!!data.message) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					Bir hata oluştu.
				</div>
			</Layout>
		);
	}

	const { address, city, country, email, name, phone } = data;

	const profileInitialValues = { ...data };

	const handleProfileUpdate = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/edit`;

			const { address, city, country, name, phone } = values;

			const formData = new FormData();

			formData.append('address', address);
			formData.append('city', city);
			formData.append('country', country);
			formData.append('name', name);
			formData.append('phone', phone);

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
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

	return (
		<Layout>
			<div className={`mt-6 px-5 md:px-12`}>
				{page === 0 && (
					<div className={`grid grid-cols-2 gap-5 max-w-lg mx-auto`}>
						<Button
							className={`
                col-span-2  
                py-3 px-12
                bg-slate-200 hover:bg-slate-300 shadow-lg
                text-black text-xl tracking-wider
                normal-case
              `}
							onClick={() => setPage(1)}
						>
							BİLGİLERİNİZİ GÜNCELLEYİN
						</Button>

						<Typography
							className={`col-span-2 my-8 font-semibold text-3xl text-center`}
						>
							Hesap Bilgileriniz
						</Typography>
						<InfoBox title='Bayi adı' info={name} colSpan='2' />
						<InfoBox title='E-posta' info={email} />
						<InfoBox title='Telefon' info={phone} />
						<InfoBox title='Şehir' info={city} />
						<InfoBox title='Ülke' info={country} />
						<InfoBox title='Adres' info={address} colSpan='2' />
						{/* <InfoBox title='Account Creation Date' info='24 Oct 2022' colSpan='2' /> */}

						<NextLink href='/dealer/change-password' passHref>
							<Link className={`col-span-2 text-center no-underline mb-4`}>
								<Typography
									className={`text-base text-neutral-700 hover:text-orange-500 transition-colors`}
								>
									Şifre Değiştir
								</Typography>
							</Link>
						</NextLink>
					</div>
				)}

				{page === 1 && (
					<div className={`grid grid-cols-2 gap-5 max-w-lg mx-auto`}>
						<Button
							className={`
                col-span-2  
                py-3 px-2 md:px-12
                bg-slate-200 hover:bg-slate-300 shadow-lg
                text-black text-xl tracking-wider
                normal-case
              `}
							onClick={() => setPage(0)}
						>
							BİLGİLERİNİZİ GÖRÜN
						</Button>

						<Typography
							className={`col-span-2 my-8 font-semibold text-3xl text-center`}
						>
							Bilgilerinizi Güncelleyin
						</Typography>

						<Card className='col-span-full m-2 p-1 py-2 bg-stone-50 shadow-xl'>
							<Formik
								initialValues={profileInitialValues}
								validationSchema={dealerProfile.schema}
								onSubmit={handleProfileUpdate}
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
											label='Bayi Adı'
											placeholder='Bayi adını giriniz...'
											fullWidth
											className={'col-span-2 ' + classInput}
											value={values.name}
											onChange={handleChange}
											error={touched.name && Boolean(errors.name)}
											helperText={touched.name && errors.name}
										/>

										<TextField
											id='city'
											name='city'
											label='Şehir'
											placeholder='Şehir giriniz...'
											fullWidth
											className={'col-span-2 md:col-span-1 ' + classInput}
											value={values.city}
											onChange={handleChange}
											error={touched.city && Boolean(errors.city)}
											helperText={touched.city && errors.city}
										/>

										<TextField
											id='country'
											name='country'
											label='Ülke'
											placeholder='Ülke giriniz...'
											fullWidth
											className={'col-span-2 md:col-span-1 ' + classInput}
											value={values.country}
											onChange={handleChange}
											error={touched.country && Boolean(errors.country)}
											helperText={touched.country && errors.country}
										/>

										<TextField
											id='address'
											name='address'
											label='Adres'
											placeholder='Adres giriniz...'
											fullWidth
											className={'col-span-2 ' + classInput}
											value={values.address}
											onChange={handleChange}
											error={touched.address && Boolean(errors.address)}
											helperText={touched.address && errors.address}
										/>

										<TextField
											id='phone'
											name='phone'
											label='Telefon'
											placeholder='Telefon numarası giriniz...'
											fullWidth
											className={'col-span-2 ' + classInput}
											value={values.phone}
											onChange={handleChange}
											error={touched.phone && Boolean(errors.phone)}
											helperText={touched.phone && errors.phone}
										/>

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
				)}
			</div>
		</Layout>
	);
}
