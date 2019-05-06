
const http = require('http');

var options = {
    host: "127.0.0.1",
    port: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
};

function request(cb, params) {
    var req = http.request(options, (res) => {      
        var data = "";
        res.on('data', (chunk) => {                 
            data += chunk;
        });

        res.on('end', () => {                       
            console.log(options, data);
            cb();
        });
    });

    if (params) {
        req.write(JSON.stringify(params));
    }

    req.end();
}

/**
 * 상품 관리 API 테스트
 */

function cars(callback) {    
    /*cars_post(() => {
        cars_get(() => {
            cars_delete(callback);
        });
    });*/
    cars_post(callback);
    cars_get(callback);
    cars_delete(callback);

    function cars_post(cb) {        
        options.method = "POST";
        options.path = "/cars";
        request(cb, {
            name: "test cars",
            category: "tests",
            price: 1000,
            description: "test"
        });
    }

    function cars_get(cb) {
        options.method = "GET";
        options.path = "/cars";
        request(cb);
    }

    function cars_delete(cb) {
        options.method = "DELETE";
        options.path = "/cars?id=1";
        request(cb);
    }
}


console.log("============================== cars ==============================");
cars(() => {
        console.log("done");
});
