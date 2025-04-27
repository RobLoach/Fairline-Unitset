const fs = require('fs')
const jsonc = require('jsonc');
const sortArray = require('sort-array');

const files = [
    'units-civ4.json',
    'units-civ5-vanilla.json',
    'units-civ5-kings.json',
    'units-rekmod.json',
    'units-civ6.json'
]

function checkArrayForObjectWithValue(array, property, value) {
    if (!Array.isArray(array)) {
        throw new Error("The input is not an array.");
    }

    return array.some(obj => obj && obj.hasOwnProperty(property) && obj[property] === value);
}

let units = []

for (let file of files) {
    const contents = fs.readFileSync(file, 'utf8')
    let unitcontents = jsonc.parse(contents)

    for (let unit of unitcontents) {
        if (!checkArrayForObjectWithValue(units, 'name', unit.name)) {
        //if (!units.includes(unit.name)) {
            units.push({
                name: unit.name,
                source: file.replace('units-', '').replace('.json', '')
            })
        }
    }
}

units = sortArray(units, {
    by: 'name'
})

let output = "# Units\n\n| Name | Mod | Image | Color 1 | Color 2 |\n| :--- | :---: | :---: | :---: | :---: |\n"

let imageCount = 0
let colorCount = 0

let yes = ':white_check_mark:'
let no = ':black_square_button:'
for (let unit of units) {
    let image = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit.name}.png`) ? yes : no
    let color1 = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit.name}-1.png`) ? yes : no
    let color2 = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit.name}-2.png`) ? yes : no
    
    if (image == yes) {
        imageCount++
    }
    if (color1 == yes) {
        colorCount++
    }

    let wiki = `[![Wikipedia](Source/wiki.png)](https://en.wikipedia.org/wiki/${unit.name.replaceAll(' ', '%20')})`
    let civ5custom = `[![Civ 5 Customization Wiki](Source/fandom.png)](https://civilization-v-customisation.fandom.com/wiki/Special:Search?scope=internal&navigationSearch=true&query=${unit.name.replaceAll(' ', '%20')})`

    output += `| [${unit.name}](https://civilization.fandom.com/wiki/Special:Search?scope=internal&query=${unit.name.replaceAll(' ', '%20')}) ${civ5custom} ${wiki} | ${unit.source} | ${image} | ${color1} | ${color2} |\n`
}

output += `| **Total** | | ${Math.round((imageCount / units.length) * 100)}% | ${Math.round((colorCount / units.length) * 100)}% | ${Math.round((colorCount / units.length) * 100)}% |`

fs.writeFileSync('../Units.md', output)
