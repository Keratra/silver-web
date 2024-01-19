import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Fab,
	Popover,
	Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import { formatPrice } from 'lib';
import { SlQuestion } from 'react-icons/sl';
import { useState } from 'react';

const fetcher = async (url, id) =>
	await fetch(url, {
		body: id,
	}).then((response) => response.json());

const Product = ({
	product,
	size,
	categories,
	fabFunc,
	adminView = false,
	hasPrice = false,
	forCart = false,
	sendOnlyImage = false,
	displayOnly = false,
	hasDifferentImageSource = false,
	dashboardTitle = '',
	handlePriceChange,
	selectedDealer,
}) => {
	const Router = useRouter();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	let src = !!(product?.image)
		? `https://fqbnucbxfnzkdnbxwsje.supabase.co/storage/v1/object/public/product_images/${
				product?.image
		  }`
		: `https://i.picsum.photos/id/51/5000/3333.jpg?hmac=9dZb89mIRt-mPQpI_ScJAxVsNI82SFCGOuiKsvGSchY`;
	// console.log({
	//   id: product?.id,
	//   product_id: product?.product_id,
	// });

	if (hasDifferentImageSource) {
		src = `${process.env.NEXT_PUBLIC_API_URL}/special-product/image/${
			product?.id ?? product?.product_id
		}`;
	}

	const handleDetailRedirect = () => {
		if (!!adminView) {
			Router.push(`/admin/product/${product?.id ?? product?.product_id}`);
		}
	};

	if (sendOnlyImage) {
		return (
			<div className='m-0 p-1 flex justfiy-center items-center rounded-lg shadow-md transition-all'>
				<Image
					loader={() => src}
					src={src}
					// src={'https://picsum.photos/1000'}
					width={1000}
					height={1000}
					unoptimized={true}
					//onError={() => setSrc('/warning-sign-circle.svg')}
					placeholder='blur'
					blurDataURL='/images/spinner.gif'
					className='rounded-lg text-center text-xl bg-white transition-transform'
					alt={product?.name ?? 'Product'}
				/>
			</div>
		);
	}

	return (
		<div className='border-solid border border-transparent shadow-none md:hover:shadow-2xl md:hover:border-slate-900 transition-all'>
			<Card className={`shadow-md rounded-none  bg-slate-100 text-black `}>
				<CardMedia className='bg-white'>
					{/* <CardMedia
          component='img'
          image={src}
          title={product?.name}
          height={100 * size}
          className='text-center text-xl bg-gradient-to-br from-stone-600 to-stone-800  transition-transform'
        /> */}
					{/* <div style={{ position: 'relative', width: '400px', height: '400px' }}>
          <Image
            width={400}
            height={400}
            src={src}
            alt='Current Image'
            placeholder='blur'
            blurDataURL='/images/spinner.gif'
            style={{ objectFit: 'scale-down' }}
          />
        </div> */}

					<Image
						loader={() => src}
						src={src}
						// src={'https://picsum.photos/256'}
						// style={{ objectFit: 'cover' }}
						width={1000}
						height={1000}
						unoptimized={true}
						//onError={() => setSrc('/warning-sign-circle.svg')}
						placeholder='blur'
						blurDataURL='/images/spinner.gif'
						className='text-center text-xl pt-2 bg-slate-50 transition-transform'
						alt={product?.name ?? 'Product'}
					/>

					<CardContent className={`pl-3 py-2  bg-white`}>
						<Typography
							variant='h6'
							className={`drop-shadow-md text-sm md:text-base text-center`}
						>
							{(!product?.name || product?.name === '') && (
								<SkeletonTheme baseColor='#444' highlightColor='#555'>
									<Skeleton />
								</SkeletonTheme>
							)}
							
							<div className='inline-flex justify-center items-center'>
							{product?.name}

							<Fab
								size='small'
								className={` shadow-none text-neutral-900 hover:bg-neutral-200 bg-transparent drop-shadow-md`}
								onClick={handleClick}
							>
								<SlQuestion size={22} />
							</Fab>
							<Popover
								id={id}
								open={open}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
								className=''
							>
								<span className='box-border px-1 py-0.5 drop-shadow-md text-lg text-slate-900'>
									{!!product?.description
										? product?.description
										: 'Açıklama bulunmamaktadır'}
								</span>
							</Popover>
						</div>
						</Typography>

						<div
							className={`my-1  text-neutral-600 text-sm text-center  drop-shadow-md`}
						>
							{(!product?.category_id || product?.category_id === '') && (
								<SkeletonTheme baseColor='#444' highlightColor='#555'>
									<Skeleton />
								</SkeletonTheme>
							)}
							
							{product?.category_id &&
								categories[parseInt(product?.category_id) - 1]}
							{!!product?.price ? (
								<span
									className={`flex-auto ml-1 mt-0.5  tracking-wider text-center`}
								>
									- {formatPrice(product?.price)}
								</span>
							) : (
								<Typography
									className={`flex-auto ml-1 mt-0.5 text-sm`}
								></Typography>
							)}
						</div>

						<div
							className={`my-1  text-neutral-600 text-sm text-center  drop-shadow-md`}
						>
							{(!product?.category_id || product?.category_id === '') && (
								<SkeletonTheme baseColor='#444' highlightColor='#555'>
									<Skeleton />
								</SkeletonTheme>
							)}
							{product?.category_id &&
								categories[parseInt(product?.category_id) - 1]}
							{!!hasPrice ? (
								<span
									className={`flex-auto ml-1 mt-0.5  tracking-wider text-center`}
								>
									- {formatPrice(product?.price)}
								</span>
							) : (
								<Typography
									className={`flex-auto ml-1 mt-0.5 text-sm`}
								></Typography>
							)}
						</div>

						{/* <div className='flex justify-center items-center'>
							<Fab
								size='small'
								className={` shadow-none text-neutral-900 hover:bg-neutral-200 bg-transparent drop-shadow-md`}
								onClick={handleClick}
							>
								<SlQuestion size={22} />
							</Fab>
							<Popover
								id={id}
								open={open}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
								className=''
							>
								<span className='box-border px-1 py-0.5 drop-shadow-md text-lg text-slate-900'>
									{!!product?.description
										? product?.description
										: 'Açıklama bulunmamaktadır'}
								</span>
							</Popover>
						</div> */}
					</CardContent>
				</CardMedia>

				{displayOnly ? null : (
					<CardActions className={`bg-white`}>
						{product?.is_private ? (
							<span className='ml-1 p-0.5 pt-1 px-1 mr-1 rounded-md bg-gradient-to-tr from-rose-600 to-red-400 font-semibold text-sm tracking-widest text-slate-50 uppercase'>
								ÖZEL ÜRÜN
							</span>
						) : null}

						<span className={`flex-auto`} />

						{!!dashboardTitle && (
							<span className='font-light text-xl text-center'>
								{dashboardTitle}
							</span>
						)}

						{!!fabFunc &&
							(!adminView ? (
								<Fab
									size='small'
									onClick={fabFunc}
									variant='extended'
									className={`shadow-none text-neutral-900 hover:bg-neutral-200 bg-transparent drop-shadow-md`}
								>
									{forCart ? <FiPlus size={24} /> : 'FİYAT TEKLİFİ AL'}
								</Fab>
							) : (
								<>
									<Fab
										size='small'
										onClick={fabFunc}
										className={`shadow-none text-red-600 hover:bg-neutral-200 bg-transparent drop-shadow-md`}
									>
										<FiTrash size={24} />
									</Fab>

									<Fab
										size='small'
										onClick={() => handleDetailRedirect()}
										variant='extended'
										className={`shadow-none text-neutral-900 hover:bg-neutral-200 bg-transparent drop-shadow-md`}
									>
										<FiEdit size={24} />
									</Fab>
								</>
							))}

						{!!handlePriceChange && (
							<Fab
								size='small'
								variant='extended'
								onClick={() =>
									handlePriceChange(
										product?.id ?? product?.product_id,
										selectedDealer
									)
								}
								className={`shadow-none text-orange-600 hover:bg-neutral-200 bg-transparent drop-shadow-md text-sm`}
							>
								FİYATI DEĞİŞTİR
							</Fab>
						)}
					</CardActions>
				)}
			</Card>
		</div>
	);
};

export default Product;
