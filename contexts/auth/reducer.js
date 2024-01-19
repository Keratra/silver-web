import { LOGINUSER, LOGOUTUSER, SETUSERTYPE } from './types';

export default function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case LOGINUSER:
			return {
				...state,
				token: payload.token,
				isAuthenticated: true,
				userType: payload.userType,
				userName: payload.userName,
			};
		case LOGOUTUSER:
			return {
				...state,
				token: null,
				isAuthenticated: false,
				userType: '',
				userName: '',
			};
		case SETUSERTYPE:
			return {
				...state,
				userType: payload,
			};
		default:
			return state;
	}
}
