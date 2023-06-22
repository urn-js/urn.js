import lucia from 'lucia-auth';
import type { Session } from 'lucia-auth';
import prisma from "@lucia-auth/adapter-prisma";
import database from "./db";
import { sveltekit } from "lucia-auth/middleware";
import { dev } from "$app/environment";
import { error, type Handle, type RequestEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from '../../routes/$types';
const auth = lucia({
    adapter: prisma(database),
    middleware: sveltekit(),
    env: dev?"DEV":"PROD",
    experimental: {
        debugMode: true
    }
})

type Auth = typeof auth;

export function hooks(): Handle {
    return async ({ event, resolve }) => {
        event.locals.auth = {
            basic: auth.handleRequest(event),
            header: handleHeaders(event, "x-lucia")
        }
        console.log(event.route)
        if(event.route.id?.startsWith("/(api)")) {
            const isAuth = await event.locals.auth.header.validate()
            if(isAuth) {
                event.locals.API.user = auth.getSessionUser(isAuth.sessionId)
            } else {
                throw error(401, "Bearer x-lucia not provided")
            }
        }
        return resolve(event);
    }
}

export function layout(): LayoutServerLoad {
    return async (request) => {
        const { locals } = request
        const lucia = await locals.auth.basic.validateUser()
        return {
            user: await lucia.user,
            session: lucia.session?.sessionId,
            pathname: request.url.pathname
        }
    }
}

function handleHeaders(event: RequestEvent, header: string): HeaderAuthRequest {
    let validatePromise: Promise<Session | null> | null = null
    return {
        validate() {
            if(!validatePromise) {
                validatePromise = new Promise(async (resolve) => {
                    const sessionId = event.request.headers.get(header)?.replace("Bearer ", "");
                    if((!sessionId) || sessionId.length === 0) {
                        return resolve(null)
                    }
                    try {
                        const session = await auth.validateSession(sessionId)
                        return resolve(session)
                    } catch {
                        return resolve(null)
                    }
                })
            }
            return validatePromise
        }
    }
}

type HeaderAuthRequest = {
    validate(): Promise<Session | null>
}

export default auth;
export {
    auth,
    type Auth,
    type HeaderAuthRequest
}