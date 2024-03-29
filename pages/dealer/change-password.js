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
import { changePasswordModel } from 'lib/yupmodels';
import axios from 'axios';
import Image from 'next/image';
import { loadState } from 'lib';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { notify } from 'utils/notify';

const classInput = '';

export default function ChangePasswordPage() {
	const Router = useRouter();

	const { logout } = useAuth();

	const handlePasswordChangeSubmit = async (values, { setSubmitting }) => {
		try {

			const { token } = loadState('token');

			const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/change-password`;

			const { old_password, new_password } = values;

			const test = await axios.post(backendURL, 
				{
					old_password,
					new_password,
				}, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
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
							Change Password
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
											label='Old Password'
											type='password'
											placeholder='Enter your old password...'
											className=''
											value={values.old_password}
											onChange={handleChange}
											error={touched.old_password && Boolean(errors.old_password)}
											helperText={touched.old_password && errors.old_password}
										/>

										<TextField
											fullWidth
											id='new_password'
											name='new_password'
											label='New Password'
											type='password'
											placeholder='Enter your new password...'
											className=''
											value={values.new_password}
											onChange={handleChange}
											error={touched.new_password && Boolean(errors.new_password)}
											helperText={touched.new_password && errors.new_password}
										/>

										<TextField
											id='confirmPassword'
											name='confirmPassword'
											label='Confirm New Password'
											type='password'
											placeholder='Enter your new password again...'
											fullWidth
											className={classInput}
											value={values.confirmPassword}
											onChange={handleChange}
											error={touched.confirmPassword && Boolean(errors.confirmPassword)}
											helperText={touched.confirmPassword && errors.confirmPassword}
										/>

										<Button
											variant='contained'
											color='primary'
											size='large'
											type='submit'
											className={`col-span-1 mx-auto px-12 bg-emerald-500 hover:bg-emerald-400 font-medium text-white text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											Change
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