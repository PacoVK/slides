const fs = require(`fs-extra`);
const path = require(`path`);
const chokidar = require(`chokidar`);
const asciidoctor = require(`@asciidoctor/core`)();
require(`@asciidoctor/reveal.js`).register();
require('asciidoctor-kroki').register(asciidoctor.Extensions);
require('asciidoctor-emoji').register(asciidoctor.Extensions);

const stage = process.argv[2];
var isDev = true;

if(stage === "build") {
    isDev = false;
    console.log("Running build only")
}

const slideDirs = fs
    .readdirSync(`.`)
    .filter(entry => fs.lstatSync(entry).isDirectory())
    .filter(dir => !dir.startsWith(`_`))
    .filter(dir => !dir.startsWith(`.`))
    .filter(dir => dir !== `docs`)
    .filter(dir => dir !== `node_modules`)

const contains = (parent, child) => {
    // https://stackoverflow.com/a/45242825/2525313
    const relative = path.relative(parent, child)
    return relative && !path.isAbsolute(relative) && !relative.startsWith(`..`)
}

const processChange = file => {
    const dir = slideDirs.find(dir => contains(dir, file))
    if (dir) {
        console.log(` - file ${file} changed; regenerating ${dir}`)
        createPresentation(dir)
    } else
        console.log(` - file ${file} changed; does not belong to a slide dir`)
}

const createPresentation = dir => {
    if(fs.pathExistsSync(`${dir}/styles`)){
        fs.copySync(`${dir}/styles`, `docs/${dir}/styles`);
    }
    if(fs.pathExistsSync(`${dir}/plugins`)){
        fs.copySync(`${dir}/plugins`, `docs/${dir}/plugins`);
    }
    if(fs.pathExistsSync(`${dir}/images`)){
        fs.copySync(`${dir}/images`, `docs/${dir}/images`);
    }
    fs.copySync(`_shared_images`, `docs/${dir}/images`);
    const options = {
        safe: `unsafe`,
        backend: `revealjs`,
        to_file: `docs/${dir}/index.html`,
    }
    asciidoctor.convertFile(`${dir}/_presentation.adoc`, options)
}

console.log(`Found presentations ${slideDirs.map(name => `'${name}'`).join(`, `)}.`)

console.log(`\nGenerating all presentations:`)
slideDirs.forEach(dir => {
    console.log(` - generating ${dir}`)
    createPresentation(dir)
})

if(isDev){
    console.log(`\nObserving presentations...`)
    chokidar
        .watch(slideDirs, { ignoreInitial: true })
        .on(`all`, (event, path) => { processChange(path) })
}
