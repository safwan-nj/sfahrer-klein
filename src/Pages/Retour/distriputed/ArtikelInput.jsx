import * as FaIcons from 'react-icons/fa';

function ArtikelInput({ artNr, artikelNrError, onChange, onKeyDown, disabled }) {
  return (
    <div className="sticky top-0 pr-3 pl-3 pt-2 pb-2 rounded-full sa-bg-main-dark-transparent -mx-6 z-10">
      <div className="flex items-center gap-2 p-1">
        <FaIcons.FaSistrix className="text-white w-6 h-6" />
        <input
          type="text"
          className={`border p-2 flex-grow text-gray-800 bg-white rounded-full ${artikelNrError ? 'border-red-500' : ''}`}
          placeholder="Artikel-Barcodenummer"
          value={artNr}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus
          disabled={disabled}
        />
      </div>
      {artikelNrError && <div className="text-red-500 mt-2">{artikelNrError}</div>}
    </div>
  );
}

export default ArtikelInput;