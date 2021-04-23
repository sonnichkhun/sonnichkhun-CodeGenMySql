import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { useRef } from 'reactn';

export interface LocationAutoCompleteProps {
  onPlaceChanged: (place: any) => void;
  placeholder?: string;
  className?: string;
  defaultAddress?: string;
}

function LocationAutoComplete(props: LocationAutoCompleteProps) {
  const { onPlaceChanged, placeholder, className, defaultAddress } = props;
  const [address, setAddress] = React.useState<string>('');
  const placesService = useRef(
    new window.google.maps.places.PlacesService(document.createElement('div')),
  );

  const handleChange = address => {
    setAddress(address);
  };

  const handleSelect = (address, placeId) => {
    setAddress(address);

    if (placeId === null) {
      return;
    }

    const request = {
      placeId,
      fields: ['name', 'geometry'],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        onPlaceChanged(place);
      }
    });
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="autocomplete-container">
          <input
            {...getInputProps({
              placeholder,
              className,
            })}
          />

          {/* Dropdown container */}
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default LocationAutoComplete;
