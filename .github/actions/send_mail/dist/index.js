/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 371:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(956);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 966:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(371);
const file_command_1 = __nccwpck_require__(51);
const utils_1 = __nccwpck_require__(956);
const os = __importStar(__nccwpck_require__(37));
const path = __importStar(__nccwpck_require__(17));
const oidc_utils_1 = __nccwpck_require__(437);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 51:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(147));
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(956);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 437:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(112);
const auth_1 = __nccwpck_require__(882);
const core_1 = __nccwpck_require__(966);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 956:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 882:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 112:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(685);
const https = __nccwpck_require__(687);
const pm = __nccwpck_require__(267);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(7);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 267:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 7:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(627);


/***/ }),

/***/ 627:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(808);
var tls = __nccwpck_require__(404);
var http = __nccwpck_require__(685);
var https = __nccwpck_require__(687);
var events = __nccwpck_require__(361);
var assert = __nccwpck_require__(491);
var util = __nccwpck_require__(837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 186:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 2.5.1
(function() {
  // This file's name is set up in such a way that it will always show up first in
  // the list of files given to coffee --join, so that the other files can assume
  // that XMLHttpRequestEventTarget was already defined.

  // The DOM EventTarget subclass used by XMLHttpRequest.

  // @see http://xhr.spec.whatwg.org/#interface-xmlhttprequest
  var InvalidStateError, NetworkError, ProgressEvent, SecurityError, SyntaxError, XMLHttpRequest, XMLHttpRequestEventTarget, XMLHttpRequestUpload, http, https, os, url;

  XMLHttpRequestEventTarget = (function() {
    class XMLHttpRequestEventTarget {
      // @private
      // This is an abstract class and should not be instantiated directly.
      constructor() {
        this.onloadstart = null;
        this.onprogress = null;
        this.onabort = null;
        this.onerror = null;
        this.onload = null;
        this.ontimeout = null;
        this.onloadend = null;
        this._listeners = {};
      }

      // Adds a new-style listener for one of the XHR events.

      // @see http://www.w3.org/TR/XMLHttpRequest/#events

      // @param {String} eventType an XHR event type, such as 'readystatechange'
      // @param {function(ProgressEvent)} listener function that will be called when
      //   the event fires
      // @return {undefined} undefined
      addEventListener(eventType, listener) {
        var base;
        eventType = eventType.toLowerCase();
        (base = this._listeners)[eventType] || (base[eventType] = []);
        this._listeners[eventType].push(listener);
        return void 0;
      }

      // Removes an event listener added by calling addEventListener.

      // @param {String} eventType an XHR event type, such as 'readystatechange'
      // @param {function(ProgressEvent)} listener the value passed in a previous
      //   call to addEventListener.
      // @return {undefined} undefined
      removeEventListener(eventType, listener) {
        var index;
        eventType = eventType.toLowerCase();
        if (this._listeners[eventType]) {
          index = this._listeners[eventType].indexOf(listener);
          if (index !== -1) {
            this._listeners[eventType].splice(index, 1);
          }
        }
        return void 0;
      }

      // Calls all the listeners for an event.

      // @param {ProgressEvent} event the event to be dispatched
      // @return {undefined} undefined
      dispatchEvent(event) {
        var eventType, j, len, listener, listeners;
        event.currentTarget = event.target = this;
        eventType = event.type;
        if (listeners = this._listeners[eventType]) {
          for (j = 0, len = listeners.length; j < len; j++) {
            listener = listeners[j];
            listener.call(this, event);
          }
        }
        if (listener = this[`on${eventType}`]) {
          listener.call(this, event);
        }
        return void 0;
      }

    };

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'loadstart' event
    XMLHttpRequestEventTarget.prototype.onloadstart = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'progress' event
    XMLHttpRequestEventTarget.prototype.onprogress = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'abort' event
    XMLHttpRequestEventTarget.prototype.onabort = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'error' event
    XMLHttpRequestEventTarget.prototype.onerror = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'load' event
    XMLHttpRequestEventTarget.prototype.onload = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'timeout' event
    XMLHttpRequestEventTarget.prototype.ontimeout = null;

    // @property {function(ProgressEvent)} DOM level 0-style handler
    //   for the 'loadend' event
    XMLHttpRequestEventTarget.prototype.onloadend = null;

    return XMLHttpRequestEventTarget;

  }).call(this);

  // This file's name is set up in such a way that it will always show up second
  // in the list of files given to coffee --join, so it can use the
  // XMLHttpRequestEventTarget definition and so that the other files can assume
  // that XMLHttpRequest was already defined.
  http = __nccwpck_require__(685);

  https = __nccwpck_require__(687);

  os = __nccwpck_require__(37);

  url = __nccwpck_require__(310);

  XMLHttpRequest = (function() {
    // The ECMAScript HTTP API.

    // @see http://www.w3.org/TR/XMLHttpRequest/#introduction
    class XMLHttpRequest extends XMLHttpRequestEventTarget {
      // Creates a new request.

      // @param {Object} options one or more of the options below
      // @option options {Boolean} anon if true, the request's anonymous flag
      //   will be set
      // @see http://www.w3.org/TR/XMLHttpRequest/#constructors
      // @see http://www.w3.org/TR/XMLHttpRequest/#anonymous-flag
      constructor(options) {
        super();
        this.onreadystatechange = null;
        this._anonymous = options && options.anon;
        this.readyState = XMLHttpRequest.UNSENT;
        this.response = null;
        this.responseText = '';
        this.responseType = '';
        this.responseURL = '';
        this.status = 0;
        this.statusText = '';
        this.timeout = 0;
        this.upload = new XMLHttpRequestUpload(this);
        this._method = null; // String
        this._url = null; // Return value of url.parse()
        this._sync = false;
        this._headers = null; // Object<String, String>
        this._loweredHeaders = null; // Object<lowercase String, String>
        this._mimeOverride = null;
        this._request = null; // http.ClientRequest
        this._response = null; // http.ClientResponse
        this._responseParts = null; // Array<Buffer, String>
        this._responseHeaders = null; // Object<lowercase String, String>
        this._aborting = null;
        this._error = null;
        this._loadedBytes = 0;
        this._totalBytes = 0;
        this._lengthComputable = false;
      }

      // Sets the XHR's method, URL, synchronous flag, and authentication params.

      // @param {String} method the HTTP method to be used
      // @param {String} url the URL that the request will be made to
      // @param {?Boolean} async if false, the XHR should be processed
      //   synchronously; true by default
      // @param {?String} user the user credential to be used in HTTP basic
      //   authentication
      // @param {?String} password the password credential to be used in HTTP basic
      //   authentication
      // @return {undefined} undefined
      // @throw {SecurityError} method is not one of the allowed methods
      // @throw {SyntaxError} urlString is not a valid URL
      // @throw {Error} the URL contains an unsupported protocol; the supported
      //   protocols are file, http and https
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-open()-method
      open(method, url, async, user, password) {
        var xhrUrl;
        method = method.toUpperCase();
        if (method in this._restrictedMethods) {
          throw new SecurityError(`HTTP method ${method} is not allowed in XHR`);
        }
        xhrUrl = this._parseUrl(url);
        if (async === void 0) {
          async = true;
        }
        switch (this.readyState) {
          case XMLHttpRequest.UNSENT:
          case XMLHttpRequest.OPENED:
          case XMLHttpRequest.DONE:
            // Nothing to do here.
            null;
            break;
          case XMLHttpRequest.HEADERS_RECEIVED:
          case XMLHttpRequest.LOADING:
            // TODO(pwnall): terminate abort(), terminate send()
            null;
        }
        this._method = method;
        this._url = xhrUrl;
        this._sync = !async;
        this._headers = {};
        this._loweredHeaders = {};
        this._mimeOverride = null;
        this._setReadyState(XMLHttpRequest.OPENED);
        this._request = null;
        this._response = null;
        this.status = 0;
        this.statusText = '';
        this._responseParts = [];
        this._responseHeaders = null;
        this._loadedBytes = 0;
        this._totalBytes = 0;
        this._lengthComputable = false;
        return void 0;
      }

      // Appends a header to the list of author request headers.

      // @param {String} name the HTTP header name
      // @param {String} value the HTTP header value
      // @return {undefined} undefined
      // @throw {InvalidStateError} readyState is not OPENED
      // @throw {SyntaxError} name is not a valid HTTP header name or value is not
      //   a valid HTTP header value
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
      setRequestHeader(name, value) {
        var loweredName;
        if (this.readyState !== XMLHttpRequest.OPENED) {
          throw new InvalidStateError("XHR readyState must be OPENED");
        }
        loweredName = name.toLowerCase();
        if (this._restrictedHeaders[loweredName] || /^sec\-/.test(loweredName) || /^proxy-/.test(loweredName)) {
          console.warn(`Refused to set unsafe header \"${name}\"`);
          return void 0;
        }
        value = value.toString();
        if (loweredName in this._loweredHeaders) {
          // Combine value with the existing header value.
          name = this._loweredHeaders[loweredName];
          this._headers[name] = this._headers[name] + ', ' + value;
        } else {
          // New header.
          this._loweredHeaders[loweredName] = name;
          this._headers[name] = value;
        }
        return void 0;
      }

      // Initiates the request.

      // @param {?String, ?ArrayBufferView} data the data to be sent; ignored for
      //   GET and HEAD requests
      // @return {undefined} undefined
      // @throw {InvalidStateError} readyState is not OPENED
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-send()-method
      send(data) {
        if (this.readyState !== XMLHttpRequest.OPENED) {
          throw new InvalidStateError("XHR readyState must be OPENED");
        }
        if (this._request) {
          throw new InvalidStateError("send() already called");
        }
        switch (this._url.protocol) {
          case 'file:':
            this._sendFile(data);
            break;
          case 'http:':
          case 'https:':
            this._sendHttp(data);
            break;
          default:
            throw new NetworkError(`Unsupported protocol ${this._url.protocol}`);
        }
        return void 0;
      }

      // Cancels the network activity performed by this request.

      // @return {undefined} undefined
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-abort()-method
      abort() {
        if (!this._request) {
          return;
        }
        this._request.abort();
        this._setError();
        this._dispatchProgress('abort');
        this._dispatchProgress('loadend');
        return void 0;
      }

      // Returns a header value in the HTTP response for this XHR.

      // @param {String} name case-insensitive HTTP header name
      // @return {?String} value the value of the header whose name matches the
      //   given name, or null if there is no such header
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
      getResponseHeader(name) {
        var loweredName;
        if (!this._responseHeaders) {
          return null;
        }
        loweredName = name.toLowerCase();
        if (loweredName in this._responseHeaders) {
          return this._responseHeaders[loweredName];
        } else {
          return null;
        }
      }

      // Returns all the HTTP headers in this XHR's response.

      // @return {String} header lines separated by CR LF, where each header line
      //   has the name and value separated by a ": " (colon, space); the empty
      //   string is returned if the headers are not available
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
      getAllResponseHeaders() {
        var lines, name, value;
        if (!this._responseHeaders) {
          return '';
        }
        lines = (function() {
          var ref, results;
          ref = this._responseHeaders;
          results = [];
          for (name in ref) {
            value = ref[name];
            results.push(`${name}: ${value}`);
          }
          return results;
        }).call(this);
        return lines.join("\r\n");
      }

      // Overrides the Content-Type

      // @return {undefined} undefined
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-overridemimetype()-method
      overrideMimeType(newMimeType) {
        if (this.readyState === XMLHttpRequest.LOADING || this.readyState === XMLHttpRequest.DONE) {
          throw new InvalidStateError("overrideMimeType() not allowed in LOADING or DONE");
        }
        this._mimeOverride = newMimeType.toLowerCase();
        return void 0;
      }

      // Network configuration not exposed in the XHR API.

      // Although the XMLHttpRequest specification calls itself "ECMAScript HTTP",
      // it assumes that requests are always performed in the context of a browser
      // application, where some network parameters are set by the browser user and
      // should not be modified by Web applications. This API provides access to
      // these network parameters.

      // NOTE: this is not in the XMLHttpRequest API, and will not work in
      // browsers.  It is a stable node-xhr2 API.

      // @param {Object} options one or more of the options below
      // @option options {?http.Agent} httpAgent the value for the nodejsHttpAgent
      //   property (the agent used for HTTP requests)
      // @option options {?https.Agent} httpsAgent the value for the
      //   nodejsHttpsAgent property (the agent used for HTTPS requests)
      // @return {undefined} undefined
      nodejsSet(options) {
        var baseUrl, parsedUrl;
        if ('httpAgent' in options) {
          this.nodejsHttpAgent = options.httpAgent;
        }
        if ('httpsAgent' in options) {
          this.nodejsHttpsAgent = options.httpsAgent;
        }
        if ('baseUrl' in options) {
          baseUrl = options.baseUrl;
          if (baseUrl !== null) {
            parsedUrl = url.parse(baseUrl, false, true);
            if (!parsedUrl.protocol) {
              throw new SyntaxError("baseUrl must be an absolute URL");
            }
          }
          this.nodejsBaseUrl = baseUrl;
        }
        return void 0;
      }

      // Default settings for the network configuration not exposed in the XHR API.

      // NOTE: this is not in the XMLHttpRequest API, and will not work in
      // browsers.  It is a stable node-xhr2 API.

      // @param {Object} options one or more of the options below
      // @option options {?http.Agent} httpAgent the default value for the
      //   nodejsHttpAgent property (the agent used for HTTP requests)
      // @option options {https.Agent} httpsAgent the default value for the
      //   nodejsHttpsAgent property (the agent used for HTTPS requests)
      // @return {undefined} undefined
      // @see XMLHttpRequest.nodejsSet
      static nodejsSet(options) {
        // "this" will be set to XMLHttpRequest.prototype, so the instance nodejsSet
        // operates on default property values.
        XMLHttpRequest.prototype.nodejsSet(options);
        return void 0;
      }

      // Sets the readyState property and fires the readystatechange event.

      // @private
      // @param {Number} newReadyState the new value of readyState
      // @return {undefined} undefined
      _setReadyState(newReadyState) {
        var event;
        this.readyState = newReadyState;
        event = new ProgressEvent('readystatechange');
        this.dispatchEvent(event);
        return void 0;
      }

      // XMLHttpRequest#send() implementation for the file: protocol.

      // @private
      _sendFile() {
        if (this._url.method !== 'GET') {
          throw new NetworkError('The file protocol only supports GET');
        }
        throw new Error("Protocol file: not implemented");
      }

      // XMLHttpRequest#send() implementation for the http: and https: protocols.

      // @private
      // This method sets the instance variables and calls _sendHxxpRequest(), which
      // is responsible for building a node.js request and firing it off. The code
      // in _sendHxxpRequest() is separated off so it can be reused when handling
      // redirects.

      // @see http://www.w3.org/TR/XMLHttpRequest/#infrastructure-for-the-send()-method
      _sendHttp(data) {
        if (this._sync) {
          throw new Error("Synchronous XHR processing not implemented");
        }
        if ((data != null) && (this._method === 'GET' || this._method === 'HEAD')) {
          console.warn(`Discarding entity body for ${this._method} requests`);
          data = null;
        } else {
          // Send Content-Length: 0
          data || (data = '');
        }
        // NOTE: this is called before finalizeHeaders so that the uploader can
        //       figure out Content-Length and Content-Type.
        this.upload._setData(data);
        this._finalizeHeaders();
        this._sendHxxpRequest();
        return void 0;
      }

      // Sets up and fires off a HTTP/HTTPS request using the node.js API.

      // @private
      // This method contains the bulk of the XMLHttpRequest#send() implementation,
      // and is also used to issue new HTTP requests when handling HTTP redirects.

      // @see http://www.w3.org/TR/XMLHttpRequest/#infrastructure-for-the-send()-method
      _sendHxxpRequest() {
        var agent, hxxp, request;
        if (this._url.protocol === 'http:') {
          hxxp = http;
          agent = this.nodejsHttpAgent;
        } else {
          hxxp = https;
          agent = this.nodejsHttpsAgent;
        }
        request = hxxp.request({
          hostname: this._url.hostname,
          port: this._url.port,
          path: this._url.path,
          auth: this._url.auth,
          method: this._method,
          headers: this._headers,
          agent: agent
        });
        this._request = request;
        if (this.timeout) {
          request.setTimeout(this.timeout, () => {
            return this._onHttpTimeout(request);
          });
        }
        request.on('response', (response) => {
          return this._onHttpResponse(request, response);
        });
        request.on('error', (error) => {
          return this._onHttpRequestError(request, error);
        });
        this.upload._startUpload(request);
        if (this._request === request) { // An http error might have already fired.
          this._dispatchProgress('loadstart');
        }
        return void 0;
      }

      // Fills in the restricted HTTP headers with default values.

      // This is called right before the HTTP request is sent off.

      // @private
      // @return {undefined} undefined
      _finalizeHeaders() {
        var base;
        this._headers['Connection'] = 'keep-alive';
        this._headers['Host'] = this._url.host;
        if (this._anonymous) {
          this._headers['Referer'] = 'about:blank';
        }
        (base = this._headers)['User-Agent'] || (base['User-Agent'] = this._userAgent);
        this.upload._finalizeHeaders(this._headers, this._loweredHeaders);
        return void 0;
      }

      // Called when the headers of an HTTP response have been received.

      // @private
      // @param {http.ClientRequest} request the node.js ClientRequest instance that
      //   produced this response
      // @param {http.ClientResponse} response the node.js ClientResponse instance
      //   passed to
      _onHttpResponse(request, response) {
        var lengthString;
        if (this._request !== request) {
          return;
        }
        // Transparent redirection handling.
        switch (response.statusCode) {
          case 301:
          case 302:
          case 303:
          case 307:
          case 308:
            this._url = this._parseUrl(response.headers['location']);
            this._method = 'GET';
            if ('content-type' in this._loweredHeaders) {
              delete this._headers[this._loweredHeaders['content-type']];
              delete this._loweredHeaders['content-type'];
            }
            // XMLHttpRequestUpload#_finalizeHeaders() sets Content-Type directly.
            if ('Content-Type' in this._headers) {
              delete this._headers['Content-Type'];
            }
            // Restricted headers can't be set by the user, no need to check
            // loweredHeaders.
            delete this._headers['Content-Length'];
            this.upload._reset();
            this._finalizeHeaders();
            this._sendHxxpRequest();
            return;
        }
        this._response = response;
        this._response.on('data', (data) => {
          return this._onHttpResponseData(response, data);
        });
        this._response.on('end', () => {
          return this._onHttpResponseEnd(response);
        });
        this._response.on('close', () => {
          return this._onHttpResponseClose(response);
        });
        this.responseURL = this._url.href.split('#')[0];
        this.status = this._response.statusCode;
        this.statusText = http.STATUS_CODES[this.status];
        this._parseResponseHeaders(response);
        if (lengthString = this._responseHeaders['content-length']) {
          this._totalBytes = parseInt(lengthString);
          this._lengthComputable = true;
        } else {
          this._lengthComputable = false;
        }
        return this._setReadyState(XMLHttpRequest.HEADERS_RECEIVED);
      }

      // Called when some data has been received on a HTTP connection.

      // @private
      // @param {http.ClientResponse} response the node.js ClientResponse instance
      //   that fired this event
      // @param {String, Buffer} data the data that has been received
      _onHttpResponseData(response, data) {
        if (this._response !== response) {
          return;
        }
        this._responseParts.push(data);
        this._loadedBytes += data.length;
        if (this.readyState !== XMLHttpRequest.LOADING) {
          this._setReadyState(XMLHttpRequest.LOADING);
        }
        return this._dispatchProgress('progress');
      }

      // Called when the HTTP request finished processing.

      // @private
      // @param {http.ClientResponse} response the node.js ClientResponse instance
      //   that fired this event
      _onHttpResponseEnd(response) {
        if (this._response !== response) {
          return;
        }
        this._parseResponse();
        this._request = null;
        this._response = null;
        this._setReadyState(XMLHttpRequest.DONE);
        this._dispatchProgress('load');
        return this._dispatchProgress('loadend');
      }

      // Called when the underlying HTTP connection was closed prematurely.

      // If this method is called, it will be called after or instead of
      // onHttpResponseEnd.

      // @private
      // @param {http.ClientResponse} response the node.js ClientResponse instance
      //   that fired this event
      _onHttpResponseClose(response) {
        var request;
        if (this._response !== response) {
          return;
        }
        request = this._request;
        this._setError();
        request.abort();
        this._setReadyState(XMLHttpRequest.DONE);
        this._dispatchProgress('error');
        return this._dispatchProgress('loadend');
      }

      // Called when the timeout set on the HTTP socket expires.

      // @private
      // @param {http.ClientRequest} request the node.js ClientRequest instance that
      //   fired this event
      _onHttpTimeout(request) {
        if (this._request !== request) {
          return;
        }
        this._setError();
        request.abort();
        this._setReadyState(XMLHttpRequest.DONE);
        this._dispatchProgress('timeout');
        return this._dispatchProgress('loadend');
      }

      // Called when something wrong happens on the HTTP socket

      // @private
      // @param {http.ClientRequest} request the node.js ClientRequest instance that
      //   fired this event
      // @param {Error} error emitted exception
      _onHttpRequestError(request, error) {
        if (this._request !== request) {
          return;
        }
        this._setError();
        request.abort();
        this._setReadyState(XMLHttpRequest.DONE);
        this._dispatchProgress('error');
        return this._dispatchProgress('loadend');
      }

      // Fires an XHR progress event.

      // @private
      // @param {String} eventType one of the XHR progress event types, such as
      //   'load' and 'progress'
      _dispatchProgress(eventType) {
        var event;
        event = new ProgressEvent(eventType);
        event.lengthComputable = this._lengthComputable;
        event.loaded = this._loadedBytes;
        event.total = this._totalBytes;
        this.dispatchEvent(event);
        return void 0;
      }

      // Sets up the XHR to reflect the fact that an error has occurred.

      // The possible errors are a network error, a timeout, or an abort.

      // @private
      _setError() {
        this._request = null;
        this._response = null;
        this._responseHeaders = null;
        this._responseParts = null;
        return void 0;
      }

      // Parses a request URL string.

      // @private
      // This method is a thin wrapper around url.parse() that normalizes HTTP
      // user/password credentials. It is used to parse the URL string passed to
      // XMLHttpRequest#open() and the URLs in the Location headers of HTTP redirect
      // responses.

      // @param {String} urlString the URL to be parsed
      // @return {Object} parsed URL
      _parseUrl(urlString) {
        var absoluteUrlString, index, password, user, xhrUrl;
        if (this.nodejsBaseUrl === null) {
          absoluteUrlString = urlString;
        } else {
          absoluteUrlString = url.resolve(this.nodejsBaseUrl, urlString);
        }
        xhrUrl = url.parse(absoluteUrlString, false, true);
        xhrUrl.hash = null;
        if (xhrUrl.auth && ((typeof user !== "undefined" && user !== null) || (typeof password !== "undefined" && password !== null))) {
          index = xhrUrl.auth.indexOf(':');
          if (index === -1) {
            if (!user) {
              user = xhrUrl.auth;
            }
          } else {
            if (!user) {
              user = xhrUrl.substring(0, index);
            }
            if (!password) {
              password = xhrUrl.substring(index + 1);
            }
          }
        }
        if (user || password) {
          xhrUrl.auth = `${user}:${password}`;
        }
        return xhrUrl;
      }

      // Reads the headers from a node.js ClientResponse instance.

      // @private
      // @param {http.ClientResponse} response the response whose headers will be
      //   imported into this XMLHttpRequest's state
      // @return {undefined} undefined
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
      // @see http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
      _parseResponseHeaders(response) {
        var loweredName, name, ref, value;
        this._responseHeaders = {};
        ref = response.headers;
        for (name in ref) {
          value = ref[name];
          loweredName = name.toLowerCase();
          if (this._privateHeaders[loweredName]) {
            continue;
          }
          if (this._mimeOverride !== null && loweredName === 'content-type') {
            value = this._mimeOverride;
          }
          this._responseHeaders[loweredName] = value;
        }
        if (this._mimeOverride !== null && !('content-type' in this._responseHeaders)) {
          this._responseHeaders['content-type'] = this._mimeOverride;
        }
        return void 0;
      }

      // Sets the response and responseText properties when an XHR completes.

      // @private
      // @return {undefined} undefined
      _parseResponse() {
        var arrayBuffer, buffer, i, j, jsonError, ref, view;
        if (Buffer.concat) {
          buffer = Buffer.concat(this._responseParts);
        } else {
          // node 0.6
          buffer = this._concatBuffers(this._responseParts);
        }
        this._responseParts = null;
        switch (this.responseType) {
          case 'text':
            this._parseTextResponse(buffer);
            break;
          case 'json':
            this.responseText = null;
            try {
              this.response = JSON.parse(buffer.toString('utf-8'));
            } catch (error1) {
              jsonError = error1;
              this.response = null;
            }
            break;
          case 'buffer':
            this.responseText = null;
            this.response = buffer;
            break;
          case 'arraybuffer':
            this.responseText = null;
            arrayBuffer = new ArrayBuffer(buffer.length);
            view = new Uint8Array(arrayBuffer);
            for (i = j = 0, ref = buffer.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
              view[i] = buffer[i];
            }
            this.response = arrayBuffer;
            break;
          default:
            // TODO(pwnall): content-base detection
            this._parseTextResponse(buffer);
        }
        return void 0;
      }

      // Sets response and responseText for a 'text' response type.

      // @private
      // @param {Buffer} buffer the node.js Buffer containing the binary response
      // @return {undefined} undefined
      _parseTextResponse(buffer) {
        var e;
        try {
          this.responseText = buffer.toString(this._parseResponseEncoding());
        } catch (error1) {
          e = error1;
          // Unknown encoding.
          this.responseText = buffer.toString('binary');
        }
        this.response = this.responseText;
        return void 0;
      }

      // Figures out the string encoding of the XHR's response.

      // This is called to determine the encoding when responseText is set.

      // @private
      // @return {String} a string encoding, e.g. 'utf-8'
      _parseResponseEncoding() {
        var contentType, encoding, match;
        encoding = null;
        if (contentType = this._responseHeaders['content-type']) {
          if (match = /\;\s*charset\=(.*)$/.exec(contentType)) {
            return match[1];
          }
        }
        return 'utf-8';
      }

      // Buffer.concat implementation for node 0.6.

      // @private
      // @param {Array<Buffer>} buffers the buffers whose contents will be merged
      // @return {Buffer} same as Buffer.concat(buffers) in node 0.8 and above
      _concatBuffers(buffers) {
        var buffer, j, k, len, len1, length, target;
        if (buffers.length === 0) {
          return Buffer.alloc(0);
        }
        if (buffers.length === 1) {
          return buffers[0];
        }
        length = 0;
        for (j = 0, len = buffers.length; j < len; j++) {
          buffer = buffers[j];
          length += buffer.length;
        }
        target = Buffer.alloc(length);
        length = 0;
        for (k = 0, len1 = buffers.length; k < len1; k++) {
          buffer = buffers[k];
          buffer.copy(target, length);
          length += buffer.length;
        }
        return target;
      }

    };

    // @property {function(ProgressEvent)} DOM level 0-style handler for the
    //   'readystatechange' event
    XMLHttpRequest.prototype.onreadystatechange = null;

    // @property {Number} the current state of the XHR object
    // @see http://www.w3.org/TR/XMLHttpRequest/#states
    XMLHttpRequest.prototype.readyState = null;

    // @property {String, ArrayBuffer, Buffer, Object} processed XHR response
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-response-attribute
    XMLHttpRequest.prototype.response = null;

    // @property {String} response string, if responseType is '' or 'text'
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
    XMLHttpRequest.prototype.responseText = null;

    // @property {String} sets the parsing method for the XHR response
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute
    XMLHttpRequest.prototype.responseType = null;

    // @property {Number} the HTTP
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-status-attribute
    XMLHttpRequest.prototype.status = null;

    // @property {Number} milliseconds to wait for the request to complete
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
    XMLHttpRequest.prototype.timeout = null;

    // @property {XMLHttpRequestUpload} the associated upload information
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-upload-attribute
    XMLHttpRequest.prototype.upload = null;

    // readyState value before XMLHttpRequest#open() is called
    XMLHttpRequest.prototype.UNSENT = 0;

    // readyState value before XMLHttpRequest#open() is called
    XMLHttpRequest.UNSENT = 0;

    // readyState value after XMLHttpRequest#open() is called, and before
    //   XMLHttpRequest#send() is called; XMLHttpRequest#setRequestHeader() can be
    //   called in this state
    XMLHttpRequest.prototype.OPENED = 1;

    // readyState value after XMLHttpRequest#open() is called, and before
    //   XMLHttpRequest#send() is called; XMLHttpRequest#setRequestHeader() can be
    //   called in this state
    XMLHttpRequest.OPENED = 1;

    // readyState value after redirects have been followed and the HTTP headers of
    //   the final response have been received
    XMLHttpRequest.prototype.HEADERS_RECEIVED = 2;

    // readyState value after redirects have been followed and the HTTP headers of
    //   the final response have been received
    XMLHttpRequest.HEADERS_RECEIVED = 2;

    // readyState value when the response entity body is being received
    XMLHttpRequest.prototype.LOADING = 3;

    // readyState value when the response entity body is being received
    XMLHttpRequest.LOADING = 3;

    // readyState value after the request has been completely processed
    XMLHttpRequest.prototype.DONE = 4;

    // readyState value after the request has been completely processed
    XMLHttpRequest.DONE = 4;

    // @property {http.Agent} the agent option passed to HTTP requests

    // NOTE: this is not in the XMLHttpRequest API, and will not work in browsers.
    // It is a stable node-xhr2 API that is useful for testing & going through
    // web-proxies.
    XMLHttpRequest.prototype.nodejsHttpAgent = http.globalAgent;

    // @property {https.Agent} the agent option passed to HTTPS requests

    // NOTE: this is not in the XMLHttpRequest API, and will not work in browsers.
    // It is a stable node-xhr2 API that is useful for testing & going through
    // web-proxies.
    XMLHttpRequest.prototype.nodejsHttpsAgent = https.globalAgent;

    // @property {String} the base URL that relative URLs get resolved to

    // NOTE: this is not in the XMLHttpRequest API, and will not work in browsers.
    // Its browser equivalent is the base URL of the document associated with the
    // Window object. It is a stable node-xhr2 API provided for libraries such as
    // Angular Universal.
    XMLHttpRequest.prototype.nodejsBaseUrl = null;

    // HTTP methods that are disallowed in the XHR spec.

    // @private
    // @see Step 6 in http://www.w3.org/TR/XMLHttpRequest/#the-open()-method
    XMLHttpRequest.prototype._restrictedMethods = {
      CONNECT: true,
      TRACE: true,
      TRACK: true
    };

    // HTTP request headers that are disallowed in the XHR spec.

    // @private
    // @see Step 5 in
    //   http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
    XMLHttpRequest.prototype._restrictedHeaders = {
      'accept-charset': true,
      'accept-encoding': true,
      'access-control-request-headers': true,
      'access-control-request-method': true,
      connection: true,
      'content-length': true,
      cookie: true,
      cookie2: true,
      date: true,
      dnt: true,
      expect: true,
      host: true,
      'keep-alive': true,
      origin: true,
      referer: true,
      te: true,
      trailer: true,
      'transfer-encoding': true,
      upgrade: true,
      via: true
    };

    // HTTP response headers that should not be exposed according to the XHR spec.

    // @private
    // @see Step 3 in
    //     http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
    XMLHttpRequest.prototype._privateHeaders = {
      'set-cookie': true,
      'set-cookie2': true
    };

    // The default value of the User-Agent header.
    XMLHttpRequest.prototype._userAgent = `Mozilla/5.0 (${os.type()} ${os.arch()}) ` + `node.js/${process.versions.node} v8/${process.versions.v8}`;

    return XMLHttpRequest;

  }).call(this);

  // XMLHttpRequest is the result of require('node-xhr2').
  module.exports = XMLHttpRequest;

  // Make node-xhr2 work as a drop-in replacement for libraries that promote the
  // following usage pattern:
  //     var XMLHttpRequest = require('xhr-library-name').XMLHttpRequest
  XMLHttpRequest.XMLHttpRequest = XMLHttpRequest;

  // This file defines the custom errors used in the XMLHttpRequest specification.

    // Thrown if the XHR security policy is violated.
  SecurityError = class SecurityError extends Error {
    // @private
    constructor() {
      super();
    }

  };

  // Thrown if the XHR security policy is violated.
  XMLHttpRequest.SecurityError = SecurityError;

  // Usually thrown if the XHR is in the wrong readyState for an operation.
  InvalidStateError = class InvalidStateError extends Error {
    // @private
    constructor() {
      super();
    }

  };

  // Usually thrown if the XHR is in the wrong readyState for an operation.
  InvalidStateError = class InvalidStateError extends Error {};

  XMLHttpRequest.InvalidStateError = InvalidStateError;

  // Thrown if there is a problem with the URL passed to the XHR.
  NetworkError = class NetworkError extends Error {
    // @private
    constructor() {
      super();
    }

  };

  // Thrown if parsing URLs errors out.
  XMLHttpRequest.SyntaxError = SyntaxError;

  SyntaxError = class SyntaxError extends Error {
    // @private:
    constructor() {
      super();
    }

  };

  ProgressEvent = (function() {
    // http://xhr.spec.whatwg.org/#interface-progressevent
    class ProgressEvent {
      // Creates a new event.

      // @param {String} type the event type, e.g. 'readystatechange'; must be
      //   lowercased
      constructor(type) {
        this.type = type;
        this.target = null;
        this.currentTarget = null;
        this.lengthComputable = false;
        this.loaded = 0;
        this.total = 0;
      }

    };

    // Getting the time from the OS is expensive, skip on that for now.
    // @timeStamp = Date.now()

    // @property {Boolean} for compatibility with DOM events
    ProgressEvent.prototype.bubbles = false;

    // @property {Boolean} for fompatibility with DOM events
    ProgressEvent.prototype.cancelable = false;

    // @property {XMLHttpRequest} the request that caused this event
    ProgressEvent.prototype.target = null;

    // @property {Number} number of bytes that have already been downloaded or
    //   uploaded
    ProgressEvent.prototype.loaded = null;

    // @property {Boolean} true if the Content-Length response header is available
    //   and the value of the event's total property is meaningful
    ProgressEvent.prototype.lengthComputable = null;

    // @property {Number} number of bytes that will be downloaded or uploaded by
    //   the request that fired the event
    ProgressEvent.prototype.total = null;

    return ProgressEvent;

  }).call(this);

  // The XHR spec exports the ProgressEvent constructor.
  XMLHttpRequest.ProgressEvent = ProgressEvent;

  // @see http://xhr.spec.whatwg.org/#interface-xmlhttprequest
  XMLHttpRequestUpload = class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
    // @private
    // @param {XMLHttpRequest} the XMLHttpRequest that this upload object is
    //   associated with
    constructor(request) {
      super();
      this._request = request;
      this._reset();
    }

    // Sets up this Upload to handle a new request.

    // @private
    // @return {undefined} undefined
    _reset() {
      this._contentType = null;
      this._body = null;
      return void 0;
    }

    // Implements the upload-related part of the send() XHR specification.

    // @private
    // @param {?String, ?Buffer, ?ArrayBufferView} data the argument passed to
    //   XMLHttpRequest#send()
    // @return {undefined} undefined
    // @see step 4 of http://www.w3.org/TR/XMLHttpRequest/#the-send()-method
    _setData(data) {
      var body, i, j, k, offset, ref, ref1, view;
      if (typeof data === 'undefined' || data === null) {
        return;
      }
      if (typeof data === 'string') {
        // DOMString
        if (data.length !== 0) {
          this._contentType = 'text/plain;charset=UTF-8';
        }
        this._body = Buffer.from(data, 'utf8');
      } else if (Buffer.isBuffer(data)) {
        // node.js Buffer
        this._body = data;
      } else if (data instanceof ArrayBuffer) {
        // ArrayBuffer arguments were supported in an old revision of the spec.
        body = Buffer.alloc(data.byteLength);
        view = new Uint8Array(data);
        for (i = j = 0, ref = data.byteLength; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          body[i] = view[i];
        }
        this._body = body;
      } else if (data.buffer && data.buffer instanceof ArrayBuffer) {
        // ArrayBufferView
        body = Buffer.alloc(data.byteLength);
        offset = data.byteOffset;
        view = new Uint8Array(data.buffer);
        for (i = k = 0, ref1 = data.byteLength; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
          body[i] = view[i + offset];
        }
        this._body = body;
      } else {
        // NOTE: diverging from the XHR specification of coercing everything else
        //       to Strings via toString() because that behavior masks bugs and is
        //       rarely useful
        throw new Error(`Unsupported send() data ${data}`);
      }
      return void 0;
    }

    // Updates the HTTP headers right before the request is sent.

    // This is used to set data-dependent headers such as Content-Length and
    // Content-Type.

    // @private
    // @param {Object<String, String>} headers the HTTP headers to be sent
    // @param {Object<String, String>} loweredHeaders maps lowercased HTTP header
    //   names (e.g., 'content-type') to the actual names used in the headers
    //   parameter (e.g., 'Content-Type')
    // @return {undefined} undefined
    _finalizeHeaders(headers, loweredHeaders) {
      if (this._contentType) {
        if (!('content-type' in loweredHeaders)) {
          headers['Content-Type'] = this._contentType;
        }
      }
      if (this._body) {
        // Restricted headers can't be set by the user, no need to check
        // loweredHeaders.
        headers['Content-Length'] = this._body.length.toString();
      }
      return void 0;
    }

    // Starts sending the HTTP request data.

    // @private
    // @param {http.ClientRequest} request the HTTP request
    // @return {undefined} undefined
    _startUpload(request) {
      if (this._body) {
        request.write(this._body);
      }
      request.end();
      return void 0;
    }

  };

  // Export the XMLHttpRequestUpload constructor.
  XMLHttpRequest.XMLHttpRequestUpload = XMLHttpRequestUpload;

}).call(this);


/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
function toParams(data_js) {
    var form_data = [];
    for ( var key in data_js ) {
        form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
    }

    return form_data.join("&");
}

var XMLHttpRequest = __nccwpck_require__(186);
var core = __nccwpck_require__(966);

var data_js = {
    "access_token": core.getInput("postmail_secret")
};

var request = new XMLHttpRequest();

data_js['subject'] = 'Resultado del workflow ejecutado';
data_js['text'] = "Se ha realizado un push en la rama main que ha provocado la ejecución del workflow githubActions_exercise_workflow con los siguientes resultados:\n- linter_job:" + core.getInput("linter_result") + "\n- cypress_job: " + core.getInput("cypress_result") + "\n- add_badge_job: " + core.getInput("add_badge_result") + "\n- deploy_job: " + core.getInput("deploy_result");

var params = toParams(data_js);

request.open("POST", "https://postmail.invotes.com/send", true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.send(params);
})();

module.exports = __webpack_exports__;
/******/ })()
;