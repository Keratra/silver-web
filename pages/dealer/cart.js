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
	TextareaAutosize,
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
import { loadState, saveState, formatPrice, reducer } from 'lib';
import { CART, CART_ACTIONS } from 'utils/constants';
import { notify } from 'utils/notify.js';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";

const tableHeadClasses = `
  font-semibold text-lg md:text-xl
`;

const tableBodyClasses = `
  text-md md:text-lg
`;

export default function DealerCartPage() {
	const [state, dispatch] = useReducer(reducer, {
		cart: loadState(CART)?.cart,
	});
	const [cart, updateCart] = useState(loadState(CART)?.cart);
	const [user, setUser] = useState(false);
	const Router = useRouter();
	

	useEffect(() => {
		updateCart(state?.cart);
		// console.log(state.cart);
	}, [state]);
	
	useEffect(() => {
		const token = loadState('token')?.token;
		if (!token || token === '' || token === 'null' || token === null ) {
			setUser(() => false);
		} else {
			setUser(() => true);
		}
	}, []);

	const handleIncrement = async (newProduct) => {
		try {
			// console.log(newProduct);
			dispatch({ type: CART_ACTIONS.ADD, newProduct });
		} catch (error) {
			notify('error', 'Failed to update product quantity.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};

	const handleDecrement = async (newProduct, amount) => {
		try {
			if (amount === 1 && !confirm('Are you sure?')) return;

			const dispatchType =
				amount === 1 ? CART_ACTIONS.DELETE : CART_ACTIONS.DECREMENT;

			dispatch({ type: dispatchType, newProduct });
		} catch (error) {
			notify('error', 'Failed to update product quantity.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};

	const handleEmptyTest = async () => {
		try {
			dispatch({ type: CART_ACTIONS.EMPTY });
		} catch (error) {
			notify('error', 'Failed to empty the cart.');
		} finally {
			// console.log(loadState(CART).products);
		}
	};
	//   try {
	//     const cart = loadState(CART);

	//     if (cart) {
	//       const currentAmount = cart.products[product.id] ?? 0;

	//       saveState(CART, {
	//         products: {
	//           ...cart.products,
	//           [product.id]: currentAmount + 1,
	//         },
	//       });
	//     } else {
	//       const initialCartValue = {
	//         products: {
	//           [product.id]: 1,
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
	//       const currentAmount = cart.products[product.id] ?? 0;

	//       if (currentAmount === 1 || currentAmount === 0) {
	//         if (confirm('Sepetten çıkarmak istediğinize emin misiniz?')) {
	//           let newCartProducts = cart.products;
	//           delete newCartProducts[product.id];

	//           saveState(CART, {
	//             ...cart,
	//             products: newCartProducts,
	//           });
	//         }
	//       }

	//       saveState(CART, {
	//         products: {
	//           ...cart.products,
	//           [product.id]: currentAmount - 1 < 0 ? 0 : currentAmount - 1,
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
		<Layout fullWidth>
			<div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex justify-between items-center select-none'>
				<h1 className='font-serif font-medium text-lg sm:text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				<nav className='w-full flex justify-end items-center flex-wrap ml-2'>
					<NextLink href='/dealer' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Products
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>

					{!!user ? (
						<>

						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						</>
						) : (
						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center  gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiLogin size={24} className='' /> Login
								</span>
							</Link>
						</NextLink>
						)}
				</nav>
			</header>
			</div>
			
			<div className={`max-w-7xl mx-auto px-2 lg:px-12 min-h-screen`}>
				<section className={`flex`}>
					<h1
						className={`flex-grow font-semibold text-xl md:text-3xl drop-shadow-md`}
					>
						Your Cart
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
										Product
									</TableCell>
									<TableCell
										align='center'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Quantity
									</TableCell>
									<TableCell
										align='right'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Price
									</TableCell>
									<TableCell
										align='right'
										style={{ minWidth: 170 }}
										className={tableHeadClasses}
									>
										Total
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
									key={product.id}
								>
									<TableCell align='left' className={tableBodyClasses}>
										{product.name}
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
													placeholder='Enter your password...'
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
										align='center'
										className={tableBodyClasses + ' font-semibold'}
									>
										Total{' '}
										<span className='font-normal'>
											{Object.values(cart)
												?.map(([_, amount]) => amount)
												?.reduce((partialSum, a) => partialSum + a, 0)}{' '}
											products
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
										Order Total
										<span className='ml-2 font-normal'>
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
								No product in cart.
							</div>
						)}
					</TableContainer>
				</Paper>

				<div className='grid grid-cols-2 place-items-center gap-3 my-12'>
					<div className=''>
						<Fab
							variant='extended'
							className={`
								bg-rose-700 hover:bg-rose-600 ml-2
								text-white text-lg md:text-xl tracking-wider normal-case
							`}
							onClick={handleEmptyTest}
						>
							<FiTrash size={22} className='mr-1' /> DELETE ORDER
						</Fab>
					</div>

					<NextLink href='/dealer/order-confirm' passHref>
						<Link className={`no-underline transition-colors`}>
							<Fab
								variant='extended'
								className={`
									bg-emerald-500  hover:bg-emerald-400 ml-2
									text-white text-lg md:text-xl tracking-wider uppercase
								`}
							>
								<FiSend size={22} className='mr-1' /> Confirm Order
							</Fab>
						</Link>
					</NextLink>
				</div>
			</div>
		</Layout>
	);
}

// export async function getServerSideProps({ req }) {
//   const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/product/categories`;

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
                  { id, name, category_id, price, description },
                  amount,
                ]) => (
                  <div
                    key={id}
                    className='m-3 p-2 w-full grid grid-cols-3 gap-3 bg-gradient-to-bl from-neutral-700 to-neutral-900 rounded-xl'
                  >
                    <span className='ml-3'>Ürün: {name}</span>

                    <span className='ml-3'>Adet:{amount}</span>
                    <section className='inline-flex gap-x-3 ml-3 align-baseline'>
                      <Fab
                        size='small'
                        // onClick={() => handleDecrement(id)}
                        className='m-0.5 bg-red-400 rounded-full '
                      >
                        <FiMinus size={22} />
                      </Fab>
                      <Fab
                        size='small'
                        // onClick={() => handleIncrement(id)}
                        className='m-0.5 bg-neutral-100 rounded-full '
                      >
                        <FiPlus size={22} />
                      </Fab>
                    </section>
                  </div>
                  // <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                  //   <Product
                  //     id={id}
                  //     amount={cartProducts[id]}
                  //     onAddCart={handleAddCart}
                  //   />
                  // </Grid>
                )
              )}
            {!!state?.cart?.cart && <div className='flex justify-end'>d</div>}
          </Grid> */
