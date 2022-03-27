class JSONResponse {
    static SUCCESS_STATUS = 200;
    static FAILURE_STATUS = 500;
    static FAILURE_FORBIDDEN = 403;
    static AUTH_EXPIRED = 401;
    status;
    message;
    data;

    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
module.exports = JSONResponse;