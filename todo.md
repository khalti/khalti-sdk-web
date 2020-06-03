## Before Deploy and Shipping
- [ ] resolve cors issue from server
- [ ] change a line to ```window.opener.postMessage('{{data | safe}}', '*')``` in *gateway/templates/ebanking*
- [ ] before deploy set env CDN_HOST and KHALTI_SERVER
- ```npm run build```
- bump version
- ```npm publish```
- upload dist/ to CDN

## On Development
- ```npm run build```
- ```npm run start```
- ```npm run watch:widget```
