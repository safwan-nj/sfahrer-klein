import { useRetour } from '../hooks/useRetour';

function AddEntryPopup() {
    const {
        formData, errors, showErrors, grundOptions, maxMenge, handleInputChange, handleRadioChange,
        handleAddEntry, setIsPopupOpen, setErrors, setShowErrors, handleIncrement, handleDecrement
    } = useRetour();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-gray-800 p-6 rounded shadow-lg w-96 text-white">
            <h2 className="text-lg font-bold mb-10 p-2 rounded-md w-full text-center bg-gray-900">Artikel hinzufügen</h2>
            {showErrors && Object.keys(errors).length > 0 && (
            <div className="text-red-500 mb-2">Bitte füllen Sie alle erforderlichen Felder aus.</div>
            )}
            <input
            type="text"
            name="artikelNr"
            value={formData.artikelNr}
            className={`rounded-md border p-2 w-full mb-4 bg-gray-700 ${errors.artikelNr && showErrors ? 'border-red-500' : ''}`}
            placeholder="Artikel-Nr"
            readOnly
            />
            <input
            type="text"
            name="bezeichnung"
            value={formData.bezeichnung}
            className={`rounded-md border p-2 w-full mb-4 bg-gray-700 ${errors.bezeichnung && showErrors ? 'border-red-500' : ''}`}
            placeholder="Artikel Bezeichnung"
            readOnly
            />
            <div className="flex items-center mb-4">
            <button
                onClick={handleDecrement}
                disabled={(parseInt(formData.menge) || 1) <= 1}
                className={`text-2xl font-bold w-12 h-12 rounded-l-md flex items-center justify-center ${((parseInt(formData.menge) || 1) <= 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500')} text-white`}
            >
                -
            </button>
            <input
                type="number"
                name="menge"
                value={formData.menge}
                onChange={handleInputChange}
                className={`rounded-none border-t border-b p-2 w-full bg-gray-700 text-center ${errors.menge && showErrors ? 'border-red-500' : ''}`}
                placeholder="Menge"
            />
            <button
                onClick={handleIncrement}
                disabled={(parseInt(formData.menge) || 1) >= maxMenge}
                className={`text-2xl font-bold w-12 h-12 rounded-r-md flex items-center justify-center ${((parseInt(formData.menge) || 1) >= maxMenge ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500')} text-white`}
            >
                +
            </button>
            </div>
            <select
            name="grund"
            value={formData.grund}
            onChange={handleInputChange}
            className={`rounded-md border p-2 w-full mb-4 bg-gray-700 ${errors.grund && showErrors ? 'border-red-500' : ''}`}
            >
            <option value="">Bitte wählen Sie einen Grund</option>
            {grundOptions.map((option) => (
                <option key={option.dd_grund_index} value={option.dd_grund_text}>
                {option.dd_grund_text}
                </option>
            ))}
            </select>
            <div className="flex justify-between gap-4 mb-14">
            {errors.selectedOption && showErrors && <div className="text-red-500 text-sm mb-2">*</div>}
            <label className="flex items-center cursor-pointer bg-gray-700 rounded-md p-3 w-full hover:bg-gray-600 transition-all">
                <input
                type="radio"
                value="Alt"
                name="selectedOption"
                checked={formData.selectedOption === "Alt"}
                onChange={handleRadioChange}
                className="mr-3 w-6 h-6 text-blue-500"
                />
                <span className="text-lg">Alt</span>
            </label>
            <label className="flex items-center cursor-pointer bg-gray-700 rounded-md p-3 w-full hover:bg-gray-600 transition-all">
                <input
                type="radio"
                value="Neu"
                name="selectedOption"
                checked={formData.selectedOption === "Neu"}
                onChange={handleRadioChange}
                className="mr-3 w-6 h-6 text-blue-500"
                />
                <span className="text-lg">Neu</span>
            </label>
            </div>
            <div className="flex justify-end gap-2">
            <button
                onClick={() => { setIsPopupOpen(false); setErrors({}); setShowErrors(false); }}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
                ❌
            </button>
            <button onClick={handleAddEntry} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                ✅
            </button>
            </div>
        </div>
        </div>
    );
}

export default AddEntryPopup;