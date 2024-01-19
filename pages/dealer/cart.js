import Layout from '@components/Layout';
import Product from '@components/Product';
import {
	Button,
	Fab,
	Grid,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import {
	FiTrash,
	FiPlus,
	FiMinus,
	FiShoppingCart,
	FiSend,
} from 'react-icons/fi';
import { useState, useReducer, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadState, saveState, formatPrice } from 'lib';
import { CART, CART_ACTIONS } from 'utils/constants';
import { reducer } from './index.js';
import { notify } from 'utils/notify.js';

const tableHeadClasses = `
  font-serif font-semibold text-lg md:text-xl
`;

const tableBodyClasses = `
  text-md md:text-lg
`;

export default function DealerCartPage() {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});
	const [cart, updateCart] = useState(loadState(CART)?.cart);
	const Router = useRouter();

	useEffect(() => {
		updateCart(state?.cart);
		// console.log(state.cart);
	}, [state]);

	const handleIncrement = async (newProduct) => {
		try {
			console.log(newProduct);
			dispatch({ type: CART_ACTIONS.ADD, newProduct });
		} catch (error) {
			notify('error', 'Ürün adeti güncellenemedi.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};

	const handleDecrement = async (newProduct, amount) => {
		try {
			if (amount === 1 && !confirm('Emin misiniz?')) return;

			const dispatchType =
				amount === 1 ? CART_ACTIONS.DELETE : CART_ACTIONS.DECREMENT;

			dispatch({ type: dispatchType, newProduct });
		} catch (error) {
			notify('error', 'Ürün adeti güncellenemedi.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};

	const handleEmptyTest = async () => {
		try {
			dispatch({ type: CART_ACTIONS.EMPTY });
		} catch (error) {
			notify('error', 'Sepet boşaltılamadı.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};
	//   try {
	//     const cart = loadState(CART);

	//     if (cart) {
	//       const currentAmount = cart.products[product.product_id] ?? 0;

	//       saveState(CART, {
	//         products: {
	//           ...cart.products,
	//           [product.product_id]: currentAmount + 1,
	//         },
	//       });
	//     } else {
	//       const initialCartValue = {
	//         products: {
	//           [product.product_id]: 1,
	//         },
	//       };

	//       saveState(CART, initialCartValue);
	//     }
	//   } catch (error) {
	//     notify('error', 'Ürün sepete eklenemedi.');
	//   } finally {
	//     console.log(loadState(CART).products);
	//   }
	// };

	// const handleDecrement = async (product) => {
	//   try {
	//     const cart = loadState(CART);

	//     if (cart) {
	//       const currentAmount = cart.products[product.product_id] ?? 0;

	//       if (currentAmount === 1 || currentAmount === 0) {
	//         if (confirm('Sepetten çıkarmak istediğinize emin misiniz?')) {
	//           let newCartProducts = cart.products;
	//           delete newCartProducts[product.product_id];

	//           saveState(CART, {
	//             ...cart,
	//             products: newCartProducts,
	//           });
	//         }
	//       }

	//       saveState(CART, {
	//         products: {
	//           ...cart.products,
	//           [product.product_id]: currentAmount - 1 < 0 ? 0 : currentAmount - 1,
	//         },
	//       });
	//     }
	//   } catch (error) {
	//     notify('error', 'Ürün sepete eklenemedi.');
	//   } finally {
	//     console.log(loadState(CART).products);
	//   }
	// };

	// const handleEmptyCart = async () => {
	//   try {
	//     localStorage.removeItem(CART);
	//   } catch (error) {
	//     notify('error', 'Sepet boşaltılamadı.');
	//   }
	// };

	return (
		<Layout>
			<div className={`px-2 lg:px-12`}>
				<section className={`flex`}>
					<h1
						className={`flex-grow font-semibold text-xl md:text-3xl drop-shadow-md`}
					>
						Sepetiniz
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
									Object.values(cart)
										?.filter((elem) => elem !== undefined)
										?.map(([product, amount]) => (
											<TableRow
												hover
												role='checkbox'
												tabIndex={-1}
												key={product.product_id}
											>
												<TableCell align='left' className={tableBodyClasses}>
													{product.name}
												</TableCell>
												<TableCell
													align='left'
													style={{ maxWidth: 320 }}
													className={' text-sm break-words'}
												>
													{product?.order_description}
												</TableCell>
												<TableCell align='center' className={tableBodyClasses}>
													<section className='flex justify-between items-center gap-x-3 ml-3 align-baseline'>
														<button
															onClick={() => handleDecrement(product, amount)}
															className='cursor-pointer bg-transparent hover:bg-transparent drop-shadow-md border-none text-rose-500 hover:text-rose-300 transition-colors '
														>
															{amount === 1 ? (
																<FiTrash size={24} />
															) : (
																<FiMinus size={24} />
															)}
														</button>

														{/* <ThemeProvider theme={darkTheme}>
                                <CssBaseline />
                                <TextField
                                  fullWidth
                                  variant='outlined'
                                  id='amount'
                                  name='amount'
                                  type='number'
                                  placeholder='Şifrenizi giriniz...'
                                  className='text-center'
                                  value={amount}
                                  // onChange={handleChange}
                                />
                              </ThemeProvider> */}
														<span>{amount}</span>

														<button
															onClick={() => handleIncrement(product)}
															className='cursor-pointer bg-transparent hover:bg-transparent drop-shadow-md border-none text-sky-500 hover:text-sky-300 transition-colors '
														>
															<FiPlus size={24} />
														</button>
													</section>
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(product.price)}
												</TableCell>
												<TableCell align='right' className={tableBodyClasses}>
													{formatPrice(product.price * amount)}
												</TableCell>
											</TableRow>
										))}
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
													?.map(([_, amount]) => amount)
													?.reduce((partialSum, a) => partialSum + a, 0)}{' '}
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
														?.map(([product, amount]) => product.price * amount)
														?.reduce((partialSum, a) => partialSum + a, 0)
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

				<div className='grid grid-cols-3 place-items-center gap-3 my-12'>
					<div className=''>
						<Fab
							variant='extended'
							className={`
                bg-rose-700 hover:bg-rose-600
                text-white text-lg md:text-xl tracking-wider normal-case
              `}
							onClick={handleEmptyTest}
						>
							<FiTrash size={22} className='mr-1' /> Sil
						</Fab>
					</div>

					<NextLink href='/dealer' passHref>
						<Link className={`no-underline`}>
							<Fab
								variant='extended'
								className={`
                  bg-neutral-200 hover:bg-neutral-100 
                  text-black text-lg md:text-xl tracking-wider normal-case
              `}
							>
								Ürünler
							</Fab>
						</Link>
					</NextLink>

					<NextLink href='/dealer/order-confirm' passHref>
						<Link className={`no-underline transition-colors`}>
							<Fab
								variant='extended'
								className={`
                bg-emerald-400  hover:bg-emerald-300 
                text-black text-lg md:text-xl tracking-wider normal-case
              `}
							>
								<FiSend size={22} className='mr-1' /> Sepeti Onayla
							</Fab>
						</Link>
					</NextLink>
				</div>
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

/* <Grid container spacing={2}>
            <div className='m-3 p-2 w-full grid grid-cols-3 gap-3 bg-gradient-to-bl from-neutral-700 to-neutral-900 rounded-xl'>
              <span className='ml-3'>Ürün</span>

              <span className='ml-3'>Adet</span>
              <section className='inline-flex gap-x-3 ml-3 align-baseline'>
                İşlem
              </section>
            </div>
            {!!cart &&
              Object.values(cart).map(
                ([
                  { product_id, name, category_id, price, description },
                  amount,
                ]) => (
                  <div
                    key={product_id}
                    className='m-3 p-2 w-full grid grid-cols-3 gap-3 bg-gradient-to-bl from-neutral-700 to-neutral-900 rounded-xl'
                  >
                    <span className='ml-3'>Ürün: {name}</span>

                    <span className='ml-3'>Adet:{amount}</span>
                    <section className='inline-flex gap-x-3 ml-3 align-baseline'>
                      <Fab
                        size='small'
                        // onClick={() => handleDecrement(product_id)}
                        className='m-0.5 bg-red-400 rounded-full '
                      >
                        <FiMinus size={22} />
                      </Fab>
                      <Fab
                        size='small'
                        // onClick={() => handleIncrement(product_id)}
                        className='m-0.5 bg-neutral-100 rounded-full '
                      >
                        <FiPlus size={22} />
                      </Fab>
                    </section>
                  </div>
                  // <Grid item xs={12} sm={6} md={4} lg={3} key={product_id}>
                  //   <Product
                  //     product_id={product_id}
                  //     amount={cartProducts[product_id]}
                  //     onAddCart={handleAddCart}
                  //   />
                  // </Grid>
                )
              )}
            {!!state?.cart?.cart && <div className='flex justify-end'>d</div>}
          </Grid> */
