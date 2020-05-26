import './style.css';

let defaultSessionToken;
let autocompleteService;

const generateFilterFromInputs = (inputs=[]) => {
  let filter = '';
  inputs.forEach(input => {
    if (typeof input === 'object' && 'value' in input) {
      const inputName = input.value;
      if (inputName) {
        if (filter) {
          filter += `, ${inputName}`;
        } else {
          filter = inputName;
        }
      }
    }
  }) 

  return filter;
}

const ifGmapsLibraryExist = () => {
  try {
    if ((typeof google !== 'undefined' && google && google.maps)) {
      return true;
    }
  } catch(e) {
    return false;
  }
}

const initAutocompleteService = async () => {
  let initInterval = null;
  return new Promise(resolve => {
    const init = () => {
      if (ifGmapsLibraryExist()) {
        defaultSessionToken = new google.maps.places.AutocompleteSessionToken();
        autocompleteService = new google.maps.places.AutocompleteService();
      }

      if (autocompleteService) {
        resolve();
        if (initInterval) {
          clearInterval(initInterval);
        }
      }
    }

    init();
    initInterval = setInterval(function() {
      init();
    }, 1000);
  })
};

function googleMapsAutocompleteInput(API_TOKEN='', LANG_ID=null) {
  const defaultInputConfig = {
    countryCode: '',
    autocompleteType: [],
    onlyName: false,
    filterInputs: []
  }

  if (!ifGmapsLibraryExist()) {
    let gmapsLibraryURL = `https://maps.googleapis.com/maps/api/js?key=${API_TOKEN}&libraries=places`;
    if (LANG_ID) {
      gmapsLibraryURL += `&language=${LANG_ID}`;
    }
  
    document.write(`<script src="${gmapsLibraryURL}" async defer></script>`);
  }
  
  this.bindInput = ({
    input=null, 
    config={}, 
    afterSelected=null,
    sessionToken=null
  }) => {
    if (!input) {
      return false;
    }
    let currentFocus;
    
    if (sessionToken === null) {
      sessionToken = defaultSessionToken;
    }

    config = {...defaultInputConfig, ...config}
    
    input.addEventListener('input', function(e) {
      const filter = generateFilterFromInputs(config.filterInputs); 
      let inputValue = this.value;

      if (filter) {
        inputValue = `${filter}, ${inputValue}`;
      }

      if (!inputValue) { 
        return false;
      }

      closeAllLists();
      currentFocus = -1;

      const dropdown = document.createElement('div');
      dropdown.setAttribute('id', `${this.id}-autocomplete-list`);
      dropdown.setAttribute('class', 'gmaps-autocomplete-items');
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
            dropdownElement.setAttribute('place-name', place_name);
            dropdownElement.setAttribute('place-id', place_id);
            dropdownElement.addEventListener('click', function(e) {
              const place_id = this.getAttribute('place-id');
              if (typeof afterSelected === 'function') {
                try {
                  afterSelected(place_id, place_name);
                } catch (er) {
                  console.error(er);
                }
              }
              input.value = place_name; 
              closeAllLists();
            });
            dropdown.appendChild(dropdownElement);
          }
        }
      }
      getAutocomplete(inputValue, autocompleteCallback); 
    });

    input.addEventListener('keydown', function(e) {
      let dropdownElements = document.getElementById(`${this.id}-autocomplete-list`);

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
        dropdownElements[i].classList.remove('gmaps-autocomplete-active');
      }
    }

    const closeAllLists = element => {
      const dropdownElements = document.getElementsByClassName('gmaps-autocomplete-items');
      for (let i = 0; i < dropdownElements.length; i++) {
        if (element != dropdownElements[i] && element != input) {
          dropdownElements[i].parentNode.removeChild(dropdownElements[i]);
        }
      }
    }

    const getAutocomplete = async (input, callback) => {
      if (!autocompleteService) {
        await initAutocompleteService();
      }
      
      const request = {
          input: input,
          types: config.autocompleteType,
          componentRestrictions: {
            country: config.countryCode
          },
          sessionToken: sessionToken
      }

      autocompleteService.getPlacePredictions(request, callback);
    }

    document.addEventListener('click', function(e) {
      closeAllLists(e.target);
    });
  }
}

if (typeof module !== 'undefined' || !module.exports) {
  global.googleMapsAutocompleteInput = googleMapsAutocompleteInput;
}

export default googleMapsAutocompleteInput;