const {NavbarParser} = require('../src/app/content/navbarParser.js');
const sampleParam = require('./navBar_param.json');
const realParam = require('../src/app/content/navMenu.json');
const expectedRes = require('../__test__/navBar_expect_result.json');

describe('Happy Flows', () => {
    const parser_real = new NavbarParser(realParam);
    it('Get first layer', () => {
        const firstLayer = parser_real.getFirstLayer();
        expect(Array.isArray(firstLayer)).toBeTruthy();
        expect(firstLayer).toEqual(expectedRes[0]);
    });

    it('Get contents from the first layer', () => {
        const clickPath = "Home";
        const resItemList = parser_real.getItemListFrom(clickPath);
        expect(Array.isArray(resItemList)).toBeTruthy();
        expect(resItemList).toEqual(expectedRes[1]);
    })
})