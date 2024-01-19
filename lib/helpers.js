import Cookies from 'cookies';
import { routes, adminPages, dealerPages } from 'utils/routes';

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
