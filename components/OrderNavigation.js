import NextLink from 'next/link';
import { Link } from '@mui/material';
import { FiInbox, FiLoader, FiMap, FiUserCheck, FiUserX } from 'react-icons/fi';

export function OrderNavigation({ user, highlight, classExtension, children }) {
	const classLink = `
    box-border py-3 px-6
    hover:bg-slate-100
    text-lg text-center
    no-underline cursor-pointer select-none
    transition-all 
		group
  `;

	const classActiveLink = `
		bg-gradient-to-b text-[#F2F2F2]
		from-slate-800 to-slate-900
	`;

	const classIcon = `
		align-middle mr-1
		group-hover:animate-wiggle
	`;

	const sizeIcon = 20;

	const adminLinks = {
		WAIT: '/admin/see-orders/WAIT?page=1&search=&isNameSearch=true&selectedDealer=',
		PREP: '/admin/see-orders/PREP?page=1&search=&isNameSearch=true&selectedDealer=',
		CARG: '/admin/see-orders/CARG?page=1&search=&isNameSearch=true&selectedDealer=',
		DELI: '/admin/see-orders/DELI?page=1&search=&isNameSearch=true&selectedDealer=',
		CANC: '/admin/see-orders/CANC?page=1&search=&isNameSearch=true&selectedDealer=',
	};

	const dealerLinks = {
		WAIT: '/dealer/see-orders/WAIT?page=1&search=&isNameSearch=true',
		PREP: '/dealer/see-orders/PREP?page=1&search=&isNameSearch=true',
		CARG: '/dealer/see-orders/CARG?page=1&search=&isNameSearch=true',
		DELI: '/dealer/see-orders/DELI?page=1&search=&isNameSearch=true',
		CANC: '/dealer/see-orders/CANC?page=1&search=&isNameSearch=true',
	};

	const links = user === 'admin' ? adminLinks : dealerLinks;

	return (
		<div
			className={`
				box-border
        grid grid-cols-1 lg:grid-cols-5 
				shadow-md bg-white ${classExtension}
			`}
		>
			<NextLink href={links.WAIT}>
				<Link
					className={
						classLink +
						(highlight === 'WAIT' ? ' ' + classActiveLink : 'text-neutral-900')
					}
				>
					<FiInbox size={sizeIcon} className={classIcon} /> WAITING
				</Link>
			</NextLink>
			<NextLink href={links.PREP} passHref>
				<Link
					className={
						classLink +
						(highlight === 'PREP' ? ' ' + classActiveLink : 'text-neutral-900')
					}
				>
					<FiLoader
						size={sizeIcon}
						className={
							classIcon + `${highlight === 'PREP' && ' animate-spin-slow  '}`
						}
					/>{' '}
					PREPARING
				</Link>
			</NextLink>
			<NextLink href={links.CARG} passHref>
				<Link
					className={
						classLink +
						(highlight === 'CARG' ? ' ' + classActiveLink : 'text-neutral-900')
					}
				>
					<FiMap size={sizeIcon} className={classIcon} /> SHIPPING
				</Link>
			</NextLink>
			<NextLink href={links.DELI} passHref>
				<Link
					className={
						classLink +
						(highlight === 'DELI' ? ' ' + classActiveLink : 'text-neutral-900')
					}
				>
					<FiUserCheck size={sizeIcon} className={classIcon} /> DELIVERED
				</Link>
			</NextLink>
			<NextLink href={links.CANC} passHref>
				<Link
					className={
						classLink +
						(highlight === 'CANC' ? ' ' + classActiveLink : 'text-neutral-900')
					}
				>
					<FiUserX size={sizeIcon} className={classIcon} /> CANCELLED
				</Link>
			</NextLink>
		</div>
	);
}
