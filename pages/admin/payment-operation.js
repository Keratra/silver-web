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
import { paymentModel, paymentVerifyModel } from 'lib/yupmodels';
import { FiSend } from 'react-icons/fi';
import { notify } from 'utils/notify';

export default function DealerPaymentsPage({ error, dealers }) {
	const Router = useRouter();

	const [selectedDealer, setSelectedDealer] = useState('');
	const [verified, setVerified] = useState(false);

	const handleDealerChange = (e) => {
		setSelectedDealer(e.target.value);
	};

	const handlePaymentSubmit = async (values, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/payment/get`;

			const { dealer_id, amount, payment_type, description } = values;

			const formData = new FormData();

			formData.append('dealer_id', dealer_id);
			formData.append('payment_type', payment_type);
			formData.append('amount', amount);
			formData.append('description', description);

			const token = loadState('token')?.token;

			const { data } = await axios.post(backendURL, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			Router.replace('/admin/payments');
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

	const handleVerification = async ({ email, password }, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/auth/admin/payment-verify`, {
				password,
			});

			if (!!data?.is_verified) {
				setVerified(true);
			} else {
				notify('error', 'Güvenlik şifresi yanlış.');
			}
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

	if (!verified) {
		return (
			<Layout>
				<div className={`w-full min-h-[90vh] flex justify-center items-center`}>
					<section className={`p-6 bg-white shadow-md rounded-md`}>
						<Formik
							initialValues={paymentVerifyModel.initials}
							validationSchema={paymentVerifyModel.schema}
							onSubmit={handleVerification}
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
									className={`grid grid-cols-1 gap-6 content-center place-content-center max-w-sm mx-auto`}
								>
									<span
										className={`text-3xl font-semibold text-center text-gray-700 drop-shadow-md`}
									>
										Güvenlik Şifresi
									</span>

									<TextField
										fullWidth
										id='password'
										name='password'
										label='Şifre'
										type='password'
										placeholder='Şifrenizi giriniz...'
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
										Ödemeye Geç
									</Button>
								</form>
							)}
						</Formik>
					</section>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className={`max-w-2xl mx-auto`}>
				<section className={`mt-6 flex`}>
					<h1
						className={`pl-4 xl:pl-0 flex-grow font-semibold text-3xl text-center`}
					>
						Ödeme İşlemleri
					</h1>
				</section>

				<section
					className='
            py-4 mb-4 mx-2
						bg-white shadow-md
            rounded-sm '
				>
					<div className='w-full '>
						<Formik
							initialValues={paymentModel.initials}
							validationSchema={paymentModel.schema}
							onSubmit={handlePaymentSubmit}
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
									<DealerSelector
										title='Bayiler'
										emptyOptionTitle='Bir bayi seçiniz...'
										dealers={dealers}
										selectedDealer={selectedDealer}
										handleDealerChange={(e) => {
											handleDealerChange(e);
											setFieldValue('dealer_id', e.target.value);
										}}
									/>
									<TextField
										id='amount'
										name='amount'
										label='Miktar'
										type='number'
										placeholder='Ödenen tutarı giriniz...'
										fullWidth
										value={values.amount}
										onChange={handleChange}
										error={touched.amount && Boolean(errors.amount)}
										helperText={touched.amount && errors.amount}
									/>

									<FormControl fullWidth>
										<InputLabel id={'payment_type_label'} className={``}>
											Ödeme Tipi
										</InputLabel>
										<Select
											id='payment_type'
											name='payment_type'
											label='Ödeme Tipi'
											labelId='payment_type_label'
											fullWidth
											value={values.payment_type}
											onChange={handleChange}
											error={
												touched.payment_type && Boolean(errors.payment_type)
											}
										>
											{PAYMENT_TYPES.map((type, index) => (
												<MenuItem key={index} value={type}>
													{type}
												</MenuItem>
											))}
										</Select>
										<p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-400 rounded-b-lg'>
											{errors.payment_type &&
												touched.payment_type &&
												errors.payment_type}
										</p>
									</FormControl>

									<TextareaAutosize
										id='description'
										name='description'
										placeholder='Ödeme açıklaması giriniz...'
										maxLength={500}
										minRows={3}
										maxRows={5}
										className={`
                        p-2 
                        bg-transparent
                        rounded-md border-neutral-400 hover:border-neutral-500  
                        font-sans text-base
                        resize-y ${
													Boolean(errors.description)
														? 'border-rose-500 hover:border-rose-600'
														: ''
												} 
                      `}
										value={values.description}
										onChange={handleChange}
										error={touched.description && errors.description}
									/>

									<Button
										variant='contained'
										color='primary'
										size='large'
										type='submit'
										className={`bg-emerald-600 hover:bg-emerald-400 text-white font-medium text-lg tracking-wider normal-case`}
										disabled={isSubmitting}
									>
										<FiSend size={22} className='mr-2' /> Onayla
									</Button>
								</form>
							)}
						</Formik>
					</div>
				</section>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const backendURLDealer = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer-names`;

		const token = req.cookies.token;

		const formData = new FormData();

		const { data: dealersData } = await axios.get(backendURLDealer, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return {
			props: {
				dealers: dealersData.dealer_names,
			},
		};
	} catch (error) {
		console.log(error?.data);
		return {
			props: {
				error: 'An error occured.',
				dealers: [],
			},
		};
	}
}
