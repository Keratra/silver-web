import { Card, Divider } from '@mui/material';
import { formatPrice } from 'lib';

export function PaymentDisplayCard({ title, payments, isNegative }) {
	if (payments.length === 0)
		return (
			<Card className='mb-6 p-2 bg-transparent text-black shadow-none  '>
				<h1
					className={`mb-2 mt-0 text-2xl ${
						isNegative ? 'text-rose-600' : 'text-emerald-600'
					}`}
				>
					{title}
				</h1>

				<div className={`mt-12 font-light text-center text-2xl text-rose-600`}>
					Bu türden ödeme bulunamamaktadır.
				</div>
			</Card>
		);

	return (
		<section className='mb-6 bg-transparent text-black transition-colors'>
			<h1
				className={`mb-2 mt-0 text-2xl ${
					isNegative ? 'text-rose-600' : 'text-emerald-600'
				}`}
			>
				{title}
			</h1>

			<Card className='mt-2 p-2 bg-white shadow-md text-black transition-colors'>
				<div className=''>
					{!!isNegative && (
						<div className='grid grid-cols-4 gap-x-4 py-1'>
							<span className='drop-shadow-md font-semibold'>Ödeme ID</span>
							<span className='drop-shadow-md font-semibold'>Ürün Çeşidi</span>
							<span className='drop-shadow-md font-semibold'>Ürün Sayısı</span>
							<span className='drop-shadow-md font-semibold'>Tutar</span>
							<Divider className='col-span-full -mx-2 my-2 bg-neutral-100' />
						</div>
					)}
					{!!isNegative &&
						payments.map(
							(
								{ order_id, total_product, total_quantity, total_price, date },
								index
							) => (
								<div
									key={order_id}
									className='m-2 mb-3 p-1 grid grid-cols-4 gap-4'
								>
									<span className=''>{order_id} </span>
									<span className=''>{total_product} ürün</span>
									<span className=''>{total_quantity} adet</span>
									<span className=''>{formatPrice(total_price)}</span>
									<section className='col-span-full grid grid-cols-1 gap-x-2 pt-1 text-2xl -mt-2'>
										<span className='place-self-end font-light text-base text-neutral-600 italic'>
											{new Date(date).toLocaleDateString('tr-TR', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												timeZone: 'UTC',
											})}{' '}
											{new Date(date).toLocaleTimeString('tr-TR', {
												timeZone: 'UTC',
											})}
										</span>
									</section>
									{index !== payments.length - 1 && (
										<Divider className='col-span-full -mx-5 bg-neutral-100' />
									)}
								</div>
							)
						)}

					{!isNegative && (
						<div className='grid grid-cols-3 gap-x-4 py-1'>
							<span className='drop-shadow-md font-semibold'>Ödeme ID</span>
							<span className='drop-shadow-md font-semibold'>Ödeme Tipi</span>
							<span className='drop-shadow-md font-semibold'>Tutar</span>
							<Divider className='col-span-full -mx-2 my-2 bg-neutral-100' />
						</div>
					)}
					{!isNegative &&
						payments.map(
							(
								{
									id,
									admin_id,
									dealer_id,
									amount: total_price,
									payment_type,
									description,
									created_on: date,
								},
								index
							) => (
								<div key={id} className='m-2 mb-3 p-1 grid grid-cols-3 gap-4'>
									<span className=''>{id} </span>
									<span className=''>{payment_type}</span>
									<span className=''>{formatPrice(total_price)}</span>

									<section className='col-span-full grid grid-cols-1 gap-x-2 pt-1 text-2xl -mt-2'>
										<span className='place-self-start m-0 text-sm text-slate-700'>
											{description}
										</span>
										<span className='place-self-end font-light text-base text-neutral-600 italic'>
											{new Date(date).toLocaleDateString('tr-TR', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												timeZone: 'UTC',
											})}{' '}
											{new Date(date).toLocaleTimeString('tr-TR', {
												timeZone: 'UTC',
											})}
										</span>
									</section>
									{index !== payments.length - 1 && (
										<Divider className='col-span-full -mx-5 bg-neutral-100' />
									)}
								</div>
							)
						)}
				</div>
			</Card>
		</section>
	);
}
