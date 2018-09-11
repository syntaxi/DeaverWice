const helpers = {};
const DetailsTable = require("./data/details.json");
/**
 * Picks a random entry from a given list.
 *
 * @param list The list to pick from.
 * @returns {*} The item from the list.
 */
helpers.rollRandom = function (list) {
    switch (list.length) {
        case 0:
            return undefined;
        case 1:
            return list[0];
        default:
            return list[Math.floor(Math.random() * list.length)];
    }
};

helpers.titleCase = function (string) {
    return string.toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
};

helpers.wrapWithEndings = function (key) {
    if (key instanceof RegExp) {
        key = key.source;
    }
    if (key[0] !== "^") {
        key = "^" + key;
    }
    if (key[key.length - 1] !== "$") {
        key += "$";
    }
    return key
};

helpers.wonkyCase = function (text) {
    if (typeof text === "string") {
        text = text.split(/\s/);
    }
    let out = "";
    for (let j = 0; j < text.length; j++) {
        let shouldCapital = false;
        for (let i = 0; i < text[j].length; i++) {
            const char = text[j].charAt(i);
            if (!char.match(/\s/)) {
                /* If it's not whitespace, then think about flipping it */
                if (shouldCapital) {
                    out += char.toUpperCase();
                } else {
                    out += char.toLowerCase();
                }
                shouldCapital = !shouldCapital
            } else {
                /* If it is whitespace, just flip it.*/
                out += char;
            }
        }
        out += " ";
    }
    return out;
};

helpers.splitByLength = function (value, maxSize = 2000, maxBack = 20) {
    const output = [];
    let i = 0;
    while (i + maxSize <= value.length) {
        let size = maxSize;
        /* Find some whitespace to split at */
        while (!/\s/.test(value.charAt(i + size)) && size >= maxSize - maxBack) {
            size--;
        }
        /* If we couldn't find a whitespace, split at the limit */
        if (size <= maxSize - maxBack) {
            size = maxSize;
        }
        /* Split the string */
        output.push(value.substr(i, size).trim());
        i += size;
    }
    output.push(value.substring(i).trim());
    return output;
};

helpers.invertedDetails = {
    'life': {
        'perk': {},
        'flaw': {}
    },
    'power': {
        'perk': {},
        'flaw': {}
    }
};
const types = {"perk": true, "flaw": true};
const targets = {"life": true, "power": true};

for (let key in DetailsTable) {
    const card = DetailsTable[key];
    for (let target in targets) {
        if (target in card) {
            for (let type in types) {
                if (card[target][type]) {
                    helpers.invertedDetails[target][type][card[target][type].title.toLowerCase()] = key;
                }
            }
        }
    }
}

module.exports = helpers;