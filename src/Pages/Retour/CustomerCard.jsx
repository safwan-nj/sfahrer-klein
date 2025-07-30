import PropTypes from 'prop-types'
import * as FaIcons from 'react-icons/fa';
import './CustomerCard.css'

const CustomerCard = ({
    kundeName,
    kundeNummer,
    kundeKontonr,
    kundeMail,
    handleEditKunde
}) => {
    return (
        <div className="sa-bg-main-dark-transparent -mx-6 rounded-lg p-2 mb-2 shadow-md border border-gray-600 relative">
            <div className="text-xs text-left flex items-center gap-2">
                <span className="font-semibold sa-text-main-secondary">Name:</span> 
                <p className='font-semibold'>{kundeName}</p>
            </div>
            <div className="text-xs text-left flex items-center gap-2">
                <span className="font-semibold sa-text-main-secondary">Kunde-Nummer:</span> 
                <p className='font-semibold'>{kundeNummer}</p>
            </div>
            <div className="text-xs text-left flex items-center gap-2">
                <span className="font-semibold sa-text-main-secondary">Kontonummer:</span> 
                <p className='font-semibold'>{kundeKontonr}</p>
            </div>
            <div className="text-xs text-left flex items-center gap-2">
                <span className="font-semibold sa-text-main-secondary">E-Mail:</span> 
                <p className='font-semibold'>{kundeMail}</p>
            </div>
            <button
                onClick={handleEditKunde}
                className="absolute bottom-2 right-2 sa-bg-main-secondary text-white pl-3 pr-2 py-2 rounded text-xs"
            >
                <FaIcons.FaEdit className="inline-block text-lg" />
            </button>
        </div>
    )
}

CustomerCard.propTypes = {
    kundeName: PropTypes.string.isRequired,
    kundeNummer: PropTypes.string.isRequired,
    kundeKontonr: PropTypes.string.isRequired,
    kundeMail: PropTypes.string.isRequired,
    handleEditKunde: PropTypes.func.isRequired,
}

export default CustomerCard