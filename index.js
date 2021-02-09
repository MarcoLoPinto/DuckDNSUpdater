module.exports = function(domain,token,minutes = 5, noParamReq = false, onResponse = undefined) {
    const https = require('https');
    class DuckDNSUpdater{
        constructor(domain,token,minutes,noParamReq,onResponse){
            this.YOURDOMAIN = domain || "domain";
            this.YOURTOKEN = token || "token";
            this.MINUTES = minutes;

            this.URL = `https://duckdns.org/update?domains=${this.YOURDOMAIN}&token=${this.YOURTOKEN}&verbose=true`;
            if(noParamReq) this.URL = `https://duckdns.org/update/${this.YOURDOMAIN}/${this.YOURTOKEN}`;

            if(typeof onResponse !== 'function') this.onResponse = this.responseCallback.bind(this);
            else this.onResponse = onResponse.bind(this);

            this.listener = undefined;
        }

        start(){
            if(this.listener == undefined){
                this.updateServer(this.URL);
                this.listener = setInterval(() => this.updateServer(this.URL), this.MINUTES*1000*60);
            }
        }

        stop(){
            clearTimeout(this.listener);
            this.listener = undefined;
        }

        updateServer(URL){
            this.https_redirect(URL,this.onResponse);
        }

        responseCallback(data){
            let dataArr = data.split("\n");
            if(dataArr[0]=="OK"){
                let infos = "";
                if(dataArr.length > 1 && dataArr[1] && dataArr[3]){ 
                    infos = ", ip: "+dataArr[1]+", "+dataArr[3];
                }
                console.log("|DUCKDNS|info| Pinged "+this.YOURDOMAIN+infos);
            }
            else console.log("|DUCKDNS|WARN| Error, response: \n"+data);
        }

        https_redirect(link,callback){
            https.get(link, (resp)=>{
                let data = '';
    
                if(resp.statusCode == 301){
                    this.https_redirect(resp.headers.location,callback);
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

    }
    
    return new DuckDNSUpdater(domain,token,minutes,noParamReq,onResponse);

}