"use strict";
exports.__esModule = true;
exports.createRpcWarningMiddleware = void 0;
var messages_1 = require("../messages");
/**
 * Create JSON-RPC middleware that logs warnings for deprecated RPC methods.
 *
 * @param log - The logging API to use.
 * @returns The JSON-RPC middleware.
 */
function createRpcWarningMiddleware(log) {
    var sentWarnings = {
        ethDecryptDeprecation: false,
        ethGetEncryptionPublicKeyDeprecation: false
    };
    return function (req, _res, next) {
        if (sentWarnings.ethDecryptDeprecation === false &&
            req.method === 'eth_decrypt') {
            log.warn(messages_1["default"].warnings.rpc.ethDecryptDeprecation);
            sentWarnings.ethDecryptDeprecation = true;
        }
        else if (sentWarnings.ethGetEncryptionPublicKeyDeprecation === false &&
            req.method === 'eth_getEncryptionPublicKey') {
            log.warn(messages_1["default"].warnings.rpc.ethGetEncryptionPublicKeyDeprecation);
            sentWarnings.ethGetEncryptionPublicKeyDeprecation = true;
        }
        next();
    };
}
exports.createRpcWarningMiddleware = createRpcWarningMiddleware;
