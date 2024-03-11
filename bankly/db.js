/** Database setup for jobly. */

/**
 * Upon initial run of test suite, was failing with:
 *   >>> ReferenceError: TextEncoder is not defined
 * Below is the polyfill for TextEncoder and TextDecoder
 *   >>> This fixed the error.
 */

// const { TextEncoder, TextDecoder } = require('util');
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

/**
 * Upon further evaluation, problem occurred because local dev dependency
 * jest interfered with my globally installed jest package.
 *   >>> Uninstalled local jest package, but left dependency listed in package.json
 */

const { Client } = require('pg');
const { DB_URI } = require('./config');

const client = new Client(DB_URI);

client.connect();

module.exports = client;
