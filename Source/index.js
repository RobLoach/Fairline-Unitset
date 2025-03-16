const fs = require('fs')
const jsonc = require('jsonc');

const files = [
    'units-civ4.json',
    'units-civ5-vanilla.json',
    'units-civ5-kings.json',
    'units-rekmod.json'
]

let units = []

for (let file of files) {
    const contents = fs.readFileSync(file, 'utf8')
    let unitcontents = jsonc.parse(contents)

    for (let unit of unitcontents) {
        if (!units.includes(unit.name)) {
            units.push(unit.name)
        }
    }
}

units = units.sort()

let output = "# Units\n\n| Name | Image | Color 1 | Color 2 |\n| :--- | :---: | :---: | :---: |\n"

let imageCount = 0
let colorCount = 0

let yes = ':white_check_mark:'
let no = ':black_square_button:'
for (let unit of units) {
    let image = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit}.png`) ? yes : no
    let color1 = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit}-1.png`) ? yes : no
    let color2 = fs.existsSync(`../Images/TileSets/Fairline/Units/${unit}-2.png`) ? yes : no
    
    if (image == yes) {
        imageCount++
    }
    if (color1 == yes) {
        colorCount++
    }

    output += `| ${unit} | ${image} | ${color1} | ${color2} |\n`
}


output += `| Total | ${Math.round((imageCount / units.length) * 100)}% | ${Math.round((colorCount / units.length) * 100)}% | ${Math.round((colorCount / units.length) * 100)}% |`

fs.writeFileSync('../Units.md', output)
