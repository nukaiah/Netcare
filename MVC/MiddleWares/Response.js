export function sendResponse(res, status, message, data = {}) {
    return res.status(200).json({
        status,
        message,
        data
    });
};



export function sendValidationResponse(res,error = {}) {
    return res.status(400).json({
        status:false,
        message: "Validation failed",
        error
    });
};


export function sendDuplicateResponse(res, message, error = {}) {
    return res.status(409).json({
        status:false,
        message,
        error,
    });
};


export function sendNotFoundResponse(res, message) {
    return res.status(404).json({
        status:false,
        message,
        data:{}
    });
};

export function sendLoginResponse(res, data = {}, token) {
    return res.status(200).json({
        status:true,
        message:"Login Successfully",
        data,
        token
    });
};

export function sendErrorResponse(res, message, error = {}) {
    return res.status(500).json({
        status:false,
        message,
        error
    });
};