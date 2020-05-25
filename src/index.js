import './style.css';

const defaultConfig = {
  countryCode: 'by',
  autocompleteType: ['(cities)'],
  onlyName: false,
  normalizeLanguage: false
}

const googleMapsAutocompleteInput = ({input, sessionToken=null, config={...defaultConfig}, afterSelected=null}) => {
  const autocompleteService = new google.maps.places.AutocompleteService();
  const placesService = new google.maps.places.PlacesService(document.createElement('div'));

  let currentFocus;
  
  input.addEventListener('input', function(e) {
    const inputValue = this.value;

    closeAllLists();
    if (!inputValue) { 
      return false;
    }
    
    currentFocus = -1;

    const dropdown = document.createElement('div');
    dropdown.setAttribute('id', `${this.id}autocomplete-list`);
    dropdown.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(dropdown);

    const autocompleteCallback = (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < predictions.length; i++) {
          const place_id = predictions[i].place_id;
          let place_name = predictions[i].description;
          if (config.onlyName) {
            place_name = predictions[i].structured_formatting.main_text;
          } 
         
          const dropdownElement = document.createElement('div');
          dropdownElement.innerHTML = `<strong>${place_name.substr(0, inputValue.length)}</strong>`;
          dropdownElement.innerHTML += place_name.substr(inputValue.length);
          dropdownElement.setAttribute('place_name', place_name);
          dropdownElement.setAttribute('place_id', place_id);
          dropdownElement.addEventListener('click', function(e) {
            const place_id = this.getAttribute('place_id');
            if (typeof afterSelected === 'function') {
              afterSelected(place_id);
            }

            if (config.normalizeLanguage) {
              const detailsCallback = (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  if (config.onlyName) { 
                    input.value = predictions.name;
                  } else {
                    input.value = predictions.formatted_address;
                  }
                }
              }
              getDetails(place_id, detailsCallback);
            } else {
              input.value = place_name; 
            }
            
            closeAllLists();
          });
          dropdown.appendChild(dropdownElement);
        }
      }
    }
    getAutocomplete(inputValue, autocompleteCallback); 
  });

  input.addEventListener('keydown', function(e) {
    let dropdownElements = document.getElementById(`${this.id}autocomplete-list`);

    if (dropdownElements) {
      dropdownElements = dropdownElements.getElementsByTagName('div');
    }

    if (e.keyCode == 40) {
      currentFocus++;
      addActive(dropdownElements);
    } else if (e.keyCode == 38) { 
      currentFocus--;
      addActive(dropdownElements);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1 && x) {
        dropdownElements[currentFocus].click();
      }
    }
  });

  const addActive = dropdownElements => {
    if (!dropdownElements) {
      return false;
    }
    
    removeActive(dropdownElements);
    if (currentFocus >= dropdownElements.length) {
      currentFocus = 0;
    }
    if (currentFocus < 0) {
      currentFocus = (dropdownElements.length - 1);
    }

    dropdownElements[currentFocus].classList.add('autocomplete-active');
  }

  const removeActive = dropdownElements => {
    for (let i = 0; i < elements.length; i++) {
      dropdownElements[i].classList.remove('autocomplete-active');
    }
  }

  const closeAllLists = element => {
    const dropdownElements = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < dropdownElements.length; i++) {
      if (element != dropdownElements[i] && element != input) {
        dropdownElements[i].parentNode.removeChild(dropdownElements[i]);
      }
    }
  }

  const getAutocomplete = (input, callback) => {
    let request = {
        input: input,
        types: config.autocompleteType,
        componentRestrictions: {
          country: config.countryCode
        },
        sessionToken: sessionToken
    };
    autocompleteService.getPlacePredictions(request, callback);
  }

  const getDetails = (placeId, callback) => {
    let request = {
        placeId: placeId,
        sessionToken: sessionToken
    };
    if (config.onlyName) { 
      request.fields = ['name']  
    } else {
      request.fields = ['formatted_address']
    }
    placesService.getDetails(request, callback);
  }

  document.addEventListener('click', function(e) {
    closeAllLists(e.target);
  }); 
}

if (typeof module !== 'undefined' || !module.exports) {
  global.googleMapsAutocompleteInput = googleMapsAutocompleteInput;
}

export default googleMapsAutocompleteInput;