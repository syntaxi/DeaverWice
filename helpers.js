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

helpers.titleCase = function(string) {
    return string.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

helpers.powerPerks = {};
helpers.powerFlaws = {};
helpers.lifePerks = {};
helpers.lifeFlaws = {};

for (let key in DetailsTable) {
    if (DetailsTable.hasOwnProperty(key)) {
        const card = DetailsTable[key];
        if ('power' in card) {
            if ('flaw' in card['power']) {
                helpers.powerFlaws[card['power']['flaw'].title.toLowerCase()] = key;
            }
            if ('perk' in card['power']) {
                helpers.powerPerks[card['power']['perk'].title.toLowerCase()] = key;
            }
        }
        if ('life' in card) {
            if ('flaw' in card['life']) {
                helpers.lifeFlaws[card['life']['flaw'].title.toLowerCase()] = key;
            }
            if ('perk' in card['life']) {
                helpers.lifePerks[card['life']['perk'].title.toLowerCase()] = key;
            }
        }
    }
}

module.exports = helpers;