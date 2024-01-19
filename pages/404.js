import Layout from '@components/Layout';
import Link from 'next/link';

export default function FourOhFour() {
	return (
		<Layout fullWidth>
			<div className='mt-12 text-center'>
				<h1>404 - Sayfa bulunamadı</h1>
				<Link href='/' className='block'>
					<a>Anasayfaya dönün</a>
				</Link>
			</div>
		</Layout>
	);
}
