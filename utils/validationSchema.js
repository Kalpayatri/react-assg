import * as Yup from 'yup';

export const validationSchema = Yup.object({
  firstname: Yup.string().required('First Name is required').min(5),
  lastname: Yup.string().required('Last Name is required').min(5),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid mobile number format').required('Mobile Number is required'),
  addressOne: Yup.string().required('Address 1 is required'),
  addressTwo: Yup.string(),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  zipcode: Yup.string().matches(/^[0-9]{6}$/, 'Invalid zipcode format').required('Zip Code is required'),
});
