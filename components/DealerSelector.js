import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const DealerSelector = ({
	title,
	emptyOptionTitle,
	dealers,
	selectedDealer,
	handleDealerChange,
}) => (
	<Box className='min-w-[10vw]'>
		<FormControl fullWidth>
			<InputLabel id={title + 'dealer-select-label'}>{title}</InputLabel>
			<Select
				labelId={title + 'dealer-select-label'}
				id={title + 'dealer-select-select'}
				value={selectedDealer}
				label={title}
				onChange={handleDealerChange}
			>
				<MenuItem value={''}>
					{!!emptyOptionTitle ? emptyOptionTitle : 'Bütün bayiler'}
				</MenuItem>
				{dealers.map((dealer) => (
					<MenuItem key={dealer.id} value={dealer.id}>
						{dealer.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	</Box>
);

export default DealerSelector;
