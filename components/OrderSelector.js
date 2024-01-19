import {
	Autocomplete,
	createTheme,
	CssBaseline,
	TextField,
	ThemeProvider,
} from '@mui/material';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export const OrderSelector = ({
	orders,
	selectedOrders,
	setSelectedOrders,
}) => (
	<section
		className='
		max-w-4xl mx-auto p-4 mb-1 
		bg-white border-neutral-200
		rounded-sm border-solid border '
	>
		<div className='flex justify-center items-center gap-4 '>
			<Autocomplete
				multiple
				id='order-choose'
				className='flex-grow'
				options={orders.map((elem) => elem.id)}
				getOptionLabel={(option) => 'No ' + option.toString()}
				value={selectedOrders}
				onChange={(e, newValue) => {
					setSelectedOrders(newValue);
				}}
				disabled={orders.length === 0}
				renderInput={(params) => (
					<TextField
						{...params}
						label={
							orders.length !== 0 ? 'Seçili Siparişler' : 'Sipariş Bulunmuyor'
						}
						placeholder='Siparişlerden seçiniz...'
					/>
				)}
			/>
		</div>
	</section>
);
