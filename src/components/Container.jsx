const Container = ( { children, className = "" } ) => {
    return (
        <div
            className={ `max-w-[1600px] px-4 sm:px-3 lg:px-1 ${ className }` }
        >
            { children }
        </div>
    );
};

export default Container;