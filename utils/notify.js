import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

export const notify = (type, message) => {
	toast(message, {
		hideProgressBar: false,
		autoClose: 3000,
		type,
	});
};

notify.propTypes = {
	type: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
};
