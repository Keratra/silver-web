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

			const { securityPassword, newPassword } = values;

			const token = loadState('token')?.token;

			const { data } = await axios.post(
				backendURL,
				{
					security_password: securityPassword,
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

	const handleSecurityPasswordChange = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/change-balance-password`;

			const { old_password, new_password } = values;

			const token = loadState('token')?.token;

			const { data } = await axios.post(
				backendURL,
				{
					old_password: old_password,
					new_password: new_password,
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

	const handleDealerInvite = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/invite-dealer`;

			const { email } = values;

			const token = loadState('token')?.token;

			const { data } = await axios.post(
				backendURL,
				{
					email: email,
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

	return (
		<Layout>
			<div className={`mx-2 md:mx-12`}>
				<section className={`mt-6 flex`}>
					<h1 className={`flex-grow font-semibold text-3xl text-center`}>
						Ayarlar
					</h1>
				</section>

				<section className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
					<div
						className='
              py-4 mb-4 mx-2
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
											Hesap Şifreniz
										</span>

										<TextField
											fullWidth
											id='securityPassword'
											name='securityPassword'
											label='Güvenlik Şifreniz'
											type='password'
											placeholder='Güvenlik şifrenizi giriniz...'
											className='bg-neutral-50 rounded-b-lg'
											value={values.securityPassword}
											onChange={handleChange}
											error={
												touched.securityPassword &&
												Boolean(errors.securityPassword)
											}
											helperText={
												touched.securityPassword && errors.securityPassword
											}
										/>

										<TextField
											fullWidth
											id='newPassword'
											name='newPassword'
											label='Yeni Şifreniz'
											type='password'
											placeholder='Yeni şifrenizi giriniz...'
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
											label='Tekrar Yeni Şifreniz'
											type='password'
											placeholder='Tekrar yeni şifrenizi giriniz...'
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
											GÜNCELLE
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div>

					<div
						className='
              py-4 mb-4 mx-2
              bg-white shadow-md
              rounded-sm '
					>
						<div className='w-full '>
							<Formik
								initialValues={changePasswordModel.initials}
								validationSchema={changePasswordModel.schema}
								onSubmit={handleSecurityPasswordChange}
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
											Güvenlik Şifreniz
										</span>

										<TextField
											fullWidth
											id='old_password'
											name='old_password'
											label='Eski Şifreniz'
											type='password'
											placeholder='Eski şifrenizi giriniz...'
											className='bg-neutral-50 rounded-b-lg'
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
											label='Yeni Şifreniz'
											type='password'
											placeholder='Yeni şifrenizi giriniz...'
											className='bg-neutral-50 rounded-b-lg'
											value={values.new_password}
											onChange={handleChange}
											error={
												touched.new_password && Boolean(errors.new_password)
											}
											helperText={touched.new_password && errors.new_password}
										/>

										<TextField
											fullWidth
											id='confirmPassword2'
											name='confirmPassword'
											label='Tekrar Yeni Şifreniz'
											type='password'
											placeholder='Tekrar yeni şifrenizi giriniz...'
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
											GÜNCELLE
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div>

					<div
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
											Bayi Davet Edin
										</span>

										<TextField
											fullWidth
											id='email'
											name='email'
											label='E-posta'
											type='email'
											placeholder='Bayi e-postası giriniz...'
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
											GÖNDER
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	);
}
