import PropTypes from 'prop-types';

const InputPrimary = ({
        //innerRef, 
        type, 
        maxLength, 
        value, 
        autoFocus, 
        //onFocus, 
        placeholder, 
        onChange, 
        inputMode, 
        className, 
        readOnly,
        roundSet
    }) => {
        return (
            <div className={className}>
                <input 
                    //ref={innerRef}
                    type={type} 
                    className={`w-full ${!readOnly ? `${roundSet} h-[35px] rounded-full border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-[#141933] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e50075] sm:text-sm sm:leading-6` : "hidden"} `}
                    maxLength={maxLength}
                    value ={value}
                    autoFocus={autoFocus}
                    //onFocus={onFocus} 
                    placeholder={placeholder}
                    onChange={onChange}
                    inputMode={inputMode}
                    readOnly={readOnly ? true : undefined}
                    // force hide default keyboard in android?

                    /* onStartShouldSetResponder={onStartShouldSetResponder} */
                />
            </div>
        )
    }

InputPrimary.propTypes = {
    //innerRef: PropTypes.string,
    type: PropTypes.string,
    maxLength: PropTypes.number,
    value: PropTypes.string.isRequired,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    inputMode: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.string,
    className: PropTypes.string,
};

export default InputPrimary