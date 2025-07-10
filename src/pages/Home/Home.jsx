import React from 'react'
import Banner from './../../components/home/Banner/Banner';
import FeaturedProducts from './../../components/home/FeaturedProducts/FeaturedProducts';
import TrendingProducts from './../../components/home/TrendingProducts/TrendingProducts';
import CouponSlider from './../../components/home/CouponSlider/CouponSlider';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';
import CommunitySpotlight from '../../components/home/CommunitySpotlight/CommunitySpotlight';

const Home = () => {
    return (
        <div className='w-7xl mx-auto'>
            <Banner />
            <FeaturedProducts />
            <TrendingProducts />
            <CouponSlider />
            <HowItWorks />
            <CommunitySpotlight />
        </div>
    )
}

export default Home
