import * as Yup from 'yup';

export const contactSchema = Yup.object().shape({
	name: Yup.string()
	  .required('Name is required')
	  .min(2, 'Name must be at least 2 characters'),
	surname: Yup.string()
	  .required('Surname is required')
	  .min(2, 'Surname must be at least 2 characters'),
	email: Yup.string()
	  .email('Invalid email address')
	  .required('Email is required'),
	question: Yup.string()
	  .required('Question is required')
	  .min(3, 'Question must be at least 3 characters'),
  });

export const loginModel = {
	initials: {
		email: '',
		password: '',
	},
	schema: Yup.object().shape({
		email: Yup.string()
			.required('Email is required')
			.matches(
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				'Invalid email address'
			),
		password: Yup.string().required('Password is required'),
	}),
};

export const paymentVerifyModel = {
	initials: {
		password: '',
	},
	schema: Yup.object().shape({
		password: Yup.string().required('Password is required'),
	}),
};

export const registerCustomerModel = {
	initials: {
		name: '',
		address: '',
		city: '',
		country: '',
		phone: '',
		email: '',
		password: '',
		confirmPassword: '',
	},
	schema: Yup.object().shape({
		name: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Name is required'),
		address: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Address is required'),
		city: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('City is required'),
					country: Yup.string()
						.max(100, 'Maximum 100 characters')
						.required('Country is required'),
					phone: Yup.string()
						.max(100, 'Maximum 100 characters')
						.required('Phone number is required')
						.matches(
							/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
							'The number you entered is not valid (+90 500 000 0000)'
						),
					email: Yup.string()
						.max(100, 'Maximum 100 characters')
						.required('Email is required')
						.matches(
							/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							'The email you entered is not valid'
						),
					password: Yup.string()
						.min(8, 'Password must be at least 8 characters')
						.max(30, 'Password must be at most 30 characters')
						.matches(
							/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
							'Password must contain at least one uppercase letter, one lowercase letter, and one number'
						)
						.required('Password is required'),
					confirmPassword: Yup.string()
						.oneOf([Yup.ref('password'), null], 'Passwords must match')
						.required('Passwords must match'),
				}),
			};

export const registerProductModel = {
	initials: {
		name: '',
		category: '',
		description: '',
		price: 0,
		image: '',
	},
	schema: Yup.object().shape({
		name: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Name is required'),
		category: Yup.string().required('Category is required'),
		description: Yup.string()
			.max(500, 'Max 500 characters')
			.required('Description is required'),
		price: Yup.number().required('Price is required'),
		image: Yup.string().required('Image is required'),
	}),
};

export const updateImageModel = {
	initials: {
		image: '',
	},
	schema: Yup.object().shape({
		image: Yup.string().required('Image is required'),
	}),
};

export const updateProductModel = {
	initials: {
		name: '',
		category_id: '',
		description: '',
	},
	schema: Yup.object().shape({
		name: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Name is required'),
		category_id: Yup.number().required('Category is required'),
		description: Yup.string()
			.max(500, 'Maximum 500 characters')
			.required('Description is required'),
	}),
};

export const orderModel = {
	initials: {
		description: '',
	},
	schema: Yup.object().shape({
		description: Yup.string().max(
			2000,
			'Maximum 2000 characters'
		),
	}),
};

export const orderPaymentModel = {
	initials: {
		cargo_brand: '',
		card_number: '',
		card_fullname: '',
		card_month: '',
		card_year: '',
		card_cvv: '',
		card_is_save: "0",
	},
	schema: Yup.object().shape({
		cargo_brand: Yup.string()
			.max(200, 'Maximum 200 characters')
			.required('Cargo brand is required'),
		card_number: Yup.string()
			.min(1, 'Minimum 1 character')
			.max(100, 'Maximum 100 characters')
			.required('Card number is required'),
		card_fullname: Yup.string()
			.min(1, 'Minimum 1 character')
			.max(100, 'Maximum 100 characters')
			.required('Card full name is required'),
		card_month: Yup.string()
			.min(1, 'Minimum 1 character')
			.max(2, 'Maximum 2 characters')
			.required('Card month is required'),
		card_year: Yup.string()
			.min(1, 'Minimum 1 character')
			.max(2, 'Maximum 2 characters')
			.required('Card year is required'),
		card_cvv: Yup.string()
			.min(1, 'Minimum 1 character')
			.max(3, 'Maximum 3 characters')
			.required('Card cvv is required'),
		card_is_save: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Card is save is required'),
	}),
};

export const paymentModel = {
	initials: {
		dealer_id: '',
		payment_type: '',
		amount: '',
		description: '',
	},
	schema: Yup.object().shape({
		dealer_id: Yup.number().required('Please select a dealer'),
		payment_type: Yup.string().required('Please select a payment type'),
		amount: Yup.number().required('Amount is required'),
		description: Yup.string()
			.max(2000, 'Maximum 2000 characters')
			.required('Description is required'),
	}),
};

export const dealerProfile = {
	initials: {
		address: '',
		city: '',
		country: '',
		name: '',
		phone: '',
	},
	schema: Yup.object().shape({
		address: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Address is required'),
		city: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('City is required'),
		country: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Country is required'),
		name: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Name is required'),
		phone: Yup.string()
			.max(100, 'Maximum 100 characters')
			.required('Phone number is required')
			.matches(
				/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
				'The number you entered is not valid (+90 500 000 0000)'
			),
	}),
};

export const registerAccountModel = {
	initials: {
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
		name: '',
		surname: '',
		specialId: '',
	},
	schema: Yup.object().shape({
		email: Yup.string()
			.required('Email is required')
			.matches(
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				'Email is required'
			),
		phone: Yup.string().required('Phone number is required'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.max(30, 'Password must be fewer than 30 characters')
			.matches(
				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			)
			.required('Password is required'),
		name: Yup.string().required('Name is required'),
		surname: Yup.string().required('Surname is required'),
		specialId: Yup.string().required('Special ID is required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Passwords must match'),
	}),
};

export const changePasswordModel = {
	initials: {
		old_password: '',
		new_password: '',
		confirmPassword: '',
	},
	schema: Yup.object().shape({
		old_password: Yup.string().required('Old password is required'),
		new_password: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.max(30, 'Password must be fewer than 30 characters')
			.matches(
				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
				'Password must contain at least one lower case letter, one upper case letter, and one number'
			)
			.required('New password is required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('new_password'), null], 'Passwords must match')
			.required('Passwords must match'),
	}),
};

export const forgotPasswordModel = {
	initials: {
		email: '',
	},
	schema: Yup.object().shape({
		email: Yup.string()
			.required('Email is required')
			.matches(
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				'Email is required'
			),
	}),
};

export const resetPasswordModel = {
	initials: {
		password: '',
		confirmPassword: '',
	},
	schema: Yup.object().shape({
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.max(30, 'Password must be fewer than 30 characters')
			.matches(
				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
				'Password must contain at least one lower case letter, one upper case letter, and one number'
			)
			.required('Password is required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Passwords must match'),
	}),
};

export const settingsModel = {
	initials: {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	},
	schema: Yup.object().shape({
		oldPassword: Yup.string().required('Old password is required'),
		newPassword: Yup.string()
			.min(2, 'Password must be at least 8 characters')
			.max(30, 'Password must be fewer than 30 characters')
			// .matches(
			// 	/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
			// 	'Password must contain at least one lower case letter, one upper case letter, and one number'
			// )
			.required('New password is required'),
		confirmPassword: Yup.string()
			.required('Confirm password is required')
			.oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
	}),
};

export const productCartModel = {
	initials: {
		amount: 1,
	},
	schema: Yup.object().shape({
		amount: Yup.number()
			.required('Amount is required')
			.min(1, 'Amount must be at least 1'),
	}),
};
