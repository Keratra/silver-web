import { loadState, parseJwt, saveState } from 'lib';
import { ignoredRouteList } from 'utils/routes';
import initialState from './store';
import reducer from './reducer';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { LOGINUSER, LOGOUTUSER, SETUSERTYPE } from './types';
import Router from 'next/router';
import axios from 'axios';
import { notify } from 'utils/notify';
import { CART } from 'utils/constants';
import Cookies from 'js-cookie';

const AuthContext = createContext();

function AuthProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const auth = loadState('token');
	const token = auth?.token;
	const tokenDetails = parseJwt(token);
	const isTokenExpired =
		tokenDetails?.exp && tokenDetails?.exp * 1000 < Date.now();

	// const handleLogout = async () => {
	// 	try {
	// 		const { data } = await axios.post(
	// 			`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`,
	// 			{},
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		);

	// 		console.log(data);
	// 	} catch (error) {
	// 		console.log(
	// 			error?.response?.data?.message?.message ??
	// 				error?.response?.data?.message ??
	// 				error?.response?.data ??
	// 				error?.message ??
	// 				'FE - Error occured during logout.'
	// 		);
	// 	}
	// };

	useEffect(() => {
		if (tokenDetails?.sub?.user_type) {
			dispatch({
				type: SETUSERTYPE,
				payload: tokenDetails.sub.user_type,
			});
		}

		const userregexp = new RegExp(`\\b${tokenDetails?.sub?.user_type}\\b`, 'g');

		if (isTokenExpired && userregexp.test(Router.pathname)) {
			dispatch({ type: LOGOUTUSER });
			notify('error', 'Please login again.');
			if (!ignoredRouteList.includes(Router.pathname)) {
				Router.push(`/${state?.token ? state.userType : ''}`);
			}
		}

		if (!isTokenExpired && !(token === null || token === undefined)) {
			dispatch({
				type: LOGINUSER,
				payload: {
					token,
					userType: tokenDetails?.sub?.user_type,
					userName: auth.userName,
				},
			});
		} else {
			dispatch({ type: LOGOUTUSER });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function loginWithToken({ token, userType, userName }) {
		saveState('token', { isAuthenticated: true, token, userName, userType });
		dispatch({
			type: LOGINUSER,
			payload: {
				token,
				userType,
				userName,
			},
		});
		notify('success', 'Logged in');
	}

	function logout() {
		saveState('token', {
			...initialState,
		});

		saveState(CART, { cart: {} });

		dispatch({
			type: LOGOUTUSER,
		});

		Cookies.set('token', '')

		// handleLogout();
		notify('success', 'Logged out');
	}

	return (
		<AuthContext.Provider
			value={{
				state,
				dispatch,
				logout,
				loginWithToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
