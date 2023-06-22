#!/usr/bin/env node
import { copy } from 'fs-extra';
import path from 'node:path';
const findup = await import('find-up');
const { findUp } = findup
const ora = await import('ora');
const { oraPromise } = ora;
const thisdir = await findUp('package.json', { cwd: path.dirname(new URL(import.meta.url).pathname) });
const calldir = process.cwd()
console.log(thisdir, calldir)
async function clone() {
    await oraPromise(async (spinner) => {
        spinner.start("Cloning server source.")
        await copy(`${thisdir}/server`, `${calldir}/server`)
        spinner.succeed()
    }, {
        spinner: 'arc',
        color: 'cyan',
        indent: 4
    })
}

async function main() {
    await clone()
}

await main();