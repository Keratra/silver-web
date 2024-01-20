import { Fragment, useState } from 'react';
import { formatPrice } from 'lib';
import { Button, Card, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { AiOutlineBorder, AiFillCheckSquare } from 'react-icons/ai';
import { groupBy } from 'lodash';

function Row({
	row,
	handleOrderChoose,
	selectedOrders,
	doPaintGray,
	handleAccept,
	handleShip,
	handleDeliver,
	handleCancel,
	orderStatus,
	forDealers,
	totalPrice,
}) {
	const [open, setOpen] = useState(false);

	const paintGray = doPaintGray ? 'bg-slate-50' : '';


	const { order_id, orders } = row["0"];

	const { cargo_brand, cargo_id, created_at, dealer, dealer_id, description, order_status } = orders;

	const { address, city, country, email, name: cName, phone } = dealer;



	// const { name: pName, price } = products;
	// const localTotalPrice = price * quantity;

	return (
		<Fragment>
			<TableRow
				hover
				sx={{ '& > *': { borderBottom: 'unset' } }}
				className={paintGray}
			>
				{/* Seçme Sütunu */}

				{!!handleOrderChoose && (
					<TableCell>
						<span
							onClick={() => handleOrderChoose(order_id)}
							className='mb-1 py-0.5 cursor-pointer transition-colors'
						>
							<span className={``}>
								{selectedOrders?.find((elem) => elem === order_id) ? (
									<AiFillCheckSquare size={24} className='align-middle' />
								) : (
									<AiOutlineBorder size={24} className='align-middle' />
								)}
							</span>
						</span>
					</TableCell>
				)}

				{/* Detay Açma Sütunu */}
				{!forDealers && (
					<TableCell>
						<IconButton
							aria-label='expand row'
							size='small'
							onClick={() => setOpen(!open)}
						>
							{open ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
						</IconButton>
					</TableCell>
				)}

				<TableCell component='th' scope='row'>
					{order_id}
				</TableCell>

				{!forDealers && <TableCell>{email}</TableCell>}

				<TableCell align='right' className='tracking-wider'>
					{!!totalPrice && formatPrice(totalPrice)}
				</TableCell>

				{/* Aksiyon Buttonları */}
				{orderStatus === 'WAIT' && (
					<TableCell className='flex flex-wrap justify-evenly items-center gap-2'>
						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-rose-700 hover:bg-rose-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleCancel([order_id])}
						>
							Cancel
						</Button>

						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-emerald-700 hover:bg-emerald-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleAccept([order_id])}
						>
							Approve
						</Button>
					</TableCell>
				)}

				{orderStatus === 'PREP' && (
					<TableCell className='flex flex-wrap justify-evenly items-center gap-2'>
						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-rose-700 hover:bg-rose-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleCancel([order_id])}
						>
							Cancel
						</Button>

						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-emerald-700 hover:bg-emerald-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleShip([order_id])}
						>
							Ship
						</Button>

						<Button
							className={`
							py-2 pb-1 px-4 rounded-full
							bg-sky-700 hover:bg-sky-600
							normal-case text-white text-xs md:text-sm
							shadow-lg
							`}
							onClick={() => handleDeliver([order_id])}
						>
							Deliver
						</Button>
					</TableCell>
				)}

				{orderStatus === 'CARG' && (
					<TableCell className='flex flex-wrap justify-evenly items-center gap-2'>
						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-rose-700 hover:bg-rose-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleCancel([order_id])}
						>
							Cancel
						</Button>

						<Button
							className={`
								py-2 pb-1 px-4 rounded-full
								bg-emerald-700 hover:bg-emerald-600
								normal-case text-white text-xs md:text-sm
								shadow-lg
							`}
							onClick={() => handleDeliver([order_id])}
						>
							Deliver
						</Button>
					</TableCell>
				)}
			</TableRow>

			{/* Detaylar Kısmı */}
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={10}
					className=' bg-gradient-to-b from-slate-50 to-slate-100'
				>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 2 }}>
							<Table size='small' aria-label='details' className='shadow-md'>
								<TableHead className='bg-slate-200'>
									<TableRow>
										<TableCell align='center'>Product Name</TableCell>
										<TableCell align='center'>Quantity</TableCell>
										<TableCell align='center'>Unit Price</TableCell>
										<TableCell align='center'>Total</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{Object.values(row).slice(0, -1).map(({ products, quantity, totalPrice: localTotalPrice }, i) => (
										<TableRow key={i}>
											<TableCell align='center'>{products?.name}</TableCell>
											<TableCell align='center'>{quantity}</TableCell>
											<TableCell align='center'>{formatPrice(products?.price)}</TableCell>
											<TableCell align='center'>{formatPrice(localTotalPrice)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<div className='flex justify-around items-start gap-4'>
								<div className='my-4 flex flex-col justify-center items-center text-lg text-center gap-2'>
									<span className=' font-semibold px-1 uppercase border-solid border-0 border-b '>
										ORDER DESCRIPTION
									</span>{' '}
									{description}
								</div>
								<div className='my-4 flex flex-col justify-center items-center text-lg text-center gap-2'>
									<span className=' font-semibold px-1 uppercase border-solid border-0 border-b '>
										CUSTOMER DESCRIPTION
									</span>{' '}
									<span>
										{cName}{' '}
										<span className='ml-4 font-light'>
										{phone}
									</span>
									</span>
									
									<div className='font-light'>
										{address}, {city} / {country}
									</div>
									
								</div>
							</div>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</Fragment>
	);
}

export function OrderDisplayCard({
	orders,
	orderStatus,

	handleAccept,
	handleShip,
	handleDeliver,
	handleCancel,

	handleOrderChoose,
	handleChooseAll,
	selectedOrders,

	forDealers,
}) {
	if (orders.length === 0)
		return (
			<Card className='max-w-4xl mx-auto mb-6 p-2 bg-transparent shadow-none '>
				<div
					className={`mt-12 font-light text-center text-2xl text-rose-400 drop-shadow-md`}
				>
					No orders found.
				</div>
			</Card>
		);

	let groupedOrders = Object.entries(groupBy(orders, 'order_id')).map(([key, value]) => {
		return { ...value };
	});

	groupedOrders = groupedOrders.map(
		(orde) => Object.values(orde).map(
			(ord) => (
				{
					...ord,
					totalPrice: ord.products.price * ord.quantity
				}
			)
		)
	);

	const orderTotalPrice = groupedOrders.map((order) => {
		return order.reduce((acc, curr) => {
			return acc + curr.totalPrice;
		}
		, 0);
	});

	groupedOrders = groupedOrders.map((order, i) => {
		return {
			...order,
			totalPrice: orderTotalPrice[i]
		}
	});

	const order_ids = Object.entries(groupBy(orders, 'order_id')).map(([key, value]) => {
		return { ...value };
	}).map(
		(orde) => orde[0].order_id
	);

	return (
		<TableContainer component={Paper} className='mb-12'>
			<Table aria-label='collapsible table' className=' overflow-x-auto'>
				<TableHead>
					<TableRow>
						{!!handleChooseAll && (
							<TableCell>
								<span
									onClick={() =>
										handleChooseAll(order_ids)
									}
									className='mb-1 py-0.5 cursor-pointer transition-colors'
								>
									<span className={``}>
										{selectedOrders?.length === order_ids?.length ? (
											<AiFillCheckSquare size={24} className='align-middle' />
										) : (
											<AiOutlineBorder size={24} className='align-middle' />
										)}
									</span>
								</span>
							</TableCell>
						)}

						{!forDealers && <TableCell>Details</TableCell>}
						<TableCell>Order No</TableCell>
						{!forDealers && <TableCell>Customer</TableCell>}
						<TableCell align='right'>Order Total</TableCell>
						{['WAIT', 'PREP', 'CARG'].includes(orderStatus) && <TableCell />}
					</TableRow>
				</TableHead>

				<TableBody>
					{groupedOrders.map((ord, i) => (
						<Row
							key={i}
							row={ord}
							handleOrderChoose={handleOrderChoose}
							selectedOrders={selectedOrders}
							doPaintGray={i % 2 === 0 ? true : false}
							handleAccept={handleAccept}
							handleShip={handleShip}
							handleDeliver={handleDeliver}
							handleCancel={handleCancel}
							orderStatus={orderStatus}
							forDealers={!!forDealers}
							totalPrice={ord.totalPrice}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}