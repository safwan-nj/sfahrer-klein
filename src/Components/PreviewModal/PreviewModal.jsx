import PropTypes from 'prop-types';

const PreviewModal = ({ groupedItemsScanned, removeItemFromInvoiceData, isPressed, toggleIsPressed }) => {
  return (
    <div className="flex flex-col h-full">
      {/* المحتوى القابل للتمرير */}
      <div className="flex-1 overflow-y-auto pb-20">
        {Object.entries(groupedItemsScanned).reverse().map(([key, items], index) => (
          <div key={key} className={`w-full ${index !== 0 ? 'mt-4' : ''}`}>
            <div onClick={() => toggleIsPressed(key)}>
              <div className="flex flex-row justify-between items-center bg-white px-5 py-4 space-x-3 rounded-t-lg">
                <div className="flex flex-row items-center space-x-1">
                  {/* <img
                    src="https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png"
                    alt="item-img"
                    className="w-8 h-8 rounded-full"
                  /> */}
                  <div className="flex flex-col">
                    <span className="text-[#e50075] text-sm font-bold">{items[0].name1}</span>
                    <span className="text-[#141933] text-xs font-semibold">{items[0].name2}</span>
                    <span className="text-gray-500 text-xs">
                      {" " + items[0].strasse + " ,\n" + items[0].plz + " " + items[0].ort}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center space-x-3 whitespace-nowrap"> {/* أضفت whitespace-nowrap */}
                  <span className="text-[#e50075] text-xs">{items.length} x</span>
                </div>
              </div>

              {isPressed[key] && (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex-row justify-between items-center bg-white p-2 pl-6 pr-6 mt-[-14] pb-4"
                  >
                    <span className="text-[#e50075] text-xs">
                      LS {index + 1}:
                    </span>
                    <span className="text-[#e50075] text-xs">
                      {item.belegnummer}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-row w-full justify-between bg-white rounded-b-lg px-5 py-2">
              <span className="text-left text-gray-400 text-xs">Job {index + 1}</span>
              <span className="text-right text-gray-400 text-xs">Dauer: {items[0].arrival}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PreviewModal.propTypes = {
  groupedItemsScanned: PropTypes.object.isRequired,
  removeItemFromInvoiceData: PropTypes.func.isRequired,
  isPressed: PropTypes.object.isRequired,
  toggleIsPressed: PropTypes.func.isRequired,
};

export default PreviewModal;