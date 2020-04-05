# BookNetRepo

## Setup
`npm install`

`cd client`

`npm install`

`npm start`

### To run client and server simultaneously
`npm i express concurrently`

`npm i nodemon`

`npm run dev`

### Issues with dependencies for GiftedChat or @materialui
cd client
npm i --save-dev react-web-gifted-chat @material-ui/core

If this removes "dev:" line in package.json, add this to the scripts...
"dev": "nodemon server.js"
