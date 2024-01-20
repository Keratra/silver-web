import Layout from '@components/Layout';
import {
	Button,
	Card,
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
	TextField,
} from '@mui/material';
import { VscSettings } from 'react-icons/vsc';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState, formatPrice } from 'lib';
import { ORDER_CATEGORIES } from 'utils/constants';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import DealerSelector from '@components/DealerSelector';
import { PaymentDisplayCard } from '@components/PaymentDisplayCard';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Formik } from 'formik';
import { paymentVerifyModel } from 'lib/yupmodels';
import { notify } from 'utils/notify';

function handleFilterChange({ Router, startDate, endDate, selectedDealer }) {
	Router.push({
		pathname: '/admin/payments',
		query: {
			startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
			endDate:
				endDate.toISOString().split('T')[0] ??
				new Date().toISOString().split('T')[0],
			selectedDealer: selectedDealer ?? null,
		},
	});
}

export default function DealerPaymentsPage({
	error,
	data,
	dealers,
	queryStartDate,
	queryEndDate,
	querySelectedDealer,
}) {
	const Router = useRouter();

	const [showNegativePayments, setShowNegativePayments] = useState(true);

	const [startDate, setStartDate] = useState(new Date(queryStartDate));
	const [endDate, setEndDate] = useState(new Date(queryEndDate));

	const [selectedDealer, setSelectedDealer] = useState(
		querySelectedDealer ?? ''
	);
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		handleFilterChange({
			Router,
			startDate,
			endDate,
			selectedDealer,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startDate, endDate, selectedDealer]);
	// don't add Router to the dependency array, it refreshes endlessly

	const { balance, negative_balance, positive_balance } = data;

	const partialBalance =
		positive_balance
			.map(({ amount }) => amount)
			.reduce((partialSum, a) => partialSum + a, 0) -
		negative_balance
			.map(({ total_price }) => total_price)
			.reduce((partialSum, a) => partialSum + a, 0);

	const handleDealerChange = (e) => {
		setSelectedDealer(e.target.value);
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
			<div className={`px-4 lg:px-12`}>
				<section className={`flex`}>
					<h1 className={`pl-4 xl:pl-0 flex-grow font-semibold text-3xl`}>
						Ödemeler
					</h1>
					<div className='my-auto'>
						<NextLink href='/admin/payment-operation'>
							<Fab
								color='primary'
								className='mr-2 bg-gradient-to-tr from-emerald-600 to-emerald-400  text-center text-white'
							>
								<BsCurrencyDollar size={32} className='drop-shadow-md' />
							</Fab>
						</NextLink>
					</div>
				</section>

				<section
					className='
            p-4
            bg-white shadow-md
            rounded-sm '
				>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DatePicker
								label='Başlangıç Tarihi'
								value={new Date(startDate)}
								onChange={(newValue) => {
									setStartDate(newValue.toDate());
								}}
								renderInput={(params) => <TextField {...params} />}
							/>

							<DatePicker
								label='Bitiş Tarihi'
								value={new Date(endDate)}
								onChange={(newValue) => {
									setEndDate(newValue.toDate());
								}}
								renderInput={(params) => <TextField {...params} />}
							/>

							<DealerSelector
								title='Bayiler'
								emptyOptionTitle='Bir bayi seçiniz...'
								dealers={dealers}
								selectedDealer={selectedDealer}
								handleDealerChange={handleDealerChange}
							/>
						</LocalizationProvider>
					</div>
				</section>

				{!selectedDealer && (
					<Card className='max-w-4xl mx-auto mb-6 p-2 bg-transparent shadow-none text-black '>
						<div
							className={`mt-12 font-light text-center text-2xl text-amber-800`}
						>
							Please select a customer.
						</div>
					</Card>
				)}

				{!error && !!selectedDealer && (
					<section
						className='
            p-4 mb-4 -mt-2
            bg-white shadow-md
            rounded-sm '
					>
						<div className='grid grid-cols-4 gap-4 '>
							<span className='place-self-end text-neutral-600'>
								Bu aralıkta:
							</span>
							<div
								className={` ${
									partialBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
								} `}
							>
								{formatPrice(partialBalance)}
							</div>

							<span className='place-self-end text-neutral-600'>Toplam:</span>
							<div
								className={` ${
									balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
								} `}
							>
								{formatPrice(balance)}
							</div>
						</div>
					</section>
				)}

				{!error && !!selectedDealer && (
					<section className=''>
						<Button
							className='w-full mb-4 text-center text-orange-500 drop-shadow-md'
							onClick={() =>
								setShowNegativePayments(
									(showNegativePayments) => !showNegativePayments
								)
							}
						>
							<HiSwitchHorizontal size={36} />
						</Button>

						{showNegativePayments ? (
							<PaymentDisplayCard
								title='Alınanlar'
								payments={negative_balance}
								isNegative
							/>
						) : (
							<PaymentDisplayCard
								title='Ödenenler'
								payments={positive_balance}
							/>
						)}
					</section>
				)}
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const { page, startDate, endDate, selectedDealer } = query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/payment/${
			selectedDealer === '' ? 1 : selectedDealer ?? 1
		}`;

		const backendURLDealer = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer-names`;

		const token = req.cookies.token;

		const modifiedEndDate = !!endDate
			? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
					.toISOString()
					.split('T')[0]
			: null;

		const { data } = await axios.post(
			backendURL,
			{
				start_date: startDate ?? '2022-01-01',
				end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const { data: dealersData } = await axios.get(backendURLDealer, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return {
			props: {
				data,
				dealers: dealersData.dealer_names,
				queryPage: page ?? 1,
				queryStartDate: startDate ?? '2022-01-01',
				queryEndDate: endDate ?? new Date().toISOString().split('T')[0],
				querySelectedDealer: selectedDealer ?? null,
			},
		};
	} catch (error) {
		console.log(error?.data);
		return {
			props: {
				error: 'An error occured.',
				data: { balance: 0, negative_balance: [], positive_balance: [] },
				dealers: [],
				queryPage: 1,
				queryStartDate: '2022-01-01',
				queryEndDate: new Date().toISOString().split('T')[0],
				querySelectedDealer: null,
			},
		};
	}
}
