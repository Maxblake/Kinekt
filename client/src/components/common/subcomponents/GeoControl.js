import React, { useEffect } from "react";
import Geosuggest from "react-geosuggest";

export default ({ initialValue, onChange, onSuggestSelect }) => {
  let geosuggestInput = React.useRef(null);
  let geosuggestComponent = React.useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleToggleGeosuggest);
    return () => {
      document.removeEventListener("click", handleToggleGeosuggest);
    };
  }, []);

  const handleToggleGeosuggest = e => {
    if (!geosuggestComponent.current || !geosuggestInput.current) return;

    if (!geosuggestInput.current.contains(e.target)) {
      geosuggestComponent.current.onInputBlur();
    }
  };

  return (
    <div className="control" ref={geosuggestInput}>
      <Geosuggest
        ref={el => (geosuggestComponent.current = el)}
        initialValue={initialValue}
        placeDetailFields={[]}
        queryDelay={500}
        onChange={onChange}
        onSuggestSelect={onSuggestSelect}
        inputClassName="input"
        suggestsClassName="k-scroll"
      />
    </div>
  );
};
