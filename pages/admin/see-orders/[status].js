import Layout from '@components/Layout';
import Searchy from '@components/Searchy';
import { Fab, Pagination, Stack, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState } from 'lib';
import { ORDER_CATEGORIES } from 'utils/constants';
import { OrderDisplayCard } from '@components/OrderDisplayCard';
import { OrderNavigation } from '@components/OrderNavigation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import DealerSelector from '@components/DealerSelector';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { notify } from 'utils/notify';

const ExcelJS = require('exceljs');
const JsBarcode = require('jsbarcode');
import { saveAs } from 'file-saver';

function handleFilterChange({ Router, startDate, endDate, selectedDealer }) {
	Router.push({
		pathname: '/admin/see-orders/' + Router.query.status,
		query: {
			page: 1,
			search: '',
			isNameSearch: true,
			selectedDealer: selectedDealer ?? null,
			startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
			endDate:
				endDate.toISOString().split('T')[0] ??
				new Date().toISOString().split('T')[0],
		},
	});
}

export default function AdminDealerOrdersPage({
	queryStatus,
	queryPage,
	querySearch,
	queryIsNameSearch,
	querySelectedDealer,
	queryStartDate,
	queryEndDate,
	dealers,
	orders,
	number_of_pages,
	error,
}) {
	const Router = useRouter();

	const [startDate, setStartDate] = useState(new Date(queryStartDate));
	const [endDate, setEndDate] = useState(new Date(queryEndDate));

	const [selectedDealer, setSelectedDealer] = useState(
		querySelectedDealer ?? ''
	);

	const [selectedOrders, setSelectedOrders] = useState([]);
	const [searchValue, setSearch] = useState(querySearch);
	const [page, setPage] = useState(queryPage);
	const [isNameSearch, setSearchType] = useState(queryIsNameSearch);

	const [barcode, setBarcode] = useState('');

	useEffect(() => {
		handleFilterChange({
			Router,
			startDate,
			endDate,
			selectedDealer,
		});
		setSelectedOrders([]);
		setSearch('');
		setPage(1);
		setSearchType(true);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryStatus, startDate, endDate, selectedDealer]);
	// don't add Router to the dependency array, it refreshes endlessly

	if (error) {
		return (
			<Layout>
				<div className="w-full h-[30vh] flex justify-center items-center text-red-400 text-2xl font-['Roboto']">
					Bir hata oluştu.
				</div>
			</Layout>
		);
	}

	const handleAcceptOrder = async (ids) => {
		if (confirm('Bu siparişi onaylamak istediğinizden emin misiniz?')) {
			try {
				if (ids?.length === 0) {
					console.log('Seçili sipariş bulunamadı.');
					return;
				}

				const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/accept-order`;

				const { token } = loadState('token');

				await axios.post(
					backendURL,
					{
						order_id: ids,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				// Router.reload();
			} catch (error) {
				notify('error', 'Sipariş onaylanamadı.');
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
			}
		}
	};

	const handleShipOrder = async (ids) => {
		if (confirm('Bu siparişi kargolamak istediğinizden emin misiniz?')) {
			try {
				if (ids?.length === 0) {
					console.log('Seçili sipariş bulunamadı.');
					return;
				}

				const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/ship-order`;

				const { token } = loadState('token');

				await axios.post(
					backendURL,
					{
						order_id: ids,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				Router.reload();
			} catch (error) {
				notify('error', 'Sipariş kargolanamadı.');
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
			}
		}
	};

	const handleDeliverOrder = async (ids) => {
		if (confirm('Bu siparişi teslim etmek istediğinizden emin misiniz?')) {
			try {
				if (ids?.length === 0) {
					console.log('Seçili sipariş bulunamadı.');
					return;
				}

				const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/deliver-order`;

				const { token } = loadState('token');

				await axios.post(
					backendURL,
					{
						order_id: ids,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				Router.reload();
			} catch (error) {
				notify('error', 'Sipariş teslim edilemedi.');
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
			}
		}
	};

	const handleCancelOrder = async (ids) => {
		if (confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
			try {
				if (ids?.length === 0) {
					notify('error', 'Seçili sipariş bulunamadı.');
					return;
				}

				const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/cancel-order`;

				const { token } = loadState('token');

				await axios.post(
					backendURL,
					{
						order_id: ids,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				Router.reload();
			} catch (error) {
				notify('error', 'Sipariş iptal edilemedi.');
				console.log(
					error?.response?.data?.message?.message ??
						error?.response?.data?.message ??
						error?.message
				);
			}
		}
	};

	const handleDealerChange = (e) => {
		setSelectedDealer(e.target.value);
	};

	const handleOrderChoose = (id) => {
		if (selectedOrders.includes(parseInt(id))) {
			setSelectedOrders(
				selectedOrders.filter((order) => parseInt(order) !== parseInt(id))
			);
		} else {
			setSelectedOrders([...new Set([...selectedOrders, parseInt(id)])]);
		}
	};

	const handleChooseAll = (ids) => {
		if (selectedOrders.length === ids.length) {
			setSelectedOrders([]);
		} else {
			setSelectedOrders(ids);
		}
	};

	const handleExcelDownload = async (ids) => {
		try {
			const excelOrders = orders
				?.filter(({ real_order_id }) => ids?.includes(real_order_id))
				?.map(({ real_order_id, description, product_name, quantity }) => {
					return {
						real_order_id,
						description,
						product_name,
						quantity,
					};
				});

			const workbook = new ExcelJS.Workbook();

			const worksheet = workbook.addWorksheet();

			worksheet.columns = [
				{
					header: 'SİPARİŞ NO',
					key: 'sno',
					width: 48,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'ÜRÜN',
					key: 'product',
					width: 40,
					style: {
						font: {
							size: 16,
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'ADET',
					key: 'amount',
					width: 10,
					style: {
						font: {
							size: 16,
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'AÇIKLAMA',
					key: 'desc',
					width: 40,
					style: {
						font: {
							size: 16,
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
			];

			var canvas = document.createElement('canvas');

			let imageRowStart = 1;

			excelOrders?.forEach(
				({ real_order_id, description, product_name, quantity }) => {
					JsBarcode(canvas, real_order_id, {
						format: 'CODE39',
						width: 356,
						height: 60,
						marginTop: 24,
					});
					const myBase64Image = canvas.toDataURL('image/png');

					const imageId = workbook.addImage({
						base64: myBase64Image,
						extension: 'png',
					});

					worksheet.addImage(imageId, {
						tl: { col: 0, row: imageRowStart + 0.1 },
						ext: { width: 320, height: 60 },
					});

					// worksheet.addImage(imageId, {
					// 	tl: { col: 0, row: imageRowStart },
					// 	br: { col: 1, row: imageRowStart + 1 },
					// 	editAs: 'oneCell',
					// });

					imageRowStart = imageRowStart + 1;

					const row = worksheet.addRow([
						real_order_id,
						product_name,
						quantity,
						description,
					]);
					row.height = 50;
					row.font = { bold: false };
					row.getCell(4).alignment = {
						vertical: 'middle',
						horizontal: 'left',
						wrapText: true,
					};
					row.getCell(1).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					row.getCell(2).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					row.getCell(3).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
					row.getCell(4).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				}
			);

			worksheet.getCell('A1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('B1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('C1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('D1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('A1').border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};

			worksheet.getCell('B1').border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};

			worksheet.getCell('C1').border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};

			worksheet.getCell('D1').border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};

			const buf = await workbook.xlsx.writeBuffer();
			const excelFilename =
				'SIPARIS_' +
				new Date().toLocaleDateString('tr-TR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}) +
				'-' +
				new Date().toLocaleTimeString('tr-TR', {}) +
				'.xlsx';
			saveAs(new Blob([buf]), excelFilename);
		} catch (error) {
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
			// console.log(
			// 	error?.response?.data?.message?.message ??
			// 		error?.response?.data?.message ??
			// 		error?.message
			// );
		}
	};

	const handleBarcode = async (id) => {
		try {
			const available = orders?.map(({ real_order_id }) => real_order_id);

			if (!available.includes(parseInt(id))) {
				throw Error('Geçersiz sipariş numarası okundu');
			}

			if (selectedOrders.includes(parseInt(id))) {
				return;
			} else {
				setSelectedOrders([...new Set([...selectedOrders, parseInt(id)])]);
			}
		} catch (error) {
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setBarcode('');
		}
	};

	const handleSearch = async () => {
		setSelectedOrders([]);
		Router.push({
			pathname: '/admin/see-orders/' + queryStatus,
			query: {
				page: 1,
				search: searchValue.toLowerCase() ?? '',
				isNameSearch: isNameSearch ?? true,
				selectedDealer: selectedDealer ?? null,
				startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
				endDate:
					endDate.toISOString().split('T')[0] ??
					new Date().toISOString().split('T')[0],
			},
		});
	};

	const handlePageChange = async (event, value) => {
		setPage(value);
		setSelectedOrders([]);
		Router.push({
			pathname: '/admin/see-orders/' + queryStatus,
			query: {
				page: value ?? 1,
				search: searchValue.toLowerCase() ?? '',
				isNameSearch: true,
				selectedDealer: selectedDealer ?? null,
				startDate: startDate.toISOString().split('T')[0] ?? '2022-01-01',
				endDate:
					endDate.toISOString().split('T')[0] ??
					new Date().toISOString().split('T')[0],
			},
		});
	};

	return (
		<Layout>
			<div className={``}>
				<OrderNavigation
					user='admin'
					highlight={queryStatus}
					classExtension='mx-2 my-1'
				/>

				<section className='grid grid-cols-1 lg:grid-cols-2 gap-1 mx-2 my-1 '>
					<div
						className='
            grid grid-cols-1 md:grid-cols-3 gap-1 gap-y-4
						p-3.5
            bg-white border-neutral-200
            rounded-sm  shadow-md '
					>
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
								dealers={dealers}
								selectedDealer={selectedDealer}
								handleDealerChange={handleDealerChange}
							/>
						</LocalizationProvider>
					</div>

					{['PREP'].includes(queryStatus) && (
						<div
							className='
								p-3.5
								bg-white border-neutral-200
								rounded-sm  shadow-md '
						>
							<TextField
								id='barcode'
								name='barcode'
								label='Barkod Okuma Yeri'
								type='number'
								placeholder='Barkod okutunuz...'
								fullWidth
								value={barcode}
								onChange={(e) => setBarcode(e.target.value)}
								onSubmit={handleBarcode}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleBarcode(e.target.value);
									}
								}}
							/>
						</div>
					)}

					{['WAIT', 'PREP', 'CARG'].includes(queryStatus) && (
						<div
							className={`
								grid grid-cols-${queryStatus === 'PREP' ? '4' : '3'} 
								gap-1 gap-y-4 ${queryStatus === 'PREP' ? 'col-span-1 lg:col-span-2' : ''}
								p-3.5
								bg-white border-neutral-200
								rounded-sm  shadow-md 
							`}
						>
							<div className='flex justify-center items-center gap-4 text-sm md:text-base '>
								{/* Print to Excel */}
								{queryStatus === 'PREP' && (
									<div className='flex justify-center items-center'>
										<Fab
											variant=''
											className='bg-transparent hover:bg-transparent shadow-none hover:shadow-none'
											onClick={() => handleExcelDownload(selectedOrders)}
										>
											<RiFileExcel2Fill
												className='text-green-600 hover:text-green-400 text-lg transition-colors'
												size={28}
											/>
										</Fab>
									</div>
								)}

								{selectedOrders?.length !== 0
									? `${selectedOrders?.length} sipariş seçildi`
									: 'Sipariş seçiniz...'}
							</div>

							<div className='flex justify-center items-center'>
								<Fab
									variant='extended'
									className='
									shadow-md normal-case 
									bg-rose-700 hover:bg-rose-500 
									text-lg text-white transition-colors group
								'
									onClick={() => handleCancelOrder(selectedOrders)}
								>
									<FiXCircle
										className='align-middle group-hover:animate-wiggle'
										size={28}
									/>{' '}
									<span className='ml-2 mr-1 text-sm md:text-lg'>İptal</span>
								</Fab>
							</div>

							<div className='flex justify-center items-center'>
								<Fab
									variant='extended'
									className='
									shadow-md normal-case 
									bg-emerald-800 hover:bg-emerald-600 
									text-lg text-white transition-colors group
								'
									onClick={() => {
										if (queryStatus === 'WAIT') {
											handleAcceptOrder(selectedOrders);
										} else if (queryStatus === 'PREP') {
											handleShipOrder(selectedOrders);
										} else if (queryStatus === 'CARG') {
											handleDeliverOrder(selectedOrders);
										}
									}}
								>
									<FiCheckCircle
										className='align-middle group-hover:animate-wiggle'
										size={28}
									/>{' '}
									<span className='ml-2 mr-1 text-sm md:text-lg'>
										{queryStatus === 'WAIT'
											? 'Onayla'
											: queryStatus === 'PREP'
											? 'Kargola'
											: queryStatus === 'CARG'
											? 'Teslim Et'
											: ''}
									</span>
								</Fab>
							</div>

							{queryStatus === 'PREP' && (
								<div className='flex justify-center items-center'>
									<Fab
										variant='extended'
										className='normal-case bg-sky-800 hover:bg-sky-600 text-lg text-white transition-colors'
										onClick={() => handleDeliverOrder(selectedOrders)}
									>
										<span className='ml-2 mr-1 text-sm md:text-lg'>Teslim</span>
									</Fab>
								</div>
							)}
						</div>
					)}
					{!['WAIT', 'PREP', 'CARG'].includes(queryStatus) && (
						<div
							className={`
								grid grid-cols-${queryStatus === 'PREP' ? '4' : '3'} gap-1 gap-y-4
								p-3.5
								bg-white border-neutral-200
								rounded-sm  shadow-md 
							`}
						/>
					)}
				</section>

				<section className='my-4 mx-2'>
					<Searchy
						forOrders
						value={searchValue}
						handleSearchChange={(e) => setSearch(() => e.target.value)}
						searchType={isNameSearch}
						handleSearchTypeChange={(e) => setSearchType(() => e.target.value)}
						onSearchSubmit={handleSearch}
					/>
				</section>

				<section className='mx-2'>
					<OrderDisplayCard
						orders={orders}
						orderStatus={queryStatus}
						positiveActionFunction={handleAcceptOrder}
						positiveActionText={'Onayla'}
						cancelFunction={handleCancelOrder}
						handleAccept={handleAcceptOrder}
						handleShip={handleShipOrder}
						handleDeliver={handleDeliverOrder}
						handleCancel={handleCancelOrder}
						handleOrderChoose={handleOrderChoose}
						handleChooseAll={handleChooseAll}
						selectedOrders={selectedOrders}
					/>
				</section>

				<Stack spacing={2} className='flex justify-center items-center my-6'>
					<Pagination
						count={number_of_pages}
						page={parseInt(page)}
						onChange={handlePageChange}
						variant='outlined'
						shape='rounded'
						size='large'
						showFirstButton
						showLastButton
					/>
				</Stack>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const status = query?.status ?? 'WAIT';
		const page = parseInt(query?.page) ?? 1;
		const search = query?.search ?? '';
		const isNameSearch = query?.isNameSearch ?? true;
		const selectedDealer = query?.selectedDealer ?? '';
		const startDate = query?.startDate ?? null;
		const endDate = query?.endDate ?? null;

		const token = req.cookies.token;

		// console.table({
		// 	status,
		// 	page,
		// 	search,
		// 	isNameSearch,
		// 	selectedDealer,
		// 	startDate,
		// 	endDate,
		// });

		const modifiedEndDate = !!endDate
			? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
					.toISOString()
					.split('T')[0]
			: null;

		const searchName =
			isNameSearch === 'true' || isNameSearch === true ? true : false;

		const order_status = ORDER_CATEGORIES[status];

		const backendURLDealer = `${process.env.NEXT_PUBLIC_API_URL}/admin/dealer-names`;
		const { data: dealersData } = await axios.get(backendURLDealer, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const dealers = dealersData.dealer_names;

		const backendURLmaxPage = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders-max-page`;
		const { data: dataMaxPage } = await axios.post(
			backendURLmaxPage,
			{
				id_search: !searchName ? search : '',
				product_search: !!searchName ? search : '',
				order_status,
				start_date: startDate ?? '2022-01-01',
				end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
				dealer_id: selectedDealer ?? '',
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const { number_of_pages } = dataMaxPage;

		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${page}`;
		const { data: dataOrders } = await axios.post(
			backendURL,
			{
				id_search: !searchName ? search : '',
				product_search: !!searchName ? search : '',
				order_status,
				start_date: startDate ?? '2022-01-01',
				end_date: modifiedEndDate ?? new Date().toISOString().split('T')[0],
				dealer_id: selectedDealer ?? '',
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const { orders } = dataOrders;

		return {
			props: {
				queryStatus: status,
				queryPage: page ?? 1,
				querySearch: search ?? '',
				queryIsNameSearch: isNameSearch ?? true,
				querySelectedDealer: selectedDealer ?? null,
				queryStartDate: startDate ?? '2022-01-01',
				queryEndDate: endDate ?? new Date().toISOString().split('T')[0],
				dealers,
				orders,
				number_of_pages,
			},
		};
	} catch (error) {
		console.log(
			error?.response?.data?.message?.message ??
				error?.response?.data?.message ??
				error?.message
		);
		return {
			props: {
				queryStatus: 'WAIT',
				queryPage: 1,
				querySearch: '',
				queryIsNameSearch: true,
				querySelectedDealer: null,
				queryStartDate: '2022-01-01',
				queryEndDate: new Date().toISOString().split('T')[0],
				dealers: [],
				orders: [],
				number_of_pages: 0,
				error: true,
			},
		};
	}
}

// const api = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_API_URL,
// 	headers: {
// 		'Content-Type': 'multipart/form-data',
// 	},
// });

// // usage
// const backendURL = `/admin/orders/${page}`;
// const { data } = await api.post(backendURL, formData, {
// 	headers: {
// 		Authorization: `Bearer ${token}`,
// 	},
// });
