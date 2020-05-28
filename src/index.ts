import './style.css';

let defaultSessionToken: string;
let autocompleteService: any;

type configType = {
  countryCode: string;
  autocompleteType: [];
  onlyName: boolean;
  filterInputs: [];
};

declare let google: any;
declare let global: any;

/**
 * _generate additional filter
 * @param {HTMLInputElement[]} inputs _list of inputs from DOM
 */
const generateFilterFromInputs = (inputs: HTMLInputElement[] = []) => {
  let filter = '';
  inputs.forEach((input: HTMLInputElement) => {
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
  });

  return filter;
};

const ifGmapsLibraryExist = () => {
  try {
    if (typeof google !== 'undefined' && google && google.maps) {
      return true;
    }
  } catch (e) {
    return false;
  }
};

const initAutocompleteService = async () => {
  let initInterval: number = null;
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
    };

    init();
    initInterval = window.setInterval(function () {
      init();
    }, 1000);
  });
};

function placesAutocomplete(
  API_TOKEN: '' = '',
  LANG_ID: '' | null = null
): void {
  const defaultInputConfig: configType = {
    countryCode: '',
    autocompleteType: [],
    onlyName: false,
    filterInputs: [],
  };

  if (!ifGmapsLibraryExist()) {
    let gmapsLibraryURL = `https://maps.googleapis.com/maps/api/js?key=${API_TOKEN}&libraries=places`;
    if (LANG_ID) {
      gmapsLibraryURL += `&language=${LANG_ID}`;
    }

    document.write(`<script src="${gmapsLibraryURL}" async defer></script>`);
  }

  this.bindInput = ({
    input = null,
    config = defaultInputConfig,
    afterSelected = null,
    sessionToken = null,
  }: {
    input: HTMLInputElement | null;
    config: configType | null;
    afterSelected: any;
    sessionToken: string | undefined;
  }) => {
    if (!input) {
      return false;
    }
    let currentFocus: number;

    if (sessionToken === null) {
      sessionToken = defaultSessionToken;
    }

    input.addEventListener('input', function () {
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

      const autocompleteCallback = (predictions: any, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < predictions.length; i++) {
            const place = predictions[i];
            const place_id = place.place_id;
            let place_name = place.description;

            if (config.onlyName) {
              place_name = place.structured_formatting.main_text;
            }

            const dropdownElement = document.createElement('div');
            dropdownElement.innerHTML = `<strong>${place_name.substr(
              0,
              inputValue.length
            )}</strong>`;
            dropdownElement.innerHTML += place_name.substr(inputValue.length);
            dropdownElement.setAttribute('place-name', place_name);
            dropdownElement.setAttribute('place-id', place_id);
            dropdownElement.addEventListener('click', function () {
              if (typeof afterSelected === 'function') {
                try {
                  afterSelected({
                    id: place.place_id,
                    name: place_name,
                    description: place.description,
                    structured_formatting: place.structured_formatting,
                    terms: place.terms,
                  });
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
      };
      getAutocomplete(inputValue, autocompleteCallback);
    });

    input.addEventListener('keydown', function (e) {
      const dropdownMenu: HTMLElement = document.getElementById(
        `${this.id}-autocomplete-list`
      );

      if (dropdownMenu) {
        const dropdownElements: HTMLCollectionOf<HTMLDivElement> = dropdownMenu.getElementsByTagName(
          'div'
        );

        if (e.keyCode == 40) {
          currentFocus++;
          addActive(dropdownElements);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(dropdownElements);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1 && dropdownElements) {
            dropdownElements[currentFocus].click();
          }
        }
      }
    });

    const addActive = (dropdownElements: HTMLCollectionOf<HTMLDivElement>) => {
      if (!dropdownElements) {
        return false;
      }

      removeActive(dropdownElements);
      if (currentFocus >= dropdownElements.length) {
        currentFocus = 0;
      }
      if (currentFocus < 0) {
        currentFocus = dropdownElements.length - 1;
      }

      dropdownElements[currentFocus].classList.add('autocomplete-active');
    };

    const removeActive = (
      dropdownElements: HTMLCollectionOf<HTMLDivElement>
    ) => {
      for (let i = 0; i < dropdownElements.length; i++) {
        dropdownElements[i].classList.remove('gmaps-autocomplete-active');
      }
    };

    const closeAllLists = (element?: EventTarget) => {
      const dropdownElements = document.getElementsByClassName(
        'gmaps-autocomplete-items'
      );
      for (let i = 0; i < dropdownElements.length; i++) {
        if (element != dropdownElements[i] && element != input) {
          dropdownElements[i].parentNode.removeChild(dropdownElements[i]);
        }
      }
    };

    const getAutocomplete = async (input: string, callback: any) => {
      if (!autocompleteService) {
        await initAutocompleteService();
      }

      const request = {
        input: input,
        types: config.autocompleteType,
        componentRestrictions: {
          country: config.countryCode,
        },
        sessionToken: sessionToken,
      };
      autocompleteService.getPlacePredictions(request, callback);
    };

    document.addEventListener('click', (e: MouseEvent) => {
      closeAllLists(e.target);
    });
  };
}

if (typeof module === 'undefined' || !module.exports) {
  global.placesAutocomplete = placesAutocomplete;
}

export default placesAutocomplete;
