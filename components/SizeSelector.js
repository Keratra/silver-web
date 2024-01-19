import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SizeSelector = ({ productSize, setProductSize, className }) => (
	<Box className={`place-self-end w-fit py-2 ` + className}>
		<FormControl fullWidth>
			<InputLabel className={`text-black`} id='product-size-label'>
				Size
			</InputLabel>
			<Select
				labelId='product-size-label'
				id='product-size-select'
				value={productSize}
				label='Size'
				onChange={(e) => setProductSize(e.target.value)}
				sx={{
					color: 'black',
					backgroundColor: 'white',
				}}
			>
				<MenuItem value={2}>Small</MenuItem>
				<MenuItem value={3}>Medium</MenuItem>
				<MenuItem value={4}>Large</MenuItem>
			</Select>
		</FormControl>
	</Box>
);

export default SizeSelector;
