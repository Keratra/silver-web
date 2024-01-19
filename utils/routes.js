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
		name: 'Products',
		pathname: '/admin/products?page=1&search=',
		icon: <HiTemplate size={size} className={`align-top`} />,
	},
	{
		name: 'Orders',
		pathname:
			'/admin/see-orders/WAIT?page=1&search=&isNameSearch=true&selectedDealer=',
		icon: <HiCash size={size} className={`align-top`} />,
	},
	{
		name: 'Payments',
		pathname: '/admin/payments',
		icon: <RiSecurePaymentFill size={size} className={`align-top`} />,
	},
	{
		name: 'View',
		pathname: '/admin/view?page=1&search=&selectedDealer=',
		icon: <HiEye size={size} className={`align-top`} />,
	},
	// {
	// 	name: 'Price Requests',
	// 	pathname: '/admin/price-requests',
	// 	icon: <HiTag size={size} className={`align-top`} />,
	// },
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
	{
		name: 'Ürünleriniz',
		pathname: '/dealer?page=1&search=',
		icon: <HiCube size={size} className={`align-top`} />,
	},
	{
		name: 'Yeni Ürünler',
		pathname: '/dealer/new-products?page=1&search=',
		icon: <HiBriefcase size={size} className={`align-top`} />,
	},
	{
		name: 'Ürün Önerin',
		pathname: '/dealer/product-offer',
		icon: <HiLightBulb size={size} className={`align-top`} />,
	},
	{
		name: 'Your Payments',
		pathname: '/dealer/payments',
		icon: <RiSecurePaymentFill size={size} className={`align-top`} />,
	},
	{
		name: 'Your Orders',
		pathname: '/dealer/see-orders/WAIT?page=1&search=&isNameSearch=true',
		icon: <HiCash size={size} className={`align-top`} />,
	},
	{
		name: 'Profile',
		pathname: '/dealer/profile',
		icon: <HiUser size={size} className={`align-top`} />,
	},
];

export const dealerPages = [
	'Ürünleriniz',
	'Yeni Ürünler',
	'Ürün Önerin',
	'Profile',
	'Your Payments',
	'Your Orders',
];
export const adminPages = [
	'Dashboard',
	'Products',
	'Payments',
	'View',
	'Fiyat İstekleri',
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

	// '/admin/forgot-password',
	// '/student/confirm-new-password/[token]',
	// '/student/reset-password/[token]',
	'/dealer/forgot-password',
	'/dealer/reset-password/[token]',
	// '/employee/confirm-new-password/[token]',
	// '/employee/reset-password/[token]',
	// '/forgot',

	'/404',
	'/500',
	'/maintenance',
];
