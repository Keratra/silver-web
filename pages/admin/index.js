import Layout from '@components/Layout';
import Product from '@components/Product';
import { useState } from 'react';
import {
	Box,
	Card,
	CssBaseline,
	Divider,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { formatPrice } from 'lib';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

ChartJS.defaults.backgroundColor = '#fff';
ChartJS.defaults.borderColor = '#e2e2e2';
ChartJS.defaults.color = '#212021';

// const options = {
// 	responsive: true,
// 	plugins: {
// 		legend: {
// 			position: 'top',
// 		},
// 	},
// };

export const options = {
	responsive: true,
	interaction: {
		mode: 'index',
		intersect: false,
	},
	stacked: false,
	plugins: {
		title: {
			display: false,
			text: '',
		},
	},
	scales: {
		y: {
			type: 'linear',
			display: true,
			position: 'left',
		},
		y1: {
			type: 'linear',
			display: true,
			position: 'right',
			grid: {
				drawOnChartArea: false,
			},
		},
	},
};

const tableHeadClasses = `
  font-semibold text-base md:text-lg bg-slate-100
`;

const tableBodyClasses = `
  text-base md:text-lg
`;

export default function DashboardPage({
	error,
	data_graph_order,
	data_graph_product,
	data_graph_price,
	most_sold_products,
	top_sellers,
	categoryLabels,
	data_graph_order_and_product,
}) {
	const Router = useRouter();

	if (!!error)
		return (
			<Layout>
				<div className='mx-4 mt-16 text-center text-red-700 text-xl'>
					Bir hata oluştu.
				</div>
			</Layout>
		);

	return (
		<Layout>
			<div className={`m-1 md:m-2 grid grid-cols-1 lg:grid-cols-6 gap-4`}>asd
				{/* <section
					className='
							col-span-1 lg:col-span-3
              p-1 md:p-4 bg-white
              rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						Günlük Satış Grafiği
					</h2>
					<div className=''>
						<div>
							<Line options={options} data={data_graph_price} />
						</div>
					</div>
				</section>

				<section
					className='
							col-span-1 lg:col-span-3
              p-1 md:p-4 bg-white
              rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						Günlük Sipariş ve Ürün Grafiği
					</h2>
					<div className=''>
						<div>
							<Line options={options} data={data_graph_order_and_product} />
						</div>
					</div>
				</section> */}

				{/* önceden commentliydi bu alttaki */}
				{/* <section
					className='
							col-span-1 lg:col-span-2
              p-1 md:p-4 bg-white
              rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						Günlük Sipariş Grafiği
					</h2>
					<div className=''>
						<div>
							<Line options={options} data={data_graph_order} />
						</div>
					</div>
				</section>

				<section
					className='
							col-span-1 lg:col-span-2
              p-1 md:p-4 bg-white
              rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						Günlük Ürün Grafiği
					</h2>
					<div className=''>
						<div>
							<Line options={options} data={data_graph_product} />
						</div>
					</div>
				</section> */}

				{/* <section
					className='
						col-span-1 lg:col-span-3
            p-4 bg-white flex flex-col justify-center
            rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						En Çok Satılan Ürünler
					</h2>
					<div className=''>
						<section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							{most_sold_products.map(
								(
									{
										product_id,
										name,
										category_id,
										description,
										total_quantity,
									},
									index
								) => (
									<div key={index} className=''>
										<Product
											product={{
												product_id,
												name,
												category_id,
												description,
											}}
											size={4}
											categories={categoryLabels}
											dashboardTitle={
												<span className='font-light text-xl text-center text-black'>
													<span className='text-fuchsia-600'>
														{total_quantity}
													</span>{' '}
													adet satıldı.
												</span>
											}
										/>
									</div>
								)
							)}
							{most_sold_products?.length === 0 && (
								<div className='col-span-full text-center text-xl text-gray-500'>
									Ürün bulunamadı.
								</div>
							)}
						</section>
					</div>
				</section>

				<section
					className='
						col-span-1 lg:col-span-3
            p-4 bg-white flex flex-col justify-center
            rounded-sm shadow-md '
				>
					<h2 className='m-0 mb-4 text-center text-xl lg:text-3xl'>
						En Çok Satış Yapan Bayiler
					</h2>
					<div className=''>
						{top_sellers?.length === 0 ? (
							<div className='col-span-full text-center text-xl text-gray-500'>
								Bayi bulunamadı.
							</div>
						) : (
							<section
								className='
                    max-w-3xl mx-auto
                    bg-white border-neutral-200
                    rounded-sm border-solid border '
							>
								<Paper elevation={4} className=''>
									<TableContainer>
										<Table stickyHeader>
											<TableHead>
												<TableRow style={{ backgroundColor: '#212021' }}>
													<TableCell
														align='left'
														style={{ minWidth: 170 }}
														className={tableHeadClasses}
													>
														Bayi
													</TableCell>
													<TableCell
														align='center'
														style={{ minWidth: 170 }}
														className={tableHeadClasses}
													>
														Toplam Sipariş
													</TableCell>
													<TableCell
														align='center'
														style={{ minWidth: 170 }}
														className={tableHeadClasses}
													>
														Toplam Ürün
													</TableCell>
													<TableCell
														align='right'
														style={{ minWidth: 170 }}
														className={tableHeadClasses}
													>
														Toplam Tutar
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{!!top_sellers &&
													top_sellers
														.filter((elem) => elem !== undefined)
														.map(
															(
																{
																	dealer_id,
																	name,
																	num_of_orders,
																	total,
																	total_quantity,
																},
																index
															) => (
																<TableRow
																	hover
																	role='checkbox'
																	tabIndex={-1}
																	key={index}
																	className={
																		index % 2 === 1 ? 'bg-neutral-50' : ''
																	}
																>
																	<TableCell
																		align='left'
																		className={tableBodyClasses}
																	>
																		{name}
																	</TableCell>

																	<TableCell
																		align='center'
																		className={tableBodyClasses}
																	>
																		{num_of_orders}
																	</TableCell>

																	<TableCell
																		align='center'
																		className={tableBodyClasses}
																	>
																		{total_quantity}
																	</TableCell>

																	<TableCell
																		align='right'
																		className={tableBodyClasses}
																	>
																		{formatPrice(total)}
																	</TableCell>
																</TableRow>
															)
														)}
											</TableBody>
										</Table>

										{!top_sellers && (
											<div className='my-1 font-medium text-xl text-rose-600 text-center'>
												Bir hata oluştu.
											</div>
										)}
									</TableContainer>
								</Paper>
							</section>
						)}
					</div>
				</section> */}
			</div>
		</Layout>
	);
}

// export async function getServerSideProps({ req, query }) {
// 	try {
// 		const backendURL_GRAPH = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/graph-data`;
// 		const backendURL_PRODUCTS = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/most-sold-products`;
// 		const backendURL_SELLERS = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/top-sellers`;
// 		const backendURLCategories = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;

// 		const token = req.cookies.token;

// 		const { data: dataGraphRaw } = await axios.get(backendURL_GRAPH, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});

// 		const { data: most_sold_products } = await axios.get(backendURL_PRODUCTS, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});

// 		const { data: top_sellers } = await axios.get(backendURL_SELLERS, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});

// 		const { data: dataCategories } = await axios.get(backendURLCategories, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});

// 		const categoryLabels = dataCategories?.categories.map(
// 			({ id, name }) => name
// 		);

// 		const { data: graphData } = dataGraphRaw;

// 		const dates = graphData.map(
// 			({ order_date }) => new Date(order_date).toISOString().split('T')[0]
// 		);

// 		// const latestDate = dates[dates.length - 1];

// 		const newGraphData = [];

// 		for (let i = 0; i < 30; i++) {
// 			// const date = new Date(latestDate);
// 			const date = new Date();
// 			date.setDate(date.getDate() - i);
// 			const formattedDate = date.toISOString().split('T')[0];

// 			newGraphData.push({
// 				order_date: formattedDate,
// 				num_of_orders: dates.includes(formattedDate)
// 					? graphData.filter(
// 							({ order_date }) =>
// 								new Date(order_date).toISOString().split('T')[0] ===
// 								formattedDate
// 					  )[0].num_of_orders
// 					: 0,

// 				num_of_products: dates.includes(formattedDate)
// 					? graphData.filter(
// 							({ order_date }) =>
// 								new Date(order_date).toISOString().split('T')[0] ===
// 								formattedDate
// 					  )[0].num_of_products
// 					: 0,

// 				total_price: dates.includes(formattedDate)
// 					? graphData.filter(
// 							({ order_date }) =>
// 								new Date(order_date).toISOString().split('T')[0] ===
// 								formattedDate
// 					  )[0].total_price
// 					: 0,
// 			});
// 		}

// 		newGraphData.reverse();

// 		const labels = newGraphData.map(({ order_date }) =>
// 			new Date(order_date).toLocaleDateString('tr-TR', {
// 				year: '2-digit',
// 				month: 'short',
// 				day: 'numeric',
// 				timeZone: 'UTC',
// 			})
// 		);

// 		const data_graph_order = {
// 			labels,
// 			datasets: [
// 				{
// 					label: 'Sipariş',
// 					data: labels.map((_, i) => newGraphData[i].num_of_orders),
// 					borderColor: 'rgb(255, 99, 132)',
// 					backgroundColor: 'rgba(255, 99, 132, 0.5)',
// 				},
// 			],
// 		};

// 		const data_graph_product = {
// 			labels,
// 			datasets: [
// 				{
// 					label: 'Ürün',
// 					data: labels.map((_, i) => newGraphData[i].num_of_products),
// 					borderColor: 'rgb(53, 162, 235)',
// 					backgroundColor: 'rgba(53, 162, 235, 0.5)',
// 				},
// 			],
// 		};

// 		const data_graph_price = {
// 			labels,
// 			datasets: [
// 				{
// 					label: 'Kazanç',
// 					data: labels.map((_, i) => Math.round(newGraphData[i].total_price)),
// 					borderColor: 'rgb(153, 162, 235)',
// 					backgroundColor: 'rgba(153, 162, 235, 0.5)',
// 				},
// 			],
// 		};

// 		const data_graph_order_and_product = {
// 			labels,
// 			datasets: [
// 				{
// 					label: 'Sipariş',
// 					data: labels.map((_, i) => newGraphData[i].num_of_orders),
// 					borderColor: 'rgb(255, 99, 132)',
// 					backgroundColor: 'rgba(255, 99, 132, 0.5)',
// 					yAxisID: 'y',
// 				},
// 				{
// 					label: 'Ürün',
// 					data: labels.map((_, i) => newGraphData[i].num_of_products),
// 					borderColor: 'rgb(53, 162, 235)',
// 					backgroundColor: 'rgba(53, 162, 235, 0.5)',
// 					yAxisID: 'y1',
// 				},
// 			],
// 		};

// 		return {
// 			props: {
// 				data_graph_order,
// 				data_graph_product,
// 				data_graph_price,
// 				most_sold_products: most_sold_products?.data,
// 				top_sellers: top_sellers?.data,
// 				categoryLabels,
// 				data_graph_order_and_product,
// 			},
// 		};
// 	} catch (error) {
// 		console.log(
// 			error?.response?.data?.message?.message ??
// 				error?.response?.data?.message ??
// 				error?.message
// 		);
// 		return {
// 			props: {
// 				error: 'Bir hata oluştu.',
// 				data_graph_order: [],
// 				data_graph_product: [],
// 				data_graph_price: [],
// 				most_sold_products: [],
// 				top_sellers: [],
// 				categoryLabels: [],
// 				data_graph_order_and_product: [],
// 			},
// 		};
// 	}
// }
