
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
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.name == null || params.category == null || params.price == null || params.description == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        // 체인코드 자동차정보 invoke
        console.log("register");
        cb(response);

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
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };
    //체인코드 자동차정보 query
    console.log("inquiry");
    cb(response);
    
   }

/**
 * 자동차 삭제 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function unregister(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.id == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        console.log("unregister");
        cb(response);
    }
}
