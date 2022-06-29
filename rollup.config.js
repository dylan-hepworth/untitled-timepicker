import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
const postcssUrl = require('postcss-url');
import fs from "fs-extra";
import path from "path";
import hasha from "hasha";

const IMAGES_RX = /\.(png|woff|woff2|ttf|jpe?g|gif|webp|svg)$/;

const OUT_DIR = "dist";

export default [
    {
        input: './src/index.js',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs'
            },
            {
                file: 'dist/index.es.js',
                format: 'es',
                exports: 'named'
            }
        ],
        plugins: [
            postcss({
                plugins: [
                    // extracts all url() assets into _assets folder, and replaces the url() to a relative path
                    // consumers of this package (e.g. webpack apps) will import the css and handle getting assets as well
                    postcssUrl({
                        url: (asset) => {
                            if (!IMAGES_RX.test(asset.url)) return asset.url;

                            const file = fs.readFileSync(asset.absolutePath);
                            const hash = hasha(file, { algorithm: "md5" });

                            const extname = path.extname(asset.absolutePath);

                            const hashedFileName = `${hash}${extname}`;
                            fs.ensureDirSync(path.join(OUT_DIR, "_assets"));

                            // we use the .replace because node will blow up if backslashes are used instead of forward slashes for the full file path
                            const hashedFilePath = path.join("_assets", hashedFileName).replace(/\\/g, '/');

                            fs.writeFileSync(path.join(OUT_DIR, hashedFilePath).replace(/\\/g, '/'), file);

                            return hashedFilePath;
                        },
                    }),
                ],
                extract: true,
                use: {
                    sass: { javascriptEnabled: true },
                    stylus: null,
                    less: null
                }
            }),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-react']
            }),
            external(),
            resolve(),
            commonjs()
        ]
    }

];