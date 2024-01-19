import Layout from '@components/Layout';
import Product from '@components/Product';
import {
	Button,
	Card,
	Fab,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextareaAutosize,
} from '@mui/material';
import {
	FiTrash,
	FiPlus,
	FiMinus,
	FiShoppingCart,
	FiSend,
	FiArrowLeft,
} from 'react-icons/fi';
import { useState, useReducer } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState, saveState, formatPrice } from 'lib';
import { CART, CART_ACTIONS } from 'utils/constants';
import { reducer } from './index.js';
import { MdPayment } from 'react-icons/md';
import { Formik } from 'formik';
import { orderModel } from 'lib/yupmodels';
import { notify } from 'utils/notify.js';

const tableHeadClasses = `
  font-serif font-semibold text-lg md:text-xl
`;

const tableBodyClasses = `
text-md md:text-lg
`;

export default function DealerOrderConfirmPage() {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});

	const Router = useRouter();

	const cart = loadState(CART)?.cart;

	const handleOrderSubmit = async ({ description }, { setSubmitting }) => {
		try {
			const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/create-order`;

			const { token } = loadState('token');

			if (products?.length === 0) {
				notify('warning', 'Sepette ürün bulunamadı.');
				return;
			}

			const products = Object.values(cart)?.map(([product, amount]) => ({
				product_id: product.product_id,
				quantity: amount,
				order_description: product.order_description,
			}));

			const orders = products.map(
				({ product_id, quantity, order_description }) => ({
					product: { product_id, quantity },
					description: order_description,
				})
			);

			console.log(orders);

			await axios.post(backendURL, orders, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			dispatch({ type: CART_ACTIONS.EMPTY });

			Router.push('/dealer/see-orders/WAIT?page=1&search=&isNameSearch=true');
		} catch (error) {
			console.log(
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
			<div className={`px-2 md:px-12`}>
				<section className={`flex`}>
					<h1 className={`flex-grow font-semibold text-xl md:text-3xl`}>
						Siparişiniz
					</h1>
				</section>

				<Paper className='w-full shadow-md'>
					<TableContainer>
						<Table stickyHeader>
							<TableHead>
								<TableRow style={{ backgroundColor: '#212021' }}>
									<TableCell
										align='left'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Ürün
									</TableCell>
									<TableCell
										align='left'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Açıklama
									</TableCell>
									<TableCell
										align='center'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Adet
									</TableCell>
									<TableCell
										align='right'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Fiyat
									</TableCell>
									<TableCell
										align='right'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Tutar
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{!!cart &&
									Object.values(cart).map(
										([
											{
												product_id,
												name,
												category_id,
												price,
												description,
												order_description,
											},
											amount,
										]) => (
											<TableRow
												hover
												role='checkbox'
												tabIndex={-1}
												key={product_id}
											>
												<TableCell align='left' className={tableBodyClasses}>
													{name}
												</TableCell>
												<TableCell
													align='left'
													style={{ maxWidth: 320 }}
													className={' text-sm break-words'}
												>
													{order_description}
												</TableCell>
												<TableCell align='center' className={tableBodyClasses}>
													{amount}
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(price)}
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(price * amount)}
												</TableCell>
											</TableRow>
										)
									)}
								{!!cart && (
									<TableRow hover role='checkbox' tabIndex={-1}>
										<TableCell
											align='left'
											className={tableBodyClasses + ' font-semibold'}
										></TableCell>
										<TableCell
											align='left'
											className={tableBodyClasses + ' font-semibold'}
										></TableCell>
										<TableCell
											align='center'
											className={tableBodyClasses + ' font-semibold'}
										>
											Toplam{' '}
											<span className='font-normal'>
												{Object.values(cart)
													.map(([_, amount]) => amount)
													.reduce((partialSum, a) => partialSum + a, 0)}{' '}
												ürün
											</span>
										</TableCell>
										<TableCell
											align='right'
											className={tableBodyClasses + ' font-semibold'}
										></TableCell>
										<TableCell
											align='right'
											className={tableBodyClasses + ' font-semibold'}
										>
											Toplam{' '}
											<span className='font-normal'>
												{formatPrice(
													Object.values(cart)
														.map(([product, amount]) => product.price * amount)
														.reduce((partialSum, a) => partialSum + a, 0)
												)}
											</span>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{!cart && (
							<div className='my-1 font-medium text-xl text-rose-600 text-center'>
								Sepetinizde ürün bulunmamaktadır.
							</div>
						)}
					</TableContainer>
				</Paper>

				<section className='mx-auto '>
					<Formik
						initialValues={orderModel.initials}
						validationSchema={orderModel.schema}
						onSubmit={handleOrderSubmit}
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
								className={`grid grid-cols-1 content-center place-content-center p-4`}
							>
								{/* <TextareaAutosize
									id='description'
									name='description'
									placeholder='Sipariş açıklaması giriniz...'
									maxLength={2000}
									minRows={3}
									maxRows={5}
									className={`p-2 bg-slate-100 border-neutral-400 hover:border-black rounded-md font-sans text-base resize-y ${
										touched.description && Boolean(errors.description)
											? 'border-rose-500 hover:border-rose-600'
											: ''
									} `}
									value={values.description}
									onChange={handleChange}
									error={touched.description && errors.description}
								/>
								<p className='ml-3 text-sm col-span-2 text-rose-600'>
									{errors.description &&
										touched.description &&
										errors.description}
								</p> */}
								<Fab
									type='submit'
									variant='extended'
									className={`
                      max-w-fit mx-auto mt-1
                      bg-emerald-500  hover:bg-emerald-400 
                      text-white text-xl tracking-wider normal-case
                    `}
									disabled={isSubmitting}
								>
									<MdPayment size={22} className='mr-2' /> Onayla
								</Fab>
							</form>
						)}
					</Formik>
				</section>

				{/* <div className='grid grid-cols-3 place-items-center gap-3 my-12'>
          <NextLink href='/dealer/cart' passHref>
            <Link className={`no-underline transition-colors`}>
              <Fab
                size='small'
                className={`
                bg-neutral-400  hover:bg-neutral-200 
                text-black text-xl tracking-wider normal-case
              `}
              >
                <FiArrowLeft size={24} />
              </Fab>
            </Link>
          </NextLink>

          <NextLink href='/dealer/order-confirm' passHref>
            <Link className={`no-underline transition-colors`}></Link>
          </NextLink>
        </div> */}
			</div>
		</Layout>
	);
}

// export async function getServerSideProps({ req }) {
//   const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/product/categories`;

//   const token = req.cookies.token;

//   const { data } = await axios.get(backendURL, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const categoryLabels = Object.values(data);

//   return {
//     props: {
//       categoryLabels,
//     },
//   };
// }
