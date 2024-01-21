import {
	AppBar,
	Container,
	Link,
	Toolbar,
	Typography,
	Drawer,
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	IconButton,
	CssBaseline,
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
// import banner from '/public/bg/bg (26).png';
import { FiMenu, FiLogOut, FiArrowRight } from 'react-icons/fi';
import { chooseUserType, loadState, parseJwt } from 'lib';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp } from 'contexts/AppContext';
import { useRouter } from 'next/router';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 200;

const anchorClasses = `
    w-full
    text-black
    no-underline
`;

export default function Layout({ fullWidth, title, children }) {
	const Router = useRouter();
	const [navbarTitle, setNavbarTitle] = useState('silver');
	const [titlePath, setTitlePath] = useState('/');
	const [mobileOpen, setMobileOpen] = useState(false);
	const [drawer, setDrawer] = useState('');

	const currentPage = Router.pathname;

	const appState = useApp();

	const tokenState = loadState('token');

	const tokenDetails = parseJwt(tokenState?.token);
	const items = chooseUserType(tokenDetails?.sub.user_type);

	const isAuthenticated = tokenState?.isAuthenticated;

	const userType = tokenDetails?.sub.user_type;

	useEffect(() => {
		// To avoid "Text doesn't match..." errors in development
		setNavbarTitle(tokenState?.username ?? 'SILVER');
		// const navbarTitle = 'silver';
		setTitlePath(!!userType ? '/' + userType : '/');
		// const titlePath = '/';
		setDrawer(
			<div>
				<div className='mt-6 -mb-14 text-xl text-center cursor-pointer'>
					<NextLink href={titlePath} passHref>
						<Link className={`no-underline`}>
							<span
								className={`font-serif text-2xl text-black transition-colors tracking-wider uppercase`}
							>
								{navbarTitle}
							</span>
						</Link>
					</NextLink>
				</div>
				<Toolbar />
				<List className={`flex flex-col justify-evenly items-center`}>
					{items.map(({ name, pathname, icon }, index) => (
						<ListItem key={index} disablePadding>
							<NextLink href={pathname} passHref replace>
								<Link className={anchorClasses}>
									<ListItemButton className='py-4'>
										<ListItemIcon className={``}>{icon}</ListItemIcon>
										<ListItemText className={``} primary={name} />
									</ListItemButton>
								</Link>
							</NextLink>
						</ListItem>
					))}
				</List>
				<Divider />
			</div>
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenState?.username, userType]);

	const { logout } = useAuth();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const LogoutButton = () => {
		if (!isAuthenticated) {
			<section className='mt-auto mb-4 flex justify-center items-center'>
				<NextLink href='/' passHref>
					<Link
						className={`text-xl text-neutral-600 no-underline hover:text-rose-500 transition-colors select-none`}
					>
						<FiLogOut
							size={22}
							// ['admin', 'dealer'].includes(appState.userType) && logout
							className={`inline-block align-text-bottom mr-1`}
						/>{' '}
						LOGOUT
					</Link>
				</NextLink>
			</section>;
		}

		return (
			<section
				onClick={logout}
				className='mt-auto mb-4 flex justify-center items-center'
			>
				<NextLink href='/' passHref>
					<Link
						className={`text-xl text-black no-underline hover:text-rose-500 transition-colors select-none`}
					>
						<FiLogOut
							size={22}
							// ['admin', 'dealer'].includes(appState.userType) && logout
							className={`inline-block align-text-bottom mr-1`}
						/>{' '}
						LOGOUT
					</Link>
				</NextLink>
			</section>
		);
	};

	return (
		<div
			className={`bg-slate-100 font-['Roboto'] selection:bg-fuchsia-800 selection:text-white`}
		>
			<Head>
				<title>Silver</title>
				<meta property='og:title' content='Silver' />
				<meta property='og:type' content='website' />
				<meta
					property='og:description'
					content='A marketplace for products sold by owners'
				/>
				<meta property='og:image' content='/favicon.ico' />
			</Head>

			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				{!fullWidth && (
					<>
						<AppBar
							position='absolute'
							sx={{
								display: { xs: 'block', sm: 'none' },
								'& .MuiDrawer-paper': {
									boxSizing: 'border-box',
									width: drawerWidth,
								},
								width: { sm: `calc(100% - ${drawerWidth}px)` },
								ml: { sm: `${drawerWidth}px` },
							}}
							className={`bg-white text-black shadow-sm shadow-neutral-200  `}
						>
							<Toolbar
								variant='dense'
								className='flex justify-between items-center'
							>
								<IconButton
									color='inherit'
									aria-label='open drawer'
									edge='start'
									onClick={handleDrawerToggle}
									sx={{ mr: 2, display: { sm: 'none' } }}
								>
									<MenuIcon />
								</IconButton>
								
								{/* <NextLink href={titlePath} passHref>
									<Link className={`text-center no-underline`}>
										<span
											className={`font-serif text-2xl text-black transition-colors tracking-wider drop-shadow-md`}
										>
											{navbarTitle}
										</span>
									</Link>
								</NextLink> */}

								{/* <div className={`flex-grow mx-10`} /> */}
							</Toolbar>
						</AppBar>

						<Box
							component='nav'
							sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
						>
							{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
							<Drawer
								variant='temporary'
								open={mobileOpen}
								onClose={handleDrawerToggle}
								ModalProps={{
									keepMounted: true, // Better open performance on mobile.
								}}
								sx={{
									display: { xs: 'block', sm: 'none' },
									'& .MuiDrawer-paper': {
										boxSizing: 'border-box',
										width: drawerWidth,
									},
								}}
							>
								{drawer}

								<LogoutButton />
							</Drawer>

							<Drawer
								variant='permanent'
								sx={{
									display: { xs: 'none', sm: 'block' },
									'& .MuiDrawer-paper': {
										boxSizing: 'border-box',
										width: drawerWidth,
									},
								}}
								open
							>
								{drawer}

								<LogoutButton />
							</Drawer>
						</Box>
					</>
				)}

				<Box
					component='main'
					sx={{
						flexGrow: 1,
						width: { sm: `calc(100% - ${drawerWidth}px)` },
					}}
				>
					{/* <Toolbar /> */}
					<Container
						maxWidth={fullWidth ? false : false}
						className={`min-h-screen p-0 text-black ${
							fullWidth ? '' : ' mt-12 '
						} `}
					>
						{children}

						{!!fullWidth && (
							<footer className='w-full bg-black text-gray-100 py-2'>
								<div className='flex flex-wrap justify-between px-4'>
									<p className='text-sm'>
										&copy; 2024 Silver Market. All rights reserved.
									</p>
									<nav className='text-sm flex items-center'>
										<a href='#' className='text-gray-100 hover:text-gray-300 mx-3 transition-colors'>
											Terms of Service
										</a>
										<a href='#' className='text-gray-100 hover:text-gray-300 mx-3 transition-colors'>
											Privacy Policy
										</a>

										<NextLink href='/admin/login' passHref>
											<Link className='mx-3 no-underline'>
												<span className='text-gray-100 hover:text-gray-300 transition-colors'>
													Admin Login
												</span>
											</Link>
										</NextLink>
									</nav>
								</div>
							</footer>
						)}
					</Container>
				</Box>
			</Box>
		</div>
	);
}
