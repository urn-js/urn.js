// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: {
				basic: import("lucia-auth").AuthRequest;
				header: import("$lib/server/auth").HeaderAuthRequest;
			};
			API: {
				user: any
			}
		}
	}
}


/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/auth").Auth;
		type UserAttributes = {
			username: string;
		};
	}
}

export {};
