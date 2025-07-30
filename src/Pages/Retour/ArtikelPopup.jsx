import PropTypes from 'prop-types'

const ArtikelPopup = ({
    showErrors,
    errors,
    formData,
    grundOptions,
    maxMenge,
    artikelAltteilAvailable,
    handleInputChange,
    handleRadioChange,
    handleIncrement,
    handleDecrement,
    handleAddEntry,
    setIsPopupOpen,
    setShowErrors,
    setErrors
}) => {
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center sa-bg-main-light-transparent bg-opacity-75 z-50"
        >
            <div className="sa-bg-main-dark-transparent dark p-6 rounded shadow-lg w-full max-w-md text-white">
                <h2 className="text-lg font-bold mb-4 text-center text-white">Artikel hinzufügen</h2>
                {showErrors && Object.keys(errors).length > 0 && (
                    <p className="text-white text-sm mb-2 bg-pink-500 rounded-lg p-3">Bitte füllen Sie alle erforderlichen Felder aus!</p>
                )}
                {/* <div className="mb-4">
                    <label 
                        htmlFor="kleinQR" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                    >
                        Klein-QR
                    </label>
                    <input
                        type="text"
                        id="kleinQR"
                        name="kleinQR"
                        value={formData.kleinQR || ""}
                        onChange={handleInputChange}
                        className={`rounded-md border p-2 w-full bg-white text-gray-700 ${errors.kleinQR && showErrors ? 'border-red-500' : ''}`}
                        placeholder="Klein-QR Code"
                    />
                </div> */}
                <div className="mb-4">
                    <label 
                        htmlFor="kundeNummer" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                    >
                        Artikel-Nr
                    </label>
                    <input
                    type="text"
                    id="artikelNr"
                    name="artikelNr"
                    value={formData.artikelNr || formData.bezeichnung}
                    className={`rounded-md border p-2 w-full bg-white text-gray-700 ${errors.artikelNr && showErrors ? 'border-red-500' : ''}`}
                    placeholder="Artikel-Nr"
                    readOnly
                    />
                </div>
                <div className="mb-4">
                    <label 
                        htmlFor="kundeNummer" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                    >
                        Bezeichnung
                    </label>
                    <input
                    type="text"
                    id="bezeichnung"
                    name="bezeichnung"
                    value={formData.bezeichnung}
                    className={`rounded-md border p-2 w-full bg-white text-gray-700 ${errors.bezeichnung && showErrors ? 'border-red-500' : ''}`}
                    placeholder="Artikel Bezeichnung"
                    readOnly
                    />
                </div>
                <div className="mb-4">
                    <label 
                        htmlFor="kundeNummer" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                    >
                        Hersteller
                    </label>
                    <input
                    type="text"
                    id="artikelHersteller"
                    name="artikelHersteller"
                    value={formData.artikelHersteller}
                    className={`rounded-md border p-2 w-full bg-white text-gray-700`}
                    placeholder="Artikel Hersteller"
                    readOnly
                    />
                </div>
                
                <div className="mb-4">
                    <label 
                        htmlFor="kundeNummer" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                    >
                        Menge
                    </label>
                    <div className="flex items-center">
                        <button
                            onClick={handleDecrement}
                            disabled={(parseInt(formData.menge) || 1) <= 1}
                            className={`text-2xl font-bold w-12 h-12 rounded-l-md flex items-center justify-center ${
                            (parseInt(formData.menge) || 1) <= 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'
                            } text-white`}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            id="menge"
                            name="menge"
                            value={formData.menge}
                            onChange={handleInputChange}
                            className={`rounded-none border-t border-b p-2 w-full bg-white text-gray-700 text-center ${errors.menge && showErrors ? 'border-red-500' : ''}`}
                            placeholder="Menge"
                        />
                        <button
                            onClick={handleIncrement}
                            disabled={(parseInt(formData.menge) || 1) >= maxMenge}
                            className={`text-2xl font-bold w-12 h-12 rounded-r-md flex items-center justify-center ${
                            (parseInt(formData.menge) || 1) >= maxMenge ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'
                            } text-white`}
                        >
                            +
                        </button>
                    </div>
                </div>
                {artikelAltteilAvailable !== 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-200 text-xs font-medium mb-1">Option</label>
                        <div className="flex justify-between gap-4">
                            {errors.selectedOption && showErrors && (
                            <p className="text-pink-500 bg-pink-500 rounded-lg p-1 text-lg">*</p>
                            )}
                            <label 
                                className="flex items-center cursor-pointer sa-bg-transparent rounded-md p-2 w-full hover:bg-gray-700 transition-all"
                            >
                            <input
                                type="radio"
                                value="Alt"
                                name="selectedOption"
                                checked={formData.selectedOption === "Alt"}
                                onChange={handleRadioChange}
                                className="mr-3 w-6 h-6 accent-pink-500" // استخدام accent-pink-500 لتغيير لون التحديد إلى الوردي
                            />
                            <span className="text-lg text-white">Alt</span>
                            </label>
                            <label className="flex items-center cursor-pointer sa-bg-transparent rounded-md p-2 w-full hover:bg-gray-700 transition-all">
                            <input
                                type="radio"
                                value="Neu"
                                name="selectedOption"
                                checked={formData.selectedOption === "Neu"}
                                onChange={handleRadioChange}
                                className="mr-3 w-6 h-6 accent-pink-500" // استخدام accent-pink-500 لتغيير لون التحديد إلى الوردي
                            />
                            <span className="text-lg text-white">Neu</span>
                            </label>
                        </div>
                    </div>
                )}
                {(formData.selectedOption === "Neu" || artikelAltteilAvailable === 0) && (
                    <div className="mb-4">
                        <label 
                        htmlFor="kundeNummer" 
                        className="block text-gray-200 text-xs font-medium mb-1"
                        >
                            Grund
                        </label>
                        <select
                            id="grund"
                            name="grund"
                            value={formData.grund}
                            onChange={handleInputChange}
                            className={`rounded-md border p-2 w-full bg-white text-gray-700 ${errors.grund && showErrors ? 'border-pink-500 border-4' : ''}`}
                        >
                            <option value="">Bitte wählen Sie einen Grund</option>
                            {grundOptions.map((option) => (
                            <option key={option.dd_grund_index} value={option.dd_grund_text}>
                                {option.dd_grund_text}
                            </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button
                    onClick={() => { setIsPopupOpen(false); setErrors({}); setShowErrors(false); }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-full w-full mt-5"
                    >
                    Stornieren
                    </button>
                    <button
                    onClick={handleAddEntry}
                    className="sa-bg-main-secondary text-white px-4 py-2 rounded-full w-full mt-5"
                    >
                    OK
                    </button>
                </div>
            </div>
        </div>
    )
}

ArtikelPopup.propTypes = {
    showErrors: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleIncrement: PropTypes.func.isRequired,
    handleDecrement: PropTypes.func.isRequired,
    handleRadioChange: PropTypes.func.isRequired,
    handleAddEntry: PropTypes.func.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    setShowErrors: PropTypes.func.isRequired,
    maxMenge: PropTypes.string.isRequired,
    artikelAltteilAvailable: PropTypes.number.isRequired,
    grundOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    setErrors: PropTypes.func.isRequired,
};

export default ArtikelPopup