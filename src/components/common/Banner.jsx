

function Banner({ publicImageUrl }) {
    if (!publicImageUrl) {
        return null;
    }

    return (
        <div className='feriante-banner'>
            <img src={publicImageUrl} alt={publicImageUrl} />
        </div>
    );
}


export {
    Banner
};
