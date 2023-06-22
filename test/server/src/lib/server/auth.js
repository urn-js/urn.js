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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.layout = exports.hooks = void 0;
const lucia_auth_1 = __importDefault(require("lucia-auth"));
const adapter_prisma_1 = __importDefault(require("@lucia-auth/adapter-prisma"));
const db_1 = __importDefault(require("./db"));
const middleware_1 = require("lucia-auth/middleware");
const environment_1 = require("$app/environment");
const kit_1 = require("@sveltejs/kit");
const auth = (0, lucia_auth_1.default)({
    adapter: (0, adapter_prisma_1.default)(db_1.default),
    middleware: (0, middleware_1.sveltekit)(),
    env: environment_1.dev ? "DEV" : "PROD",
    experimental: {
        debugMode: true
    }
});
exports.auth = auth;
function hooks() {
    return ({ event, resolve }) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.locals.auth = {
            basic: auth.handleRequest(event),
            header: handleHeaders(event, "x-lucia")
        };
        console.log(event.route);
        if ((_a = event.route.id) === null || _a === void 0 ? void 0 : _a.startsWith("/(api)")) {
            const isAuth = yield event.locals.auth.header.validate();
            if (isAuth) {
                event.locals.API.user = auth.getSessionUser(isAuth.sessionId);
            }
            else {
                throw (0, kit_1.error)(401, "Bearer x-lucia not provided");
            }
        }
        return resolve(event);
    });
}
exports.hooks = hooks;
function layout() {
    return (request) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { locals } = request;
        const lucia = yield locals.auth.basic.validateUser();
        return {
            user: yield lucia.user,
            session: (_a = lucia.session) === null || _a === void 0 ? void 0 : _a.sessionId,
            pathname: request.url.pathname
        };
    });
}
exports.layout = layout;
function handleHeaders(event, header) {
    let validatePromise = null;
    return {
        validate() {
            if (!validatePromise) {
                validatePromise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const sessionId = (_a = event.request.headers.get(header)) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                    if ((!sessionId) || sessionId.length === 0) {
                        return resolve(null);
                    }
                    try {
                        const session = yield auth.validateSession(sessionId);
                        return resolve(session);
                    }
                    catch (_b) {
                        return resolve(null);
                    }
                }));
            }
            return validatePromise;
        }
    };
}
exports.default = auth;
