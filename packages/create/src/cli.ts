#!/usr/bin/env node
import { copy, writeJson, createFile } from 'fs-extra/esm';
import path from 'node:path';
import { Ora } from 'ora';
const findup = await import('find-up');
const { findUp } = findup
const ora = await import('ora');
const { oraPromise } = ora;
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const promisexec = promisify(exec)
// @ts-ignore
const thisdir = path.dirname(await findUp('package.json', { cwd: path.dirname(new URL(import.meta.url).pathname) }));
const calldir = process.cwd()

if(thisdir.startsWith(calldir)) throw new Error('Attempted to run create in node_modules, please run globaly')

async function clone(spinner: Ora) {
    spinner.start("Cloning server source.")
    await copy(`${thisdir}/server`, `${calldir}/server`)
    spinner.succeed("Cloned server source")
}

async function generateConfig(spinner: Ora) {
    spinner.start("Creating package.json")
    await createFile(`${calldir}/package.json`)
    await writeJson(`${calldir}/package.json`, {
        name: 'urn-app',
        scripts: {
            "build": "urnbuild"
        }
    }, {
        spaces: '   '
    })
    await promisexec("npm i @urn.js/create", {
        cwd: calldir
    }) // make sure we are always intalling the correct version.
    spinner.succeed("Created package.json")
    spinner.start("Creating urn.json")
    await createFile(`${calldir}/urn.json`)
    spinner.succeed("Created urn.json")
    spinner.start("Writing urn.json")
    await writeJson(`${calldir}/urn.json`, {
        features: []
    }, {
        spaces: '   '
    })
    spinner.succeed("Wrote urn.json")
}

async function main() {
    await oraPromise(async (spinner) => {
        await clone(spinner)
        await generateConfig(spinner)
        spinner.stop();
    }, {
        spinner: 'arc',
        color: 'cyan',
        indent: 4
    })
    console.log('Completed urn.js server generator')
}

await main();