## Autocomplete input with dropdwon for google maps JS API  &middot; [![npm version](https://img.shields.io/npm/v/google-maps-autocomplete-input.svg?style=flat)](https://www.npmjs.com/package/google-maps-autocomplete-input)

### Sample
<img src="https://raw.githubusercontent.com/rgbutov/google-maps-autocomplete-input/master/sample/sample.png" height="200">

### Installation
#### Node
```bash
npm i -s google-maps-autocomplete-input 
```
#### Script tag
```html
<script src="./node_modules/google-maps-autocomplete-input/google-maps-autocomplete-input.min.js"></script>
```

### Usage
```js
  // _init module, you need API_TOKEN from google console
  const gmaInput = new googleMapsAutocompleteInput('<API_TOKEN>');
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
  const afterPlaceSelected = (place_id, place_name) => {
    console.log(place_id, place_name);
  }
  
  const placeInput = document.getElementById('dcity');
  // bind input with autocompletetion to input
  gmaInput.bindInput({
      input: placeInput, 
      config: placeConfig,
      afterSelected: afterPlaceSelected
  });
```

### License
Autocomplete input with dropdwon is MIT licensed.