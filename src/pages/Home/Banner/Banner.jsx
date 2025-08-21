import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { data } from './Data.js';
import BannerSlideContent from './BannerSlideContent';
import './Banner.css';


const Banner = () => {
    return (
        <div className='mt-36 md:mt-14'>
            <Swiper
                spaceBetween={ 30 }
                speed={ 1500 }
                effect={ "fade" }
                fadeEffect={ { crossFade: true } }
                autoplay={ { delay: 6000, disableOnInteraction: false } }
                pagination={ { clickable: true } }
                navigation={ true }
                modules={ [ Autoplay, EffectFade, Navigation, Pagination ] }
                className="mySwiper rounded-lg"
            >
                { data.map( ( slideData ) => (
                    <SwiperSlide
                        key={ slideData.id }
                        style={ { backgroundColor: `${ slideData.colorLite }` } }
                        className="w-full h-screen flex flex-col md:gap-10 gap-4 pt-4 md:pt-8"
                    >
                        <BannerSlideContent { ...slideData } />
                    </SwiperSlide>
                ) ) }
            </Swiper>
        </div>
    );
};

export default Banner;