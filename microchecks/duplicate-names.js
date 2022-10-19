import {readdirSync, lstatSync} from 'fs';

const filenames = {};

function readDir(directory)
{
    for (const file of readdirSync(directory, 'utf8')) {
        if (file.match(/\.md$/i)) {
            filenames[file.toLowerCase()] = filenames[file.toLowerCase()] || 0;
            filenames[file.toLowerCase()]++;
        } else if (file!=="node_modules" && lstatSync(`${directory}/${file}`).isDirectory()) {
            readDir(`${directory}/${file}`);
        }
    }
}

readDir(process.cwd());
let error = false;
for (const file of Object.keys(filenames)) {
    if (filenames[file] > 1 && file!=="readme.md") {
        console.error(`${file} is used ${filenames[files]}x times.`);
        error = true;
    }
}

process.exit(error?1:0);
