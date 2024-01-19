import Layout from '@components/Layout';
import NextLink from 'next/link';
import { useState } from 'react';
import { Box, Button, Card, Link, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { forgotPasswordModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';
import { ArrowBack } from '@mui/icons-material';
import { loadState } from 'lib';

export default function DealerForgotPassword() {
	const Router = useRouter();

	const handleEmailSend = async ({ email }, { setSubmitting }) => {
		try {
			// const { data } = await axios.post(`/api/`, {
			// 	password: password,
			// });

			const token = loadState('token')?.token;

			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/dealer/forgot-password`,
				{
					email: email,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			notify('info', data);

			notify('success', 'Şifre sıfırlama e-postası gönderildi.');
			Router.replace('/dealer/login');
		} catch (error) {
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
							<ArrowBack /> <span className='ml-1 mt-1'>ANASAYFAYA DÖNÜN</span>
						</a>
					</NextLink>
				</div>
			</div>

			<section className='h-[100vh] flex flex-col justify-center items-center'>
				<Card
					className={`p-4 shadow-lg hover:shadow-xl transition-all rounded-md`}
				>
					<Formik
						initialValues={forgotPasswordModel.initials}
						validationSchema={forgotPasswordModel.schema}
						onSubmit={handleEmailSend}
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
									Hesabınızın e-posta adresini giriniz
								</h1>

								<TextField
									fullWidth
									id='email'
									name='email'
									label='E-posta'
									placeholder='E-postanızı giriniz...'
									className='bg-neutral-50 rounded-b-lg'
									value={values.email}
									onChange={handleChange}
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
								/>

								<Button
									variant='contained'
									color='primary'
									size='large'
									type='submit'
									className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider`}
									disabled={isSubmitting}
								>
									GÖNDER
								</Button>
							</form>
						)}
					</Formik>
				</Card>
			</section>
		</Layout>
	);
}
