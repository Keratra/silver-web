import Layout from '@components/Layout';
import { Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FormData from 'form-data';
import { loadState, formatPrice } from 'lib';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import { PaymentDisplayCard } from '@components/PaymentDisplayCard';
import { HiSwitchHorizontal } from 'react-icons/hi';

function handleFilterChange({ Router, startDate, endDate }) {
	Router.push({
		pathname: '/dealer/payments',
		query: {
			startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
			endDate:
				endDate.toISOString().split('T')[0] ??
				new Date().toISOString().split('T')[0],
		},
	});
}

export default function DealerPaymentsPage({
	error,
	data,
	queryStartDate,
	queryEndDate,
}) {
	console.log(
		error?.response?.data?.message?.message ??
			error?.response?.data?.message ??
			error?.message
	);
	const Router = useRouter();

	const [showNegativePayments, setShowNegativePayments] = useState(true);

	const [startDate, setStartDate] = useState(new Date(queryStartDate));
	const [endDate, setEndDate] = useState(new Date(queryEndDate));

	useEffect(() => {
		handleFilterChange({
			Router,
			startDate,
			endDate,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startDate, endDate]);
	// don't add Router to the dependency array, it refreshes endlessly

	// if (error) {
	//   return (
	//     <Layout>
	//       <div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto'] text-center">
	//         {error}
	//       </div>
	//     </Layout>
	//   );
	// }

	const { balance, negative_balance, positive_balance } = data;

	const partialBalance =
		positive_balance
			.map(({ amount }) => amount)
			.reduce((partialSum, a) => partialSum + a, 0) -
		negative_balance
			.map(({ total_price }) => total_price)
			.reduce((partialSum, a) => partialSum + a, 0);

	return (
		<Layout>
			<div className={`max-w-4xl mx-auto px-2 `}>
				<section className={`mt-6 flex`}>
					<h1 className={`pl-4 xl:pl-0 flex-grow font-semibold text-3xl`}>
						Ödemeler
					</h1>
				</section>

				<section
					className='
					p-4
					bg-white shadow-md
					rounded-sm '
				>
					<div className='grid grid-cols-2 gap-4 '>
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
						</LocalizationProvider>
					</div>
				</section>

				{!error && (
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

				{!error && (
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
		const { startDate, endDate } = query;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/payment`;

		const token = req.cookies.token;

		const modifiedEndDate = !!endDate
			? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
					.toISOString()
					.split('T')[0]
			: null;

		const formData = new FormData();

		formData.append('start_date', startDate ?? '2022-01-01');
		formData.append(
			'end_date',
			modifiedEndDate ?? new Date().toISOString().split('T')[0]
		);

		const { data } = await axios.post(backendURL, formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		});

		return {
			props: {
				data,
				queryStartDate: startDate ?? '2022-01-01',
				queryEndDate: endDate ?? new Date().toISOString().split('T')[0],
			},
		};
	} catch (error) {
		console.log(error?.data);
		return {
			props: {
				error: 'An error occured.',
				data: { balance: 0, negative_balance: [], positive_balance: [] },
				queryStartDate: '2022-01-01',
				queryEndDate: new Date().toISOString().split('T')[0],
			},
		};
	}
}
