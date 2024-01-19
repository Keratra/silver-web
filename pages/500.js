import Layout from '@components/Layout';
import Link from 'next/link';

export default function FiveOhFive() {
	return (
		<Layout fullWidth>
			<div className='mt-12 text-center'>
				<h1>500 - Application Error</h1>
				<Link href='/' className='block'>
					<a>Go back home</a>
				</Link>
			</div>
		</Layout>
	);
}
