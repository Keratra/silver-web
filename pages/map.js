import { useState, useEffect } from 'react';
import country_cities from 'public/static/country_cities.json';
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
import { loadState, parseJwt } from 'lib';
import { HiMailOpen, HiShoppingCart, HiUserCircle, HiMap, HiLogin, HiViewGrid } from "react-icons/hi";


export default function MapPage () {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(false);
	
  useEffect(() => {
      const token = loadState('token')?.token;
      if (!token || token === '' || token === 'null' || token === null ) {
          setUser(() => false);
      } else {
        setUser(() => true);
        if (parseJwt(token)?.sub?.user_type === 'admin') {
            setUser(() => "admin");
        }
    }
  }, []);

  const handleCityChange = async () => {
    console.log(weatherData)
    if (selectedCity === "None*") return;
    if (!selectedCity) return;
    if (!selectedCountry) return;

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
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
			<header className=' w-full bg-white border-0 border-b border-solid border-neutral-300 py-2 px-4 flex flex-col sm:flex-row justify-between items-center select-none'>
                <NextLink href='/' passHref>
                <Link className='no-underline'>
                <h1 className='font-serif font-medium text-xl md:text-3xl text-gray-800 cursor-default select-none'>
                    SILVER
                </h1>
                </Link>
                </NextLink>
				<nav className='w-full flex justify-center sm:justify-end items-center flex-wrap ml-2'>
					<NextLink href='/' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiViewGrid size={24} className='' /> Home
							</span>
						</Link>
					</NextLink>

					<NextLink href='/contact' passHref>
						<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
							<span className='flex items-center gap-x-2 text-xs sm:text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
								<HiMailOpen size={24} className='' />Contact
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

					{!!user ? ( user === "admin" ? (
						<NextLink href='/admin/settings' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
							) : (
						<NextLink href='/dealer/profile' passHref>
							<Link className='mx-1 md:mx-3 p-1 text-black no-underline  rounded-none transition-colors'>
								<span className='flex items-center gap-x-2 text-sm md:text-lg tracking-wider bg-none hover:bg-white hover:shadow-md shadow-white md:p-1 lg:p-2 opacity-80 hover:rounded-md transition-all'>
									<HiUserCircle size={24} className='' /> Profile
								</span>
							</Link>
						</NextLink>
						)) : (
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

        <section className='h-[100vh] flex flex-col justify-center items-center mx-1'>
            <Card className={`p-2 sm:p-4 shadow-lg hover:shadow-xl transition-all rounded-md`}>
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
                Get Current Weather
            </h2>
                <div className={`grid grid-cols-1 gap-4 m-4 min-w-[80vw] md:min-w-[60vw] lg:min-w-[40vw] xl:min-w-[25vw] content-center place-content-center max-w-sm mx-auto px-4`}>
                    <div className={`grid grid-cols-1 gap-4 m-4 w-full content-center place-content-center max-w-sm mx-auto`}>
                        
                        <FormControl fullWidth>
                            <InputLabel id={'country_label'} className={``}>
                                Country
                            </InputLabel>
                            <Select
                                id='country'
                                name='country'
                                label='Country'
                                labelId='country_label'
                                className='bg-neutral-50'
                                fullWidth
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                disabled={Object.keys(country_cities)?.length === 0}
                            >
                                {Object.keys(country_cities)?.map((name, index) => (
                                    <MenuItem key={index} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id={'city_label'} className={``}>
                                City
                            </InputLabel>
                            <Select
                                id='city'
                                name='city'
                                label='City'
                                labelId='city_label'
                                placeholder='Select your city...'
                                className='bg-neutral-50'
                                fullWidth
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={country_cities[selectedCountry]?.length === 0}
                            >
                                {country_cities[selectedCountry]?.map((name, index) => (
                                    <MenuItem key={index} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            type='button'
                            className={`mt-2 bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
                            onClick={() => {
                                handleCityChange();
                                handleClickOpen();
                            }}
                        >Get Weather</Button>
                    </div>

                    
                </div>
            </Card>
            
        </section>
        
        
        <Dialog open={open} onClose={handleClose}>
            <DialogContent className='p-0'>
            {weatherData?.location ? (
            <Card className={`p-4 shadow-lg hover:shadow-xl transition-all`}>
                <div className="col-span-full p-4 rounded-lg flex flex-col justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2">
                    Weather for {weatherData?.location?.name ?? 'N/A'} / {weatherData?.location?.country ?? 'N/A'}
                    </h2>
                    
                    {/* <div className="mb-2 shadow border rounded-full border-solid border-neutral-500" /> */}
                    
                    
                    <div className="mt-4 flex justify-center items-center gap-4 text-center w-full text-5xl font-medium">
                        <img
                            src={`https:${weatherData?.current?.condition?.icon}`}
                            alt="Weather Icon"
                            className="w-16 h-16 drop-shadow-sm" 
                        />
                        {weatherData?.current?.temp_c ?? 'N/A'} °C
                    </div>
                    
                    <div className="mt-4 w-full text-center">
                        <span className="ml-2 text-3xl font-normal">{weatherData?.current?.condition?.text ?? 'N/A'}</span>
                    </div>
                </div>
            </Card>
            ) : (
                <Card className={`mt-4 p-4 shadow-lg hover:shadow-xl transition-all rounded-md`}>
                <div className="col-span-full p-4 rounded-lg flex flex-col justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2">
                        An error occured. Please try again.
                    </h2>
                    
                    {/* <div className="mb-2 shadow border rounded-full border-solid border-neutral-500" /> */}
                    
                    {/* <div className="mt-4 w-full text-center">
                        asd
                    </div> */}
                </div>
            </Card>
            )}
            </DialogContent>
        </Dialog>
    </Layout>
  );
};
