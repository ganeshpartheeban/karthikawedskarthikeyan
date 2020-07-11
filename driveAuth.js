const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.metadata',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// const TOKEN_PATH = fs.readFileSync(require.resolve('./assets/token.json'))
// const CREDENTIALS_PATH = fs.readFileSync(require.resolve('./assets/credentials.json'))


var credentials = {
  "installed": {
      "client_id": "742936534892-p0dicip672ojn7oc4cu2e9vdolgigqpq.apps.googleusercontent.com",
      "project_id": "quickstart-1584508099749",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "fEc8t41vguKAq1d-Mv80pp2d",
      "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost", "http://localhost:3000/oauth2callback", "https://www.googleapis.com/drive/v3/changes/watch", "https://www.ganeshpartheeban.in/.netlify/functions/server"]
  }
};

var tokens = {
  "access_token": "ya29.a0Adw1xeUacBqQLu5-EbRR-r3RbkghE5Gk_-Ia1M39IsbC9l0pXwBLj9tcgHRyYBHopX_ZFMbjo8fX1lppppzTro8kR8YqE2ySbdjtTY-0jprpX8E5efewxtlPRNac5S36YQtw6YlZAxBxa1SavNqwRepXoF5s941po5A",
  "refresh_token": "1//0gqIaPIiigVV6CgYIARAAGBASNwF-L9Ir_q1bY-vnGtDtC-XTjQlysJIFPOZnsyZAQvvqHveIEO0yhGn_0zJaTpe5xQ99keyvUQE",
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer",
  "expiry_date": 1585037401638
};

async function authing(params, actionMethod, actionType) {
  const data = await authorize(
    credentials,
    tokens,
    params,
    actionMethod,
    actionType,
    listFiles
  ).then(function(response) {
    return response;
  });
  return data;
}

async function authorize(
  credentials,
  tokens,
  params,
  actionMethod,
  actionType,
  callback
) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);
  const data = await callback(oAuth2Client, params, actionMethod, actionType);
  return data;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listFiles(auth, params, actionMethod, actionType) {
  const drive = google.drive({ version: 'v3', auth });
  const data = drive[actionMethod][actionType](params).then(
    function(response) {
      // Handle the results here (response.result has the parsed body).
      return response;
    },
    function(err) {
      console.error('Execute error', err);
    }
  );
  return data;
}

module.exports = { authing };
