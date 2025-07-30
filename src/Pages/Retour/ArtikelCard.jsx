import PropTypes from 'prop-types';
import * as FaIcons from 'react-icons/fa';
import { useState } from 'react';

const ArtikelCard = ({
    index,
    kundeNummer,
    artikelNr,
    bezeichnung,
    artikelHersteller,
    menge,
    grund,
    selectedOption,
    handleDelete,
    kleinQR,
}) => {
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);

    const toggleDeleteVisibility = () => {
        setIsDeleteVisible(!isDeleteVisible);
    };

    return (
        <div
            className="bg-white rounded-lg p-2 shadow-md border flex flex-col gap-2 cursor-pointer"
            onClick={toggleDeleteVisibility}
        >
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Artikel-Nr:</span>
                <span className="text-xs text-gray-600 text-right">{artikelNr}</span>
            </div>
            { kleinQR && (
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Klein Qr-Code:</span>
                <span className="text-xs text-gray-600 text-right">{kleinQR}</span>
            </div>
            )}

            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Bezeichnung:</span>
                <span className="text-xs text-gray-600 text-right">{bezeichnung}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Hersteller:</span>
                <span className="text-xs text-gray-600 text-right">{artikelHersteller}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Menge:</span>
                <span className="text-xs text-gray-600 text-right">{menge}</span>
            </div>
            {grund && (
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Grund:</span>
                <span className="text-xs text-gray-600 text-right">{grund}</span>
            </div>
            )}
            <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sa-text-main-secondary-light ">Option:</span>
                <span className="text-xs text-gray-600 text-right">{selectedOption}</span>
            </div>
            {isDeleteVisible && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // منع النقر على الزر من تفعيل toggleDeleteVisibility
                        handleDelete(index);
                    }}
                    className="bg-pink-600 text-white p-3 py-2 rounded mt-2 self-end text-xs sm:text-sm"
                >
                    <FaIcons.FaTrashAlt className="inline-block" />
                </button>
            )}
        </div>
    );
};

ArtikelCard.propTypes = {
    index: PropTypes.number.isRequired,
    kundeNummer: PropTypes.string,
    artikelNr: PropTypes.string.isRequired,
    bezeichnung: PropTypes.string.isRequired,
    artikelHersteller: PropTypes.string.isRequired,
    menge: PropTypes.string.isRequired,
    grund: PropTypes.string.isRequired,
    selectedOption: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default ArtikelCard;