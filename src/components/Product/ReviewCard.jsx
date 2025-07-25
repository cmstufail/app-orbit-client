import { FaStar } from 'react-icons/fa';

const ReviewCard = ( { review } ) => {
    const { userName, userPhoto, rating, comment, date } = review;

    return (
        <div className="bg-base-200 rounded-xl shadow-md p-5">
            <div className="flex items-center mb-3">
                <img
                    src={ userPhoto || 'https://i.ibb.co/2d8N2rF/default-avatar.png' }
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                    <h4 className="text-lg font-semibold">{ userName || 'Anonymous' }</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ new Date( date ).toLocaleDateString() }</p>
                </div>
            </div>

            <div className="flex items-center mb-2">
                { [ ...Array( 5 ) ].map( ( _, index ) => (
                    <FaStar
                        key={ index }
                        className={ `text-yellow-400 ${ index < rating ? '' : 'opacity-30' }` }
                    />
                ) ) }
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">({ rating })</span>
            </div>

            <p className="text-gray-700 dark:text-gray-200">{ comment }</p>
        </div>
    );
};

export default ReviewCard;
