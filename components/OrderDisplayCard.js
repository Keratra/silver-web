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
}) {
	const [open, setOpen] = useState(false);

	const paintGray = doPaintGray ? 'bg-slate-50' : '';

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
							onClick={() => handleOrderChoose(row?.real_order_id)}
							className='mb-1 py-0.5 cursor-pointer transition-colors'
						>
							<span className={``}>
								{selectedOrders?.find((elem) => elem === row?.real_order_id) ? (
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
					{row?.order_id}
				</TableCell>

				{!forDealers && <TableCell>{row?.dealer_name}</TableCell>}

				<TableCell>{row?.product_name}</TableCell>
				<TableCell align='right'>{row?.quantity}</TableCell>
				<TableCell align='right' className='tracking-wider'>
					{formatPrice(row?.product_price)}
				</TableCell>
				<TableCell align='right' className='tracking-wider'>
					{formatPrice(row?.total_price)}
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
							onClick={() => handleCancel([row?.real_order_id])}
						>
							İptal Et
						</Button>

						<Button
							className={`
                    py-2 pb-1 px-4 rounded-full
                    bg-emerald-700 hover:bg-emerald-600
                    normal-case text-white text-xs md:text-sm
                    shadow-lg
                  `}
							onClick={() => handleAccept([row?.real_order_id])}
						>
							Onayla
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
							onClick={() => handleCancel([row?.real_order_id])}
						>
							İptal Et
						</Button>

						<Button
							className={`
                    py-2 pb-1 px-4 rounded-full
                    bg-emerald-700 hover:bg-emerald-600
                    normal-case text-white text-xs md:text-sm
                    shadow-lg
                  `}
							onClick={() => handleShip([row?.real_order_id])}
						>
							Kargola
						</Button>

						<Button
							className={`
                  py-2 pb-1 px-4 rounded-full
                  bg-sky-700 hover:bg-sky-600
                  normal-case text-white text-xs md:text-sm
                  shadow-lg
                `}
							onClick={() => handleDeliver([row?.real_order_id])}
						>
							Teslim Et
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
							onClick={() => handleCancel([row?.real_order_id])}
						>
							İptal Et
						</Button>

						<Button
							className={`
                    py-2 pb-1 px-4 rounded-full
                    bg-emerald-700 hover:bg-emerald-600
                    normal-case text-white text-xs md:text-sm
                    shadow-lg
                  `}
							onClick={() => handleDeliver([row?.real_order_id])}
						>
							Teslim Et
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
										<TableCell align='center'>Bayi</TableCell>
										<TableCell align='center'>Email</TableCell>
										<TableCell align='center'>Telefon</TableCell>
										<TableCell align='center'>Adres</TableCell>
										<TableCell align='center'>Şehir</TableCell>
										<TableCell align='center'>Ülke</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									<TableRow>
										<TableCell align='center'>{row?.dealer_name}</TableCell>
										<TableCell align='center'>{row?.dealer_email}</TableCell>
										<TableCell align='center'>{row?.dealer_phone}</TableCell>
										<TableCell align='center'>{row?.dealer_address}</TableCell>
										<TableCell align='center'>{row?.dealer_city}</TableCell>
										<TableCell align='center'>{row?.dealer_country}</TableCell>
									</TableRow>
								</TableBody>
							</Table>

							<div className='my-4 flex flex-col justify-center items-center text-lg text-center gap-2'>
								<span className=' font-semibold px-1 uppercase border-solid border-0 border-b '>
									Açıklama
								</span>{' '}
								{row?.description}
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
					Bu türden sipariş bulunamamaktadır.
				</div>
			</Card>
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
										handleChooseAll(orders.map((order) => order.real_order_id))
									}
									className='mb-1 py-0.5 cursor-pointer transition-colors'
								>
									<span className={``}>
										{selectedOrders?.length === orders?.length ? (
											<AiFillCheckSquare size={24} className='align-middle' />
										) : (
											<AiOutlineBorder size={24} className='align-middle' />
										)}
									</span>
								</span>
							</TableCell>
						)}

						{!forDealers && <TableCell>Detaylar</TableCell>}
						<TableCell>Sipariş No</TableCell>
						{!forDealers && <TableCell>Bayi</TableCell>}
						<TableCell>Ürün</TableCell>
						<TableCell align='right'>Adet</TableCell>
						<TableCell align='right'>Birim Fiyat</TableCell>
						<TableCell align='right'>Toplam Fiyat</TableCell>
						{['WAIT', 'PREP', 'CARG'].includes(orderStatus) && <TableCell />}
					</TableRow>
				</TableHead>

				<TableBody>
					{orders.map((ord, i) => (
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
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

// Row.propTypes = {
// 	row: PropTypes.shape({
// 		calories: PropTypes.number.isRequired,
// 		carbs: PropTypes.number.isRequired,
// 		fat: PropTypes.number.isRequired,
// 		history: PropTypes.arrayOf(
// 			PropTypes.shape({
// 				amount: PropTypes.number.isRequired,
// 				customerId: PropTypes.string.isRequired,
// 				date: PropTypes.string.isRequired,
// 			})
// 		).isRequired,
// 		name: PropTypes.string.isRequired,
// 		price: PropTypes.number.isRequired,
// 		protein: PropTypes.number.isRequired,
// 	}).isRequired,
// };
