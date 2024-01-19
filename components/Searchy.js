import {
	Button,
	Fab,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { Formik } from 'formik';
import { FiSearch } from 'react-icons/fi';

function Searchy({
	forOrders,
	value,
	handleSearchChange,
	onSearchSubmit,
	searchType,
	handleSearchTypeChange,
	className,
}) {
	return (
		<div className={' ' + className}>
			<Formik
				initialValues={{ search: value, search_type: 1 }}
				onSubmit={({ search, search_type }, { setSubmitting }) => {
					onSearchSubmit(search);
					setSubmitting(false);
				}}
			>
				{({
					setFieldValue,
					values,
					errors,
					touched,
					handleChange,
					handleSubmit,
					isSubmitting,
				}) => (
					<form
						onSubmit={handleSubmit}
						className={`flex justify-between items-center gap-2 `}
					>
						<TextField
							id='search'
							name='searchy'
							label='Search'
							placeholder='Enter here...'
							fullWidth
							className={'col-span-1 bg-white rounded-b-lg '}
							value={values.search}
							onChange={(e) => {
								setFieldValue('search', e.target.value);
								handleSearchChange(e);
							}}
							error={touched.search && Boolean(errors.search)}
							helperText={touched.search && errors.search}
							autoComplete='new-password'
						/>

						{!!forOrders && (
							<FormControl fullWidth className='col-span-1 max-w-[10rem]'>
								<InputLabel id={'search_type_label'} className={``}>
									Sipariş Arama Türü
								</InputLabel>
								<Select
									id='search_type'
									name='search_type'
									label='Sipariş Arama Türü'
									labelId='search_type_label'
									className='bg-neutral-50'
									fullWidth
									value={searchType}
									onChange={(e) => {
										setFieldValue('search_type', e.target.value);
										handleSearchTypeChange(e);
									}}
									error={touched.search_type && Boolean(errors.search_type)}
								>
									{[
										{ id: 1, name: 'Ürün Adı', value: true },
										{ id: 2, name: 'Sipariş No', value: false },
									].map(({ id, name, value }) => (
										<MenuItem key={id} value={value}>
											{name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}

						<button
							size='large'
							type='submit'
							className={`border-none bg-transparent hover:bg-transparent shadow-none hover:opacity-50 transition-opacity`}
							disabled={isSubmitting}
						>
							<FiSearch size={28} className='text-slate-800 cursor-pointer' />
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
}

export default Searchy;
