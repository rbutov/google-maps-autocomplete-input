## Autocomplete input with dropdwon for google maps JS API 

### Add google maps JS code to the html:
replace <API_TOKEN> with your code from google maps console:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=<API_TOKEN>&libraries=places&language=ru&callback=initMap" async defer></script>
```

### Usage as js library:
1) Include js library file:
```html
<script src="../dist/google-maps-autocomplete-input.js"></script>
```
2) Add code to you html file:
```js
<script>
    function initMap() {
      // _session token to share session during all request to google maps api
      // _read more: https://developers.google.com/places/web-service/session-tokens
      const sessionToken = new google.maps.places.AutocompleteSessionToken();
      // _config for the module
      const config = {
        // _specify country for autocomplete
        countryCode: 'by',
        // _type of autocomplition: (cities), (regions): https://developers.google.com/maps/documentation/javascript/places-autocomplete
        autocompleteType: [],
        // _use only place name
        onlyName: false,
        // _set intput value using your language, not input laguage
        normalizeLanguage: false
      }
      // _after dropdown selected callback
      const afterSelected = place_id => {
        document.getElementById('autocompleteId').value = place_id;
      }
      // _init module
      googleMapsAutocompleteInput({
          input: document.getElementById('autocomplete'), 
          sessionToken, 
          config, 
          afterSelected
      });
    }
</script>
```

### Usage with npm:

npm i -s google-maps-autocomplete-input