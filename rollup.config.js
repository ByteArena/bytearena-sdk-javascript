import multiEntry from 'rollup-plugin-multi-entry';
import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';

import fs from 'fs';
const pkge = JSON.parse(fs.readFileSync('package.json', 'utf8'));

export default {
    "plugins": [
        multiEntry(),
        babel({
            "exclude": "node_modules/**"
        }),
        babili({
            "comments": false,
            "banner": "/* ByteArena Javascript SDK v" + pkge.version + "; License " + pkge.license + "; " + pkge.homepage + " */",
            "sourcemap": false
        })
    ],
    "entry": ['src/**/*.js'],
    "dest": "lib/bytearenasdk.browser.js",
    "format": "umd",
    "moduleName": "bytearenasdk",
    "sourceMap": true
}