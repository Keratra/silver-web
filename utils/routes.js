import {
	HiHome,
	HiEye,
	HiUser,
	HiTemplate,
	HiTag,
	HiCube,
	HiBriefcase,
	HiViewGridAdd,
	HiCash,
	HiLightBulb,
} from 'react-icons/hi';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { IoSettingsSharp } from 'react-icons/io5';

const size = 24;

export const routes = [
	{
	  name: 'Homepage',
	  pathname: '/',
	  icon: <HiHome size={size} className={`align-top`} />,
	},
	{
		name: 'Dashboard',
		pathname: '/admin',
		icon: <HiBriefcase size={size} className={`align-top`} />,
	},
	{
		name: 'Product',
		pathname: '/admin/products?page=1&search=',
		icon: <HiTemplate size={size} className={`align-top`} />,
	},
	{
		name: 'Orders',
		pathname:
			'/admin/see-orders/WAIT?page=1&search=&isNameSearch=true',
		icon: <HiCash size={size} className={`align-top`} />,
	},
	{
		name: 'Customers',
		pathname: '/admin/customers',
		icon: <HiEye size={size} className={`align-top`} />,
	},
	{
		name: 'Inquiries',
		pathname: '/admin/contacts?page=1',
		icon: <HiTag size={size} className={`align-top`} />,
	},
	{
		name: 'Categories',
		pathname: '/admin/product-categories',
		icon: <HiViewGridAdd size={size} className={`align-top`} />,
	},
	{
		name: 'Settings',
		pathname: '/admin/settings',
		icon: <IoSettingsSharp size={size} className={`align-top`} />,
	},
	// {
	// 	name: 'Products',
	// 	pathname: '/dealer?page=1&search=',
	// 	icon: <HiCube size={size} className={`align-top`} />,
	// },
	{
		name: 'Profile',
		pathname: '/dealer/profile',
		icon: <HiUser size={size} className={`align-top`} />,
	},
	{
		name: 'Order History',
		pathname: '/dealer/see-orders/WAIT?page=1&search=&isNameSearch=true',
		icon: <HiCash size={size} className={`align-top`} />,
	},
];

export const dealerPages = [
	'Products',
	'Profile',
	'Order History',
];
export const adminPages = [
	'Dashboard',
	'Product',
	'Customers',
	'Inquiries',
	'Categories',
	'Orders',
	'Settings',
];

export const ignoredRouteList = [
	'/',
	'/contact',
	'/map',
	'/admin/login',
	'/dealer/login',
	'/dealer/register',

	'/dealer',
	'/dealer/cart',
	'/dealer/order-confirm',

	'/dealer/forgot-password',
	'/dealer/reset-password/[token]',

	'/404',
	'/500',
	'/maintenance',
];
