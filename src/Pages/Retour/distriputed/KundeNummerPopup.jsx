import { useRetour } from '../hooks/useRetour';

function KundeNummerPopup({ onSubmit }) {
    const { kundeNummer, setKundeNummer } = useRetour();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div className="bg-gray-800 p-6 rounded shadow-lg w-96 text-white">
            <h2 className="text-lg font-bold mb-4 text-center">Kunde-Nummer eingeben</h2>
            <input
            type="text"
            value={kundeNummer}
            onChange={(e) => setKundeNummer(e.target.value)}
            className="rounded-md border p-2 w-full mb-4 bg-gray-700"
            placeholder="Kunde-Nummer"
            autoFocus
            />
            <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Bestätigen
            </button>
        </div>
        </div>
    );
}

export default KundeNummerPopup;