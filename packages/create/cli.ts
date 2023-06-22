#!/usr/bin/env node
import prompt from 'prompt';
import { copy } from 'fs-extra';
const pkg = await import('ora')
const { oraPromise } = pkg
console.log(import.meta)
async function clone() {
    await oraPromise(async (spinner) => {
        spinner.start("Cloning server source.")
        await copy('./server', '/dev/null')
        spinner.succeed()
    }, {
        spinner: 'arc',
        color: 'cyan',
        indent: 4
    })
}