import Router from 'next/router';
import nProgress from 'nprogress';
import { StyledEngineProvider } from '@mui/material';
import RouteGuard from '@components/RouteGuard';
import { AuthProvider } from 'contexts/auth/AuthProvider';
import { AppProvider } from 'contexts/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/nprogress.css';
import 'react-image-crop/dist/ReactCrop.css';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }) {
	return (
		<>
			<StyledEngineProvider injectFirst>
				<AppProvider>
					<AuthProvider>
						<RouteGuard>
							<Component {...pageProps} />
							<ToastContainer />
						</RouteGuard>
					</AuthProvider>
				</AppProvider>
			</StyledEngineProvider>
		</>
	);
}

export default MyApp;
