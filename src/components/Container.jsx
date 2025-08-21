const Container = ( { children, className = "" } ) => {
    return (
        <div
            className={ `max-w-[1600px] mx-auto px-4 sm:px-4 lg:px-1 ${ className }` }
        >
            { children }
        </div>
    );
};

export default Container;