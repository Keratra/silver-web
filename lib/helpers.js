import Cookies from 'cookies';
import { routes, adminPages, dealerPages } from 'utils/routes';
import { CART, CART_ACTIONS } from 'utils/constants';

// Capitalize
export const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Lowercase
export const lowercase = (string) => {
	return string.toLowerCase();
};

// Format price
export const formatPrice = (number) => {
	const fnumber = parseFloat(parseFloat(number).toFixed(2));
	return new Intl.NumberFormat('tr-TR', {
		style: 'currency',
		currency: 'TRY',
	}).format(fnumber);
};

export function loadState(key, fallback) {
	try {
		const serializedState = localStorage.getItem(key);
		if (!serializedState) return fallback;
		return JSON.parse(serializedState);
	} catch (e) {
		return fallback;
	}
}

export async function saveState(key, state) {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch (e) {
		// Ignore
		console.log(e);
	}
}

export function saveCookie({ key, value, req, res }) {
	const cookies = new Cookies(req, res);
	cookies.set(key, JSON.stringify(value), {
		httpOnly: true,
		secure: false,
		maxAge: Date.now() + 1000 * 60 * 60 * 24,
		path: '/',
		sameSite: 'lax',
	});
}

export function getFormattedPhoneNum(input) {
	if (input) {
		const filling = ' ';
		let output = '+';
		input.replace(
			/^\D*(\d{0,2})\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/,
			function (match, g0, g1, g2, g3) {
				if (g0.length) {
					output += g0;
					if (g0.length === 2) {
						output += filling + '(';
						if (g1.length) {
							output += g1;
							if (g1.length == 3) {
								output += ')';
								if (g2.length) {
									output += filling + g2;
									if (g2.length == 3) {
										output += filling;
										if (g3.length) {
											output += g3;
										}
									}
								}
							}
						}
					}
				}
			}
		);
		return output;
	}
	return input;
}

export const parseJwt = (token) => {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
};

export const chooseUserType = (userType) => {
	const ignorePages = {
		dealer: [...adminPages],
		admin: [...dealerPages],
	};

	switch (userType) {
		case 'admin':
			return routes?.filter(({ name }) => !ignorePages.admin.includes(name));
		case 'dealer':
			return routes?.filter(({ name }) => !ignorePages.dealer.includes(name));
		default:
			return [];
	}
};

export const fetcher = (url) => fetch(url).then((res) => res.json());

export function reducer(state, action) {
	let newState;
	let newCart;
	let currentAmount;
	let newAmount;
	let new_id;
	switch (action.type) {
		case CART_ACTIONS.CREATE:
			if (
				action.newProduct?.id === null ||
				action.newProduct?.id === undefined
			)
				return state;

			newState = {
				...state,
				cart: {
					...state.cart,
					[action.newProduct?.id]: [action.newProduct, action.amount ?? 1],
				},
			};

			// console.log(newState.cart);

			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.ADD: // it is increment now
			if (
				action.newProduct?.id === null ||
				action.newProduct?.id === undefined
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct?.id?.toString()
				)
			) {
				// console.log('item already in cart ' + action.newProduct.id);
				currentAmount = state.cart[action.newProduct.id][1] ?? 0;
				
				if (action.amount === undefined) {
					newAmount = currentAmount + 1;
				} else {
					newAmount = currentAmount + action.amount;
				}
				
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.id.toString()]: [action.newProduct, newAmount],
					},
				};
			} else {
				// console.log('item not in cart' + action.newProduct.id);
				newAmount = action.amount ?? 1;
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.id.toString()]: [action.newProduct, newAmount],
					},
				};
			}
			// console.log(
			//   Object.values(newState.cart).map((elem) => elem[0].id)
			// );
			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.DECREMENT:
			if (
				action.newProduct?.id === null ||
				action.newProduct?.id === undefined ||
				state.cart[action.newProduct.id][1] === 1
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct.id.toString()
				)
			) {
				// console.log('item already in cart ' + action.newProduct.id);
				currentAmount = state.cart[action.newProduct.id][1] ?? 0;

				newAmount = currentAmount - 1;
				newState = {
					...state,
					cart: {
						...state.cart,
						[action.newProduct.id]: [action.newProduct, newAmount],
					},
				};
			} else {
				newState = state;
			}
			// console.log(
			//   Object.values(newState.cart).map((elem) => elem[0].id)
			// );
			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.DELETE:
			if (
				action.newProduct?.id === null ||
				action.newProduct?.id === undefined
			)
				return state;

			if (
				Object.keys(state.cart ?? []).includes(
					action.newProduct.id.toString()
				)
			) {
				newCart = state.cart;
				delete newCart[action.newProduct.id];

				newState = {
					...state,
					cart: {
						...newCart,
					},
				};
			} else {
				newState = state;
			}

			saveState(CART, newState);
			return newState;

		case CART_ACTIONS.EMPTY:
			newState = { ...state, cart: {} };
			saveState(CART, newState);
			return newState;

		default:
			return state;
	}
}