import Layout from '@components/Layout';
import NextLink from 'next/link';
import { useState } from 'react';
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
import { registerBayiModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';
import { ArrowBack } from '@mui/icons-material';
import country_cities from 'public/static/country_cities.json';

const classInput = 'bg-neutral-50 rounded-b-lg';

export default function Register({ brands }) {
	const Router = useRouter();

	const handleRegister = async (
		{ invite_key, name, address, city, country, phone, email, password },
		{ setSubmitting }
	) => {
		try {
			const { data } = await axios.post('/api/auth/dealer/register', {
				invite_key,
				name,
				address,
				city,
				country,
				phone,
				email,
				password,
			});

			Router.replace('/dealer/login');
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
		<Layout fullWidth>
			<div className='absolute'>
				<div className='relative top-2 left-2'>
					<NextLink href='/' passHref>
						<a
							style={{
								display: 'flex',
								alignItems: 'center',
								flexWrap: 'wrap',
							}}
							className=' text-slate-500 drop-shadow-sm hover:text-slate-900 transition-colors'
						>
							<ArrowBack /> <span className='ml-1 mt-1'>RETURN TO HOMEPAGE</span>
						</a>
					</NextLink>
				</div>
			</div>

			<section className='h-[100vh] flex flex-col justify-center items-center'>
				<Card
					className={`p-4 shadow-lg hover:shadow-xl transition-all rounded-md`}
				>
					<Formik
						initialValues={registerBayiModel.initials}
						validationSchema={registerBayiModel.schema}
						onSubmit={handleRegister}
					>
						{({
							values,
							errors,
							touched,
							handleChange,
							handleSubmit,
							isSubmitting,
						}) => (
							<form
								onSubmit={handleSubmit}
								className={`grid grid-cols-1 md:grid-cols-2 gap-4 m-4 min-w-[80vw] md:min-w-[60vw] lg:min-w-[40vw] xl:min-w-[25vw] content-center place-content-center max-w-sm mx-auto px-4`}
							>
								<Typography
									variant='h4'
									className={`md:col-span-2 font-semibold text-center`}
								>
									Dealer Register
								</Typography>

								<TextField
									id='email'
									name='email'
									label='Email'
									placeholder='Enter your email...'
									className={'md:col-span-2 ' + classInput}
									fullWidth
									value={values.email}
									onChange={handleChange}
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
								/>

								{/* <FormControl fullWidth>
									<InputLabel id={'admin_id_label'} className={``}>
										Marka
									</InputLabel>
									<Select
										id='admin_id'
										name='admin_id'
										label='Marka'
										labelId='admin_id_label'
										className='bg-neutral-50'
										fullWidth
										value={values.admin_id}
										onChange={handleChange}
										error={touched.admin_id && Boolean(errors.admin_id)}
										disabled={brands?.length === 0}
									>
										{brands.map(({ id, brand }) => (
											<MenuItem key={id} value={id}>
												{brand}
											</MenuItem>
										))}
									</Select>
								</FormControl> */}

								<TextField
									id='invite_key'
									name='invite_key'
									label='Invitation Code'
									placeholder='Enter your code here...'
									className={classInput}
									fullWidth
									value={values.invite_key}
									onChange={handleChange}
									error={touched.invite_key && Boolean(errors.invite_key)}
									helperText={touched.invite_key && errors.invite_key}
								/>

								<TextField
									id='name'
									name='name'
									label='Name'
									placeholder='Enter your dealer name...'
									className={classInput}
									fullWidth
									value={values.name}
									onChange={handleChange}
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
								/>

								<TextField
									id='phone'
									name='phone'
									label='Phone Number'
									placeholder='Enter your phone number...'
									className={'md:col-span-2 ' + classInput}
									fullWidth
									value={values.phone}
									onChange={handleChange}
									error={touched.phone && Boolean(errors.phone)}
									helperText={touched.phone && errors.phone}
								/>

								<FormControl fullWidth>
									<InputLabel id={'country_label'} className={``}>
										Country
									</InputLabel>
									<Select
										id='country'
										name='country'
										label='Country'
										labelId='country_label'
										className='bg-neutral-50'
										fullWidth
										value={values.country}
										onChange={handleChange}
										error={touched.country && Boolean(errors.country)}
										disabled={Object.keys(country_cities)?.length === 0}
									>
										{Object.keys(country_cities)?.map((name, index) => (
											<MenuItem key={index} value={name}>
												{name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<FormControl fullWidth>
									<InputLabel id={'city_label'} className={``}>
										City
									</InputLabel>
									<Select
										id='city'
										name='city'
										label='City'
										labelId='city_label'
										placeholder='Select your city...'
										className='bg-neutral-50'
										fullWidth
										value={values.city}
										onChange={handleChange}
										error={touched.city && Boolean(errors.city)}
										disabled={country_cities[values.country]?.length === 0}
									>
										{country_cities[values.country]?.map((name, index) => (
											<MenuItem key={index} value={name}>
												{name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<TextField
									id='address'
									name='address'
									label='Address'
									placeholder='Enter your address...'
									className={'md:col-span-2 ' + classInput}
									fullWidth
									value={values.address}
									onChange={handleChange}
									error={touched.address && Boolean(errors.address)}
									helperText={touched.address && errors.address}
								/>

								<TextField
									id='password'
									name='password'
									label='Password'
									type='password'
									placeholder='Enter your password...'
									className={classInput}
									fullWidth
									value={values.password}
									onChange={handleChange}
									error={touched.password && Boolean(errors.password)}
									helperText={touched.password && errors.password}
								/>

								<TextField
									id='confirmPassword'
									name='confirmPassword'
									label='Confirm Password'
									type='password'
									placeholder='Enter your password again...'
									fullWidth
									className={classInput}
									value={values.confirmPassword}
									onChange={handleChange}
									error={
										touched.confirmPassword && Boolean(errors.confirmPassword)
									}
									helperText={touched.confirmPassword && errors.confirmPassword}
								/>

								<Button
									variant='contained'
									color='primary'
									size='large'
									type='submit'
									className={`md:col-span-2 bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
									disabled={isSubmitting}
								>
									REGISTER
								</Button>

								<Typography
									variant='body2'
									className={`md:col-span-2 place-self-center -mb-2 text-slate-500 drop-shadow-sm`}
								>
									Already registered?{' '}
									<NextLink href='/dealer/login' passHref>
										<Link className={`text-slate-500`}>Login here!</Link>
									</NextLink>
								</Typography>
							</form>
						)}
					</Formik>
				</Card>
			</section>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/register`;

		const { data } = await axios.get(backendURL);

		const { brands } = data;

		return {
			props: {
				brands,
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
				brands: [],
			},
		};
	}
}
