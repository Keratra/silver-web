import Layout from '@components/Layout';
import {
	Button,
	Card,
	CssBaseline,
	Dialog,
	DialogContent,
	Divider,
	Fab,
	FormControl,
	Grid,
	InputLabel,
	Link,
	MenuItem,
	Select,
	TextareaAutosize,
	TextField,
} from '@mui/material';
import { VscSettings } from 'react-icons/vsc';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import FormData from 'form-data';
import { loadState, formatPrice } from 'lib';
import { PAYMENT_TYPES } from 'utils/constants';
import DealerSelector from '@components/DealerSelector';
import { Formik } from 'formik';
import {
	settingsModel,
	changePasswordModel,
	forgotPasswordModel,
} from 'lib/yupmodels';
import { FiSend } from 'react-icons/fi';
import { notify } from 'utils/notify';

export default function AdminSettingsPage() {
	const Router = useRouter();

	const handleAccountPasswordChange = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/change-password`;

			const { oldPassword, newPassword } = values;

			const token = loadState('token')?.token;

			const { data } = await axios.post(
				backendURL,
				{
					old_password: oldPassword,
					new_password: newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			notify('success', data?.message);
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

	// const handleDealerInvite = async (values, { setSubmitting }) => {
	// 	try {
	// 		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/invite-dealer`;

	// 		const { email } = values;

	// 		const token = loadState('token')?.token;

	// 		const { data } = await axios.post(
	// 			backendURL,
	// 			{
	// 				email: email,
	// 			},
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		);

	// 		notify('success', data?.message);
	// 	} catch (error) {
	// 		notify(
	// 			'error',
	// 			error?.response?.data?.message?.message ??
	// 				error?.response?.data?.message ??
	// 				error?.message
	// 		);
	// 	} finally {
	// 		setSubmitting(false);
	// 	}
	// };

	return (
		<Layout>
			<div className={`mx-2 md:mx-12`}>
				<section className={`mt-6 flex`}>
					<h1 className={`flex-grow font-semibold text-3xl text-center`}>
						Settings
					</h1>
				</section>

				<section className={`flex justify-center items-center gap-4`}>
					<div
						className='
							w-full max-w-xl py-4 mb-4 mx-2
							bg-white shadow-md
							rounded-sm '
					>
						<div className='w-full '>
							<Formik
								initialValues={settingsModel.initials}
								validationSchema={settingsModel.schema}
								onSubmit={handleAccountPasswordChange}
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
										className={`grid grid-cols-1 gap-6 content-center place-content-center px-4`}
									>
										<span
											className={`font-bold text-xl md:text-2xl text-center`}
										>
											Change Your Password
										</span>

										<TextField
											fullWidth
											id='oldPassword'
											name='oldPassword'
											label='Old Password'
											type='password'
											placeholder='Enter your old password...'
											className='bg-neutral-50 rounded-b-lg'
											value={values.oldPassword}
											onChange={handleChange}
											error={
												touched.oldPassword &&
												Boolean(errors.oldPassword)
											}
											helperText={
												touched.oldPassword && errors.oldPassword
											}
										/>

										<TextField
											fullWidth
											id='newPassword'
											name='newPassword'
											label='New Password'
											type='password'
											placeholder='Enter new password...'
											className='bg-neutral-50 rounded-b-lg'
											value={values.newPassword}
											onChange={handleChange}
											error={touched.newPassword && Boolean(errors.newPassword)}
											helperText={touched.newPassword && errors.newPassword}
										/>

										<TextField
											fullWidth
											id='confirmPassword'
											name='confirmPassword'
											label='Confirm Password'
											type='password'
											placeholder='Enter new password again...'
											className='bg-neutral-50 rounded-b-lg'
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
											className={`bg-black hover:bg-slate-800 text-white font-medium text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											SUBMIT
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div>

					{/* <div
						className='
							py-4 mb-4 mx-2
							bg-white shadow-md
							rounded-sm '
					>
						<div className='w-full '>
							<Formik
								initialValues={forgotPasswordModel.initials}
								validationSchema={forgotPasswordModel.schema}
								onSubmit={handleDealerInvite}
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
										className={`grid grid-cols-1 gap-6 content-center place-content-center px-4`}
									>
										<span
											className={`font-bold text-xl md:text-2xl text-center`}
										>
											Invite Customers
										</span>

										<TextField
											fullWidth
											id='email'
											name='email'
											label='Email'
											type='email'
											placeholder='Enter customer email...'
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
											className={`bg-black hover:bg-slate-800 text-white font-medium text-lg tracking-wider normal-case`}
											disabled={isSubmitting}
										>
											SEND
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div> */}
				</section>
			</div>
		</Layout>
	);
}
