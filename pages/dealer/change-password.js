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
import { MdAddAPhoto } from 'react-icons/md';
import { Formik } from 'formik';
import { useState } from 'react';
import { changePasswordModel, registerProductModel } from 'lib/yupmodels';
import axios from 'axios';
import Image from 'next/image';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { notify } from 'utils/notify';

const classInput = '';

export default function ChangePasswordPage() {
	const Router = useRouter();

	const { token } = loadState('token');

	const { logout } = useAuth();

	const handlePasswordChangeSubmit = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/edit-password`;

			const { old_password, new_password } = values;

			const formData = new FormData();

			formData.append('old_password', old_password);
			formData.append('new_password', new_password);

			const test = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log(test);

			logout();

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
		<Layout>
			<div className={`px-2 md:px-12`}>
				<Box className={`mt-6`}>
					<section className={`mt-6 mb-3 flex`}>
						<h1 className={`flex-grow font-semibold text-3xl text-center`}>
							Şifre Değiştirme Ekranı
						</h1>
					</section>

					<section className='max-w-2xl mx-auto rounded-lg'>
						<Card className='p-1 shadow-xl bg-white'>
							<Formik
								initialValues={changePasswordModel.initials}
								validationSchema={changePasswordModel.schema}
								onSubmit={handlePasswordChangeSubmit}
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
										className={`grid grid-cols-1 gap-4 content-center p-4`}
									>
										<TextField
											fullWidth
											id='old_password'
											name='old_password'
											label='Eski Şifre'
											type='password'
											placeholder='Eski şifrenizi giriniz...'
											className=''
											value={values.old_password}
											onChange={handleChange}
											error={
												touched.old_password && Boolean(errors.old_password)
											}
											helperText={touched.old_password && errors.old_password}
										/>

										<TextField
											fullWidth
											id='new_password'
											name='new_password'
											label='Yeni Şifre'
											type='password'
											placeholder='Yeni şifrenizi giriniz...'
											className=''
											value={values.new_password}
											onChange={handleChange}
											error={
												touched.new_password && Boolean(errors.new_password)
											}
											helperText={touched.new_password && errors.new_password}
										/>

										<TextField
											id='confirmPassword'
											name='confirmPassword'
											label='Tekrar Yeni Şifre'
											type='password'
											placeholder='Tekrar yeni şifrenizi giriniz...'
											fullWidth
											className={classInput}
											value={values.confirmPassword}
											onChange={handleChange}
											error={
												touched.confirmPassword &&
												Boolean(errors.confirmPassword)
											}
											helperText={
												touched.confirmPassword && errors.confirmPassword
											}
										/>

										<Button
											variant='contained'
											color='primary'
											size='large'
											type='submit'
											className={`col-span-1 mx-auto px-12 bg-emerald-500 hover:bg-emerald-400 font-medium text-white text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											Değiştir
										</Button>
									</form>
								)}
							</Formik>
						</Card>
					</section>
				</Box>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/product/categories`;

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
