import React, { useEffect } from 'react'
import Banner from './../Banner/Banner';
import FeaturedProducts from './../FeaturedProducts/FeaturedProducts';
import TrendingProducts from './../TrendingProducts/TrendingProducts';
import CouponSlider from './../CouponSection/CouponSlider';
import HowItWorks from './../HowItWorks/HowItWorks';
import CommunitySpotlight from './../CommunitySpotlight/CommunitySpotlight';
import { Link } from 'react-router';

const Home = () => {

    useEffect( () => {
        document.title = 'Home || AppOrbit';
    }, [] );

    return (
        <div className='w-full px-4 xl:max-w-7xl xl:mx-auto'>
            <Banner />
            <FeaturedProducts />
            <TrendingProducts />
            <CouponSlider />
            <div className="text-center my-10">
                <Link to="/products" className="btn btn-lg btn-primary hover:bg-white hover:text-black">Show All Products</Link>
            </div>
            <HowItWorks />
            <CommunitySpotlight />
        </div>
    )
}

export default Home
