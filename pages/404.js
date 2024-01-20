import Layout from '@components/Layout';
import Link from 'next/link';

export default function FourOhFour() {
	return (
		<Layout fullWidth>
			<div className='mt-12 text-center'>
				<h1>404 - Page Not Found</h1>
				<Link href='/' className='block'>
					<a>Go back to homepage</a>
				</Link>
			</div>
		</Layout>
	);
}
