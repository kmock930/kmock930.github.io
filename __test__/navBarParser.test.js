const {NavbarParser} = require('../src/app/content/navbarParser.js');
const sampleParam = require('./navBar_param.json');
const expectedRes = require('../__test__/navBar_expect_result.json');

describe('Happy Flows', () => {
    const param_sample = new NavbarParser(sampleParam);
    it('Get first layer', () => {
        const firstLayer = param_sample.getFirstLayer();
        expect(Array.isArray(firstLayer)).toBeTruthy();
        expect(firstLayer).toEqual(expectedRes[0]);
    });

    it('Get contents from the first layer', () => {
        const clickPath = "Home";
        const resItemList = param_sample.getItemListFrom(clickPath);
        expect(Array.isArray(resItemList)).toBeTruthy();
        expect(resItemList).toEqual(expectedRes[1]);
    })
})