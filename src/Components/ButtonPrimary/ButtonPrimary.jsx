import PropTypes from 'prop-types';

const ButtonPrimary = ({ title, onPress, className, specClass, tcolor }) => {
    return (
        <div className="w-full mb-3 mx-2 py-3">
            <button 
                type="submit" 
                onClick={onPress}
                className={specClass ? specClass : `${className && className} w-[94%] rounded-full sa-bg-main-secondary py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
                    <p className={tcolor}>{title}</p>
            </button>
        </div>
    );
};

ButtonPrimary.propTypes = {
    onPress: PropTypes.func,
    className: PropTypes.string,
    specClass: PropTypes.string,
    title: PropTypes.string,
    tcolor: PropTypes.string,
};

export default ButtonPrimary;