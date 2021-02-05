# updateDuckDNS
A simple lightweight https update function for DuckDNS
 
## Installation 
Use [npm](https://www.npmjs.com/) to install it:
```bash
npm install updateduckdns
```
Or simply clone this repository in your project.

## Usage
To use it, you need to specify some parameters:
```javascript
const duckdns = require('updateduckdns')(domain,token,minutes,noParamReq,onResponse);
```
* **domain** (Required): The domain name of your DuckDNS: http://domain.duckdns.org
* **token** (Required): Your token (you can find it in your duckdns page)
* **minutes** (Optional, default: 5): Every how many minutes you need to ping the server
* **noParamReq** (Optional, default: false): A boolean.\
  If false the request will be:
  ```bash
  https://duckdns.org/update?domains=domain&token=token&verbose=true
  ```
  If true:
  ```bash
  https://duckdns.org/update/domain/token
  ```
* **onResponse** (Optional): The callback function for every request.\
  If not specified, the output in the console will be something like that:
  ```bash
  |DUCKDNS|info| Pinged domain, ip: 32.69.69.169, NOCHANGE
  ```
  and if there's an error, it will be something like that:
  ```bash
  |DUCKDNS|WARN| Error, response: 
  ...
  ```
  If you want to specify your function, you need to do:
  ```javascript
  const duckdns = require('updateduckdns')(mydomain,mytoken,minutes,noParamReq,(data)=>{
    // work here with the data returned
  });
  ```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
