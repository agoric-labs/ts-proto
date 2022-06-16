"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsPoetOpts = exports.optionsFromParameter = exports.defaultOptions = exports.ServiceOption = exports.OneofOption = exports.EnvOption = exports.DateOption = exports.LongOption = void 0;
var LongOption;
(function (LongOption) {
    LongOption["NUMBER"] = "number";
    LongOption["LONG"] = "long";
    LongOption["STRING"] = "string";
})(LongOption = exports.LongOption || (exports.LongOption = {}));
var DateOption;
(function (DateOption) {
    DateOption["DATE"] = "date";
    DateOption["STRING"] = "string";
    DateOption["TIMESTAMP"] = "timestamp";
})(DateOption = exports.DateOption || (exports.DateOption = {}));
var EnvOption;
(function (EnvOption) {
    EnvOption["NODE"] = "node";
    EnvOption["BROWSER"] = "browser";
    EnvOption["BOTH"] = "both";
})(EnvOption = exports.EnvOption || (exports.EnvOption = {}));
var OneofOption;
(function (OneofOption) {
    OneofOption["PROPERTIES"] = "properties";
    OneofOption["UNIONS"] = "unions";
})(OneofOption = exports.OneofOption || (exports.OneofOption = {}));
var ServiceOption;
(function (ServiceOption) {
    ServiceOption["GRPC"] = "grpc-js";
    ServiceOption["NICE_GRPC"] = "nice-grpc";
    ServiceOption["GENERIC"] = "generic-definitions";
    ServiceOption["DEFAULT"] = "default";
    ServiceOption["NONE"] = "none";
})(ServiceOption = exports.ServiceOption || (exports.ServiceOption = {}));
function defaultOptions() {
    return {
        context: false,
        snakeToCamel: ['json', 'keys'],
        forceLong: LongOption.NUMBER,
        useOptionals: 'none',
        useDate: DateOption.DATE,
        useMongoObjectId: false,
        oneof: OneofOption.PROPERTIES,
        esModuleInterop: false,
        fileSuffix: '',
        lowerCaseServiceMethods: false,
        outputEncodeMethods: true,
        outputJsonMethods: true,
        outputPartialMethods: true,
        outputTypeRegistry: false,
        stringEnums: false,
        constEnums: false,
        enumsAsLiterals: false,
        outputClientImpl: true,
        outputServices: [],
        returnObservable: false,
        addGrpcMetadata: false,
        metadataType: undefined,
        addNestjsRestParameter: false,
        nestJs: false,
        env: EnvOption.BOTH,
        unrecognizedEnum: true,
        exportCommonSymbols: true,
        outputSchema: false,
        onlyTypes: false,
        emitImportedFiles: true,
        useExactTypes: true,
        unknownFields: false,
        usePrototypeForDefaults: false,
        useJsonWireFormat: false,
    };
}
exports.defaultOptions = defaultOptions;
const nestJsOptions = {
    lowerCaseServiceMethods: true,
    outputEncodeMethods: false,
    outputJsonMethods: false,
    outputPartialMethods: false,
    outputClientImpl: false,
    useDate: DateOption.TIMESTAMP,
};
function optionsFromParameter(parameter) {
    const options = defaultOptions();
    if (parameter) {
        const parsed = parseParameter(parameter);
        if (parsed.nestJs) {
            Object.assign(options, nestJsOptions);
        }
        Object.assign(options, parsed);
    }
    // onlyTypes=true implies outputJsonMethods=false,outputEncodeMethods=false,outputClientImpl=false,nestJs=false
    if (options.onlyTypes) {
        options.outputJsonMethods = false;
        options.outputEncodeMethods = false;
        options.outputClientImpl = false;
        options.nestJs = false;
    }
    else if (!options.outputJsonMethods &&
        !options.outputEncodeMethods &&
        !options.outputClientImpl &&
        !options.nestJs) {
        options.onlyTypes = true;
    }
    // Treat forceLong=true as LONG
    if (options.forceLong === true) {
        options.forceLong = LongOption.LONG;
    }
    // Treat outputServices=false as NONE
    if (options.outputServices === false) {
        options.outputServices = [ServiceOption.NONE];
    }
    // Existing type-coercion inside parseParameter leaves a little to be desired.
    if (typeof options.outputServices == 'string') {
        options.outputServices = [options.outputServices];
    }
    if (options.outputServices.length == 0) {
        options.outputServices = [ServiceOption.DEFAULT];
    }
    if (options.useDate === true) {
        // Treat useDate=true as DATE
        options.useDate = DateOption.DATE;
    }
    else if (options.useDate === false) {
        // Treat useDate=false as TIMESTAMP
        options.useDate = DateOption.TIMESTAMP;
    }
    if (options.snakeToCamel === false) {
        options.snakeToCamel = [];
    }
    else if (options.snakeToCamel === true) {
        options.snakeToCamel = ['keys', 'json'];
    }
    else if (typeof options.snakeToCamel === 'string') {
        options.snakeToCamel = [options.snakeToCamel];
    }
    if (options.useJsonWireFormat) {
        if (!options.onlyTypes) {
            // useJsonWireFormat requires onlyTypes=true
            options.useJsonWireFormat = false;
        }
        else {
            // useJsonWireFormat implies stringEnums=true and useDate=string
            options.stringEnums = true;
            options.useDate = DateOption.STRING;
        }
    }
    return options;
}
exports.optionsFromParameter = optionsFromParameter;
// A very naive parse function, eventually could/should use iots/runtypes
function parseParameter(parameter) {
    const options = {};
    const pairs = parameter.split(',').map((s) => s.split('='));
    pairs.forEach(([key, _value]) => {
        const value = _value === 'true' ? true : _value === 'false' ? false : _value;
        if (options[key]) {
            options[key] = [options[key], value];
        }
        else {
            options[key] = value;
        }
    });
    return options;
}
function getTsPoetOpts(options) {
    return { forceModuleImport: ['protobufjs/minimal'] };
}
exports.getTsPoetOpts = getTsPoetOpts;