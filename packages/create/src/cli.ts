#!/usr/bin/env node
import { copy, writeJSON, createFile } from 'fs-extra';
import path from 'node:path';
import { Ora } from 'ora';
const findup = await import('find-up');
const { findUp } = findup
const ora = await import('ora');
const { oraPromise } = ora;
// @ts-ignore
const thisdir = path.dirname(await findUp('package.json', { cwd: path.dirname(new URL(import.meta.url).pathname) }));
const calldir = process.cwd()

async function clone(spinner: Ora) {
    spinner.start("Cloning server source.")
    await copy(`${thisdir}/server`, `${calldir}/server`)
    spinner.succeed("Cloned server source")
}

async function generateConfig(spinner: Ora) {
    spinner.start("Creating package.json")
    await createFile(`${calldir}/package.json`)
    await writeJSON(`${calldir}/package.json`, {
        name: 'urn-app',
        scripts: {
            "build": "urnbuild"
        }
    })
    spinner.succeed("Created package.json")
    spinner.start("Creating urn.json")
    await createFile(`${calldir}/urn.json`)
    spinner.succeed("Created urn.json")
    spinner.start("Writing urn.json")
    await writeJSON(`${calldir}/urn.json`, {
        features: []
    })
    spinner.succeed("Wrote urn.json")
}

async function main() {
    await oraPromise(async (spinner) => {
        await clone(spinner)
        await generateConfig(spinner)
    }, {
        spinner: 'arc',
        color: 'cyan',
        indent: 4
    })
    console.log('Completed urn.js server generator')
}

await main();