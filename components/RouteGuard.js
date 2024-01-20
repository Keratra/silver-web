import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'contexts/auth/AuthProvider';
import { loadState, parseJwt } from 'lib';
import { ignoredRouteList } from 'utils/routes';
import Loader from './Loader';
import { notify } from 'utils/notify';

export default function RouteGuard({ children }) {
	const router = useRouter();

	const { state } = useAuth();

	const auth = loadState('token');
	const { isAuthenticated } = state;

	const token = auth?.token;
	const tokenDetails = parseJwt(token);
	const isTokenExpired =
		tokenDetails?.exp && tokenDetails?.exp * 1000 < Date.now();

	const isIgnored = ignoredRouteList.includes(router.pathname);

	useEffect(() => {
		if (!isIgnored && !token && !isAuthenticated) {
			router.push('/');
			// router.push(`/${tokenDetails?.sub.user_type || state.userType}`);
			// notify('warning', 'Please login again.');
		} else if (!isIgnored && isTokenExpired) {
			router.push('/');
			// router.push(`/${tokenDetails?.sub.user_type || state.userType}`);
			notify('warning', 'Please login again.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, token]);

	if (!isIgnored && isAuthenticated) {
		return children;
	}

	return children;
}
