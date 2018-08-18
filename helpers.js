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
}

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