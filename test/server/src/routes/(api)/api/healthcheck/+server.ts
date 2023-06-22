import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    return json({
        user: locals.API.user
    }, {
        status: 200
    })
}