import { ButtonPrimary } from './ButtonPrimary';
import { useRetour } from '../hooks/useRetour';

function EntryList({ entries, onSave }) {
    const { handleDelete } = useRetour();

    return entries.length > 0 ? (
        <>
        <div className="mt-4 space-y-4">
            {entries.map((entry, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-500 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Kunde-Nummer:</span>
                <span className="text-xs sm:text-sm">{entry.kundeNummer}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Artikel-Nr:</span>
                <span className="text-xs sm:text-sm">{entry.artikelNr}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Bezeichnung:</span>
                <span className="text-xs sm:text-sm">{entry.bezeichnung}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Menge:</span>
                <span className="text-xs sm:text-sm">{entry.menge}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Grund:</span>
                <span className="text-xs sm:text-sm">{entry.grund}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-xs sm:text-sm">Option:</span>
                <span className="text-xs sm:text-sm">{entry.selectedOption}</span>
                </div>
                <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2 self-end text-xs sm:text-sm"
                >
                Artikel löschen
                </button>
            </div>
            ))}
        </div>
        <ButtonPrimary className="w-full mt-4" onPress={onSave} title="Speichern" />
        </>
    ) : null;
}

export default EntryList;