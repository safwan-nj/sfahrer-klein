
import PropTypes from 'prop-types';

const CustomerOptionsLine = ({title, detail}) => {
    return (
        <div className="flex-row justify-between p-2 m-2 border border-pink-200 rounded-md sa-bg-main-dark-transparent">
            <div className="flex-1 w-48 rounded-lg mx-auto">
                <p className="text-center sa-text-main-secondary text-sm mb-1 font-bold">{title}</p>
            </div>
            <p className="text-center sa-text-main-dark text-xs font-bold">{detail}</p>
        </div>

    )
}

CustomerOptionsLine.propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string
};

export default CustomerOptionsLine