export const isAdmin = ( role ) => role === 'admin';
export const isModerator = ( role ) => role === 'moderator';
export const isUser = ( role ) => role === 'user';


export const shortenName = ( name, length = 10 ) => {
    if ( !name ) return '';
    return name.length > length ? name.slice( 0, length ) + '...' : name;
};

export const formatDate = ( dateStr ) => {
    const date = new Date( dateStr );
    return date.toLocaleDateString( 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    } );
};

export const calculateDiscountPrice = ( price, discount ) => {
    if ( !discount ) return price;
    return price - price * ( discount / 100 );
};
