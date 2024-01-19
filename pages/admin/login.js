import Layout from '@components/Layout';
import { useState } from 'react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useAuth } from 'contexts/auth/AuthProvider';
import { loginModel } from 'lib/yupmodels';
import { useRouter } from 'next/router';
import axios from 'axios';
import { USER_TYPE_ADMIN } from 'utils/constants';
import { useApp, useAppUpdate } from 'contexts/AppContext';
import { notify } from 'utils/notify';
import NextLink from 'next/link';
import { ArrowBack } from '@mui/icons-material';

const loginType = USER_TYPE_ADMIN;

export default function Login() {
	const Router = useRouter();

	const { loginWithToken } = useAuth();

	const appState = useApp();
	const setAppState = useAppUpdate();

	const handleLogin = async ({ email, password }, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/auth/${loginType}/login`, {
				email: email,
				password: password,
			});

			loginWithToken({
				token: data.access_token,
				userName: data.brand,
				userType: loginType,
			});

			setAppState({
				...appState,
				token: data.access_token,
				userType: loginType,
			});

			Router.replace('/admin');
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
						initialValues={loginModel.initials}
						validationSchema={loginModel.schema}
						onSubmit={handleLogin}
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
								className={`grid grid-cols-1 gap-4 m-4 min-w-[80vw] md:min-w-[60vw] lg:min-w-[40vw] xl:min-w-[25vw] content-center place-content-center max-w-sm mx-auto px-4`}
							>
								<h1 className={`font-semibold text-center m-0 -mt-2`}>
									Admin Login
								</h1>

								<TextField
									fullWidth
									id='email'
									name='email'
									label='Email'
									placeholder='Enter your email...'
									className='bg-neutral-50 rounded-b-lg'
									value={values.email}
									onChange={handleChange}
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
								/>

								<TextField
									fullWidth
									id='password'
									name='password'
									label='Password'
									type='password'
									placeholder='Enter your password...'
									className='bg-neutral-50 rounded-b-lg'
									value={values.password}
									onChange={handleChange}
									error={touched.password && Boolean(errors.password)}
									helperText={touched.password && errors.password}
								/>

								<Button
									variant='contained'
									color='primary'
									size='large'
									type='submit'
									className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
									disabled={isSubmitting}
								>
									LOGIN
								</Button>
							</form>
						)}
					</Formik>
				</Card>
			</section>
		</Layout>
	);
}
