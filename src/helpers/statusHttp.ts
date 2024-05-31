//se declaran los identificadores de los status http
export var StatusHttp;
(function (StatusHttp) {
    StatusHttp[StatusHttp["OK"] = 200] = "OK";
    StatusHttp[StatusHttp["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusHttp[StatusHttp["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusHttp[StatusHttp["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusHttp[StatusHttp["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusHttp[StatusHttp["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusHttp[StatusHttp["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(StatusHttp || (StatusHttp = {}));