      // Client ID and API key from the Developer Console
      var CLIENT_ID = '938057332518-bobk61co8rm7ge0lbf56df6405pev01m.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyA2ESJBkNRjibHsQr2UTHtyYPslzNleyXw';

    var SHEET_ID = '1RGjUR5XLP1CzNaAzHYb-wQt8ITtn5D3LdJANA81KlTg';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          listMajors();
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the names and majors of students in a sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
       */
       function listMajors() {

var values = [
  [
    'Shbad Veyyakula','krishnatechpranav@gmail.com'
  ],
  // Additional rows ...
];


var body = {
  values: values
};
gapi.client.sheets.spreadsheets.values.append({
  spreadsheetId: SHEET_ID,
  range: 'Sheet1!A:A',
  valueInputOption: 'USER_ENTERED',
  resource: body
}).then((response) => {
  var result = response.result;
  console.log(`${result.updatedCells} cells updated.`);
});

/*
gapi.client.sheets.spreadsheets.values.get({
  spreadsheetId: '1RGjUR5XLP1CzNaAzHYb-wQt8ITtn5D3LdJANA81KlTg',
  range: 'Class Data!A2:E',
}).then(function(response) {
  var range = response.result;
  if (range.values.length > 0) {
    appendPre('Name, Major:');
    for (i = 0; i < range.values.length; i++) {
      var row = range.values[i];
      // Print columns A and E, which correspond to indices 0 and 4.
      appendPre(row[0] + ', ' + row[4]);
    }
  } else {
    appendPre('No data found.');
  }
}, function(response) {
  appendPre('Error: ' + response.result.error.message);
});
*/
}