import Layout from '@components/Layout';
import NextLink from 'next/link';
import { useState } from 'react';
import { Box, Button, Card, Link, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { resetPasswordModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';
import { ArrowBack } from '@mui/icons-material';
import { loadState } from 'lib';

export default function DealerResetPassword() {
	const Router = useRouter();

	const handleChangePassword = async (
		{ password, confirmPassword },
		{ setSubmitting }
	) => {
		try {
			if (password !== confirmPassword) {
				notify('warning', 'Şifreler eşleşmiyor');
				return;
			}

			const token = loadState('token')?.token;

			const email_token = Router?.query?.token ?? 'something_went_wrong';

			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/dealer/reset-password/${email_token}`,
				{
					password: password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			notify('success', 'Şifreniz başarıyla değiştirildi');
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
						initialValues={resetPasswordModel.initials}
						validationSchema={resetPasswordModel.schema}
						onSubmit={handleChangePassword}
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
									Yeni Şifrenizi Giriniz
								</h1>

								<TextField
									fullWidth
									id='password'
									name='password'
									label='Yeni Şifre'
									type='password'
									placeholder='Yeni şifrenizi giriniz...'
									className='bg-neutral-50 rounded-b-lg'
									value={values.password}
									onChange={handleChange}
									error={touched.password && Boolean(errors.password)}
									helperText={touched.password && errors.password}
								/>

								<TextField
									id='confirmPassword'
									name='confirmPassword'
									label='Tekrar Şifre'
									type='password'
									placeholder='Tekrar yeni şifrenizi giriniz...'
									fullWidth
									className='bg-neutral-50 rounded-b-lg'
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
									className={`bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider`}
									disabled={isSubmitting}
								>
									DEĞİŞTİR
								</Button>
							</form>
						)}
					</Formik>
				</Card>
			</section>
		</Layout>
	);
}
