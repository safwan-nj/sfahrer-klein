import { ButtonPrimary } from './ButtonPrimary';
import * as FaIcons from 'react-icons/fa';
import { useRetour } from '../hooks/useRetour';
import ArtikelInput from './ArtikelInput';
import EntryList from './EntryList';
import AddEntryPopup from './AddEntryPopup';
import KundeNummerPopup from './KundeNummerPopup';

function Retour() {
    const {
        isPopupOpen, entries, showSuccess, artNr, artikelNrError, kundeNummer, isKundePopupOpen,
        handleKundeNummerSubmit, handleArtikelNrInput, handleArtikelNrKeyDown, handleSave
    } = useRetour();

    return (
        <div className="app-container text-white relative">
        <div className={`sa-bg-main-dark-transparent rounded-lg card-list-container pr-12 pl-12 pt-6 ${isKundePopupOpen ? 'pointer-events-none opacity-50' : ''}`}>
            <h3 className="text-center text-yellow-500 font-bold mb-2">Artikel zurückgeben | Kunde: {kundeNummer}</h3>
            <ArtikelInput 
            artNr={artNr} 
            artikelNrError={artikelNrError} 
            onChange={handleArtikelNrInput} 
            onKeyDown={handleArtikelNrKeyDown} 
            disabled={isKundePopupOpen} 
            />
            <EntryList entries={entries} onSave={handleSave} />
            {showSuccess && <div className="text-green-500 mt-4">Data saved successfully!</div>}
            {isPopupOpen && <AddEntryPopup />}
        </div>
        {isKundePopupOpen && <KundeNummerPopup onSubmit={handleKundeNummerSubmit} />}
        </div>
    );
}

export default Retour;