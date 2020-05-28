[![npm version](https://img.shields.io/npm/v/google-maps-autocomplete-input.svg?style=flat)](https://www.npmjs.com/package/google-maps-autocomplete-input) [![Bundlephobia](https://badgen.net/bundlephobia/minzip/google-maps-autocomplete-input)](https://bundlephobia.com/result?p=google-maps-autocomplete-input) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Google Maps Autocomplete Input

Custom UI for Google Maps Places Autocomplete.

### Browser document object is requered.

### Sample
<img src="https://raw.githubusercontent.com/rgbutov/google-maps-autocomplete-input/master/sample/sample.png" height="200">

### Installation
#### Node
```bash
npm i -s google-maps-autocomplete-input
```
#### Script tag
```html
<script src="/path/to/google-maps-autocomplete-input.js"></script>
```

### Usage
```js
// _for NODE.js
import placesAutocomplete from 'google-maps-autocomplete-input';
// _init module, you need API_TOKEN from google console
const paInput = new placesAutocomplete('<API_TOKEN>');
const placeConfig = {
  // _specify country for autocomplete
  countryCode: 'us',
  // _type of autocomplition: (cities), (regions): https://developers.google.com/maps/documentation/javascript/places-autocomplete
  autocompleteType: ['(cities)'],
  // _use only place name
  onlyName: true,
  // _inputs list with additional filter places like city, state, country
  filterInputs: []
} 
// _after dropdown selected callback
/* place: {id, name, description, structured_formatting, terms} */
const afterPlaceSelected = place => {
  console.log(place);
}
const placeInput = document.getElementById('dcity');
// bind input with autocompletetion to input
paInput.bindInput({
    input: placeInput, 
    config: placeConfig,
    afterSelected: afterPlaceSelected
});
```

### License
Google Maps Autocomplete Input is MIT licensed.