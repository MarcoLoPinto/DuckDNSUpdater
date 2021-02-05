module.exports = function(domain,token,minutes = 5, noParamReq = false, onResponse = undefined) {

    const https = require('https');

    const YOURDOMAIN = domain || "domain";
    const YOURTOKEN = token || "token";
    const MINUTES = minutes;

    let responseCallback = (data) => {
        data = data.split("\n");
        if(data[0]=="OK"){
            let infos = "";
            if(data.length > 1 && data[1] && data[3]){ 
                infos = ", ip: "+data[1]+", "+data[3];
            }
            console.log("|DUCKDNS|info| Pinged "+YOURDOMAIN+infos);
        }
        else console.log("|DUCKDNS|WARN| Error, response: \n",data);
    }
    if(typeof onResponse !== 'function') onResponse = responseCallback;

    let URL = `https://duckdns.org/update?domains=${YOURDOMAIN}&token=${YOURTOKEN}&verbose=true`;
    if(noParamReq) URL = `https://duckdns.org/update/${YOURDOMAIN}/${YOURTOKEN}`;

    let https_redirect = function(link,callback){
        https.get(link, (resp)=>{
            let data = '';

            if(resp.statusCode == 301){
                https_redirect(resp.headers.location,callback);
                return;
            }
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                callback(data);
            });

        }).on("error", (err) => {
            callback("Error: " + err.message);
        });
    }
    let updateServer = (url) => https_redirect(url,onResponse);

    updateServer(URL);
    setInterval(() => updateServer(URL), MINUTES*1000*60);

}