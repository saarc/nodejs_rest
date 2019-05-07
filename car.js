


/**
 * 자동차 관리의 각 기능별로 분기
*/

exports.onRequest = function (res, method, pathname, params, cb) {

    switch (method) {
        case "POST":
            return register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "DELETE":
            return unregister(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "PUT":
            return change(method, pathname, params, (response) => { process.nextTick(cb, res, response); }); 
        default:

        return process.nextTick(cb, res, null);
    }
}

/**
 * 자동차 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {
    var response = {
        key: params.carno,
        errorcode: 0,
        errormessage: "success"
    };
    if( params.carno==undefined || params.colour==undefined || params.make==undefined || params.model==undefined|| params.owner==undefined){
        console.error('Car createion parameters are not valid.');
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        // 체인코드 자동차정보 invoke
        console.log("register");
        carc( params,response, cb);
    }
}

/**
 * 자동차 조회 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {
    var response = {
        key: params.carno,
        errorcode: 0,
        errormessage: "success",
        result:""
    };
    //체인코드 자동차정보 query
    console.log("inquiry");
    // Hyperledger Bridge
    carq( params,response, cb);
}

/**
 * 자동차 변경 기능
 */
function change(method, pathname, params, cb) {
    var response = {
        key: params.carno,
        errorcode: 0,
        errormessage: "success",
        result:""
    };
    //체인코드 자동차정보 change
    console.log("change");
    // Hyperledger Bridge
    carch( params,response, cb);
}

/**
 * 자동차 삭제 기능
 */
function unregister(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.carno == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        console.log("unregister");
        cb(response);
    }
}

async function carq(params, response, cb)
{
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    try {
        var carno = params.carno;
        console.log(carno);
        if(carno==undefined)
        {
            console.error('Car Key is not included.');
            response.errorcode = 400;
            response.errormessage = "Car no is invalid"
            cb(response);
        }
        else{
    
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('queryCar', carno);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

            response.result = result.toString();
            cb(response);
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.errorcode = 400;
        response.errormessage = error;
        cb(response);
    }
}

async function carc(params, response, cb)
{
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    try {
        var carno = params.carno;
        var colour = params.colour;
        var make = params.make;
        var model = params.model;
        var owner = params.owner;

        if(carno==undefined || colour==undefined || make==undefined|| model==undefined||owner==undefined)
        {
            console.error('Car createion parameters are not valid.');
            response.errorcode = 400;
            response.errormessage = "Car createion parameters are not valid."
            cb(response);
        }
        else{
        
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('fabcar');
    
            //const result = await contract.evaluateTransaction('queryCar', carno);
                        
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    //        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
            await contract.submitTransaction('createCar', carno, make, model, colour, owner);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            response.result ='Transaction has been submitted';
            cb(response);
        }
            
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.errorcode = 400;
        response.errormessage = error;
        cb(response);
    }
}

async function carch(params, response, cb)
{
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    try {
        var carno = params.carno;
        var owner = params.owner;
        if(carno==undefined || owner==undefined)
        {
            console.error('Car owner change parameters are not valid.');
            response.errorcode = 400;
            response.errormessage = "Car owner change parameters are not valid."
            cb(response);
        }
        else{
        
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('fabcar');
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    //        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
            await contract.submitTransaction('changeCarOwner', carno, owner);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            response.result ='Transaction has been submitted';
            cb(response);
        }
            
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.errorcode = 400;
        response.errormessage = error;
        cb(response);
    }
}
