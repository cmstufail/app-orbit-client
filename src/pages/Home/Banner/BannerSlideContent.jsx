import { useNavigate } from 'react-router-dom';

import Button from './../../../components/Shared/Button';


const BannerSlideContent = ( { colorDeep, mainText, shadow, mobileShadow, subText, img, buttonText, path } ) => {

    const navigate = useNavigate();

    return (
        <main className="flex h-full lg:flex-row lg:items-center flex-col items-start px-4 z-10 relative overflow-hidden md:px-16">
            <div className="flex flex-col gap-4 lg:w-1/2 justify-center lg:items-start lg:text-left w-full items-center text-center mb-5 md:mb-0">
                <h1 className="md:text-5xl text-4xl mx-auto lg:mx-0 font-bold leading-tight text-navy">
                    <span style={ { color: `${ colorDeep }` } }>{ mainText }!</span>
                </h1>
                <p className="leading-normal md:text-xl text-lg text-black">{ subText }</p>
                <div className='mt-8 md:w-2/5 lg:w-1/2 2xl:w-2/5'>
                    <Button
                        type='button'
                        text={ buttonText }
                        className='text-xl font-bold py-4 px-4 focus:outline-none w-full'
                        style={
                            window.innerWidth > 767
                                ? { backgroundColor: `${ colorDeep }`, boxShadow: `${ shadow }` }
                                : { backgroundColor: `${ colorDeep }`, boxShadow: `${ mobileShadow }` }
                        }
                        onClick={ () => navigate( path ) }
                    />
                </div>
            </div>

            <div className="lg:w-3/5 w-full lg:-mt-6 relative">
                <img
                    src={ img }
                    loading="eager"
                    alt={ `${ mainText } themed product` }
                    className="w-3/5 mx-auto"
                    width="500"
                    height="300"
                />
            </div>
        </main>
    );
};

export default BannerSlideContent;