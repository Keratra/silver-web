import { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import NextLink from 'next/link';
import {
	Box,
	Button,
	Card,
	FormControl,
	InputLabel,
	Link,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Formik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';
import { ArrowBack } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { contactSchema } from 'lib/yupmodels';
import { loadState, parseJwt } from 'lib';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";

const ContactPage = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(false);
	
    useEffect(() => {
      const token = loadState('token')?.token;
      if (!token || token === '' || token === 'null' || token === null ) {
        setUser(() => false);
      } else {
        setUser(() => true);
      }
    }, []);

    const handleContactSubmit = async (values, { setSubmitting, resetForm  }) => {
        handleClickOpen();
        try {
          const backendURL = `${process.env.NEXT_PUBLIC_API_URL_DEALER}/dealer/contact`;
          
          const { name, surname, email, question } = values;
    
          let queryValues;
          
          const token = loadState('token')?.token;

          if (
            token === undefined ||
            token === null ||
            token === '' ||
            token === 'null'
          ) {
            queryValues = {
              name: name + " " + surname,
              email,
              description: question,
              id: "",
            };
          } else {
            const { id, user_type } = parseJwt(token)?.sub;

            if (user_type === 'dealer') {
              queryValues = {
                name: name + " " + surname,
                email,
                description: question,
                id,
              };
            } else {
              queryValues = {
                name: name + " " + surname,
                email,
                description: question,
                id: "",
              };
            }
          }

          

          // if user dealer, send dealer ID too
    
          const { data } = await axios.post(
            backendURL, { ...queryValues },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          notify('success', data?.message);
        } catch (error) {
          notify(
            'error',
            error?.response?.data?.message?.message ??
              error?.response?.data?.message ??
              error?.message
          );
        } finally {
          setSubmitting(false);
          resetForm();
        }
    };

      const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

  return (
    <Layout fullWidth>
      <div className='w-full'>
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex justify-between items-center select-none'>
				<h1 className='font-serif font-medium text-lg sm:text-xl md:text-3xl text-gray-800 cursor-default select-none'>
					SILVER
				</h1>
				<nav className='w-full flex justify-end items-center flex-wrap ml-2'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/map' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMap size={24} className='' />Map
							</span>
						</Link>
					</NextLink>

					<NextLink href='/dealer/cart' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiShoppingCart size={24} className='' /> Cart
							</span>
						</Link>
					</NextLink>

					{!!user ? (
						<>

						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						</>
						) : (
						<NextLink href='/dealer/login' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center  gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiLogin size={24} className='' /> Login
								</span>
							</Link>
						</NextLink>
						)}
				</nav>
			</header>
			</div>

    {/* <div className='absolute'>
        <div className='relative top-2 left-2'>
            <NextLink href='/' passHref>
                <a
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                    className=' text-slate-500 drop-shadow-sm hover:text-slate-900 transition-colors'
                >
                    <ArrowBack /> <span className='ml-1 mt-1'>RETURN TO HOMEPAGE</span>
                </a>
            </NextLink>
        </div>
    </div> */}

    <div className="min-h-screen flex items-center justify-center">
    <Card className="p-4 shadow-lg hover:shadow-xl transition-all rounded-md">
      <Formik
        initialValues={{
          name: '',
          surname: '',
          email: '',
          question: '',
        }}
        validationSchema={contactSchema}
        onSubmit={handleContactSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 m-4 min-w-[80vw] md:min-w-[60vw] lg:min-w-[40vw] xl:min-w-[25vw] content-center place-content-center max-w-sm mx-auto px-4"
          >
            <h1 className="font-semibold text-center m-0 -mt-2">
              Contact Us
            </h1>

            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              placeholder="Enter your name..."
              className="bg-neutral-50 rounded-b-lg"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              fullWidth
              id="surname"
              name="surname"
              label="Surname"
              placeholder="Enter your surname..."
              className="bg-neutral-50 rounded-b-lg"
              value={values.surname}
              onChange={handleChange}
              error={touched.surname && Boolean(errors.surname)}
              helperText={touched.surname && errors.surname}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              placeholder="Enter your email..."
              className="bg-neutral-50 rounded-b-lg"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              id="question"
              name="question"
              label="Question"
              multiline
              rows={4}
              placeholder="Type your question here..."
              className="bg-neutral-50 rounded-b-lg"
              value={values.question}
              onChange={handleChange}
              error={touched.question && Boolean(errors.question)}
              helperText={touched.question && errors.question}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              className="bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case"
              disabled={isSubmitting}
            >
              SUBMIT
            </Button>
          </form>
        )}
      </Formik>
    </Card>
    </div>
    <Dialog open={open} onClose={handleClose}>
        <DialogContent className='p-0'>
            <Card className={`p-4 shadow-lg hover:shadow-xl transition-all rounded-md`}>
            <div className="col-span-full p-4 rounded-lg flex flex-col justify-between items-center">
                <h2 className="text-2xl font-bold mb-2 text-center">
                    Your question has been sent to us.
                </h2>
                
                {/* <div className="mb-2 shadow border rounded-full border-solid border-neutral-500" /> */}
                
                <div className="mt-4 w-full text-start">
                    You can return to the homepage by clicking the button residing in the top-left corner of the screen.
                </div>
            </div>
        </Card>
        </DialogContent>
    </Dialog>
    </Layout>
  );
};

export default ContactPage;
