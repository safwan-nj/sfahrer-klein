import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from "react";

const CustomerPopup = ({
    kundeNummer,
    kundeName,
    kundeKontonr,
    kundeMail,
    handleKundeInputChange,
    handleKundeNummerSubmit
}) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [emailError, setEmailError] = useState("");
    const popupRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const newKeyboardHeight = window.innerHeight - window.visualViewport.height;
                setKeyboardHeight(newKeyboardHeight > 0 ? newKeyboardHeight : 0);
            }
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
        };
    }, []);

    // دالة للتحقق من صحة البريد الإلكتروني
    const validateEmail = (email) => {
        if (!email) {
            setEmailError("E-Mail erforderlich");
            return false;
        }

        // Regex to validate email format with at least 2 characters before @
        const emailPattern = /^[^\s@]{2,30}@[^\s@]+\.[a-zA-Z]{2,}$/;
        
        // Check local part length (before @)
        const localPart = email.split('@')[0];
        if (localPart.length < 2) {
            setEmailError("Mindestens 2 Zeichen vor dem @ erforderlich");
            return false;
        }
        if (localPart.length > 30) {
            setEmailError(`Maximal 30 Zeichen vor dem @ erlaubt. ( ${localPart.length} ) eingegeben.`);
            return false;
        }

        // Check domain part (after last dot)
        const domainParts = email.split('.');
        const lastPart = domainParts[domainParts.length - 1];
        if (lastPart.length < 2) {
            setEmailError("Mindestens 2 Zeichen nach dem letzten Punkt erforderlich");
            return false;
        }

        // Check general email format
        if (!emailPattern.test(email)) {
            setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
            return false;
        }

        setEmailError("");
        return true;
    };

    // التعامل مع إرسال النموذج
    const handleSubmit = (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        if (validateEmail(kundeMail)) {
            handleKundeNummerSubmit(); // استدعاء دالة التأكيد
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center sa-bg-main-light-transparent bg-opacity-75 z-50"
            style={{
                transform: `translateY(-${keyboardHeight}px)`,
                transition: "transform 0.3s ease",
            }}
            ref={popupRef}
        >
            <div className="sa-bg-main-dark-transparent dark p-6 rounded shadow-lg w-full max-w-md text-white">
                <h2 className="text-lg font-bold mb-4 text-center text-white">Kundeninformationen bearbeiten</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="kundeNummer"
                            className="block text-gray-200 text-xs font-medium mb-1"
                        >
                            Kunde-Nummer
                        </label>
                        <input
                            type="text"
                            id="kundeNummer"
                            name="kundeNummer"
                            value={kundeNummer}
                            onChange={handleKundeInputChange}
                            className="rounded-md border p-2 w-full sa-bg-main-light text-gray-700 font-semibold"
                            placeholder="Kunde-Nummer"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="kundeName"
                            className="block text-gray-200 text-xs font-medium mb-1"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="kundeName"
                            name="kundeName"
                            value={kundeName}
                            onChange={handleKundeInputChange}
                            className="rounded-md border p-2 w-full sa-bg-main-light text-gray-700 font-semibold"
                            placeholder="Name"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="kundeKontonr"
                            className="block text-gray-200 text-xs font-medium mb-1"
                        >
                            Kontonummer
                        </label>
                        <input
                            type="text"
                            id="kundeKontonr"
                            name="kundeKontonr"
                            value={kundeKontonr}
                            onChange={handleKundeInputChange}
                            className="rounded-md border p-2 w-full sa-bg-main-light text-gray-700 font-semibold"
                            placeholder="Kontonummer"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="kundeMail"
                            className="block text-gray-200 text-xs font-medium mb-1"
                        >
                            E-Mail
                        </label>
                        <input
                            type="email"
                            id="kundeMail"
                            name="kundeMail"
                            value={kundeMail}
                            onChange={handleKundeInputChange}
                            className={`rounded-md border p-2 w-full sa-bg-main-light text-gray-700 font-semibold ${
                                emailError ? "border-pink-500 border-2" : ""
                            }`}
                            placeholder="E-Mail (max: 30 Zeichen bevor @)"
                            required
                        />
                        {emailError && (
                            <p className="text-pink-700 text-xs mt-1">{emailError}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="sa-bg-main-secondary text-white px-4 py-2 mt-4 rounded-full w-full"
                    >
                        Bestätigen
                    </button>
                </form>
            </div>
        </div>
    );
};

CustomerPopup.propTypes = {
    kundeNummer: PropTypes.string.isRequired,
    kundeName: PropTypes.string.isRequired,
    kundeKontonr: PropTypes.string.isRequired,
    kundeMail: PropTypes.string.isRequired,
    handleKundeInputChange: PropTypes.func.isRequired,
    handleKundeNummerSubmit: PropTypes.func.isRequired,
};

export default CustomerPopup;