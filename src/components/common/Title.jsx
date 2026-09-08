import PropTypes from 'prop-types';


function Title({ title, subtitle }) {
    // Render
    var titleElement = null;
    if (title) {
        titleElement = <h4 className='h4'>{title}</h4>;
    }

    var subtitleElement = null;
    if (subtitle) {
        subtitleElement = <div color='secondary'>{subtitle}</div>;
    }

    return (
        <div className='text-center my-4'>
            {titleElement}
            {subtitleElement}
        </div>
    );
}

Title.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
};


export default Title;
