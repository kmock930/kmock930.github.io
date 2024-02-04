const {NavbarParser} = require('../src/app/content/navbarParser.js');
const sampleParam = require('./navBar_param.json');
const realParam = require('../src/app/content/navMenu.json');
const expectedRes = require('../__test__/navBar_expect_result.json');

const parser_real = new NavbarParser(realParam);

describe('Happy Flows', () => {
    it('Real Case - get first layer', () => {
        const firstLayer = parser_real.getFirstLayer();
        expect(Array.isArray(firstLayer)).toBeTruthy();
        expect(firstLayer).toEqual(expectedRes[0]);
    })
})