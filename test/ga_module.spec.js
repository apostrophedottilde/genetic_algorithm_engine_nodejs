const assert = require('assert'),
    gaEngine = require('../app/ga_engine'),
    pool = require('../app/genepool'),
    sinon    = require('sinon');

describe('ga module', () => {

    const randomNumberStub = sinon.stub(gaEngine, 'randomInRange');

    describe('crossover', () => {
        it('should swap a and b parts from each genome in pair', () => {
            const genome1 = '1111111100000000';
            const genome2 = '0000000011111111';
            randomNumberStub.returns(8);

            const actual = gaEngine.crossoverEquallySizedPair(genome1, genome2);

            assert.equal(actual.gen1, '1111111111111111');
            assert.equal(actual.gen2, '0000000000000000');
        });
    });

    describe('mutation', () => {
        it('should mutate random bit by flipping', () => {
            const genome = '1111111111111111';
            randomNumberStub.returns(4);

            const actual = gaEngine.mutation(genome);

            assert.equal(actual, '1111011111111111');
        });
    });

    describe('selection', () => {
        it('should select a single genome from genepool based on fitness', () => {
            sinon.stub(pool, 'genepool').returns(getGenepool());
            const genepool = pool.genepool;
            const fitnessFunction = (g) => { return 5 };
            const actual = gaEngine.selection(genepool, fitnessFunction);
            assert.equal(actual, '0000000000001111');
        })
    });

    describe('binary string to decimal conversion', () => {
        it("should return 65535 for a string of 1's", () => {
            const actual = gaEngine.binaryStringToDecimal('1111111111111111');
            assert.equal(actual, '65535');
        });

        it("should return 0 for a string of 0's", () => {
            const actual = gaEngine.binaryStringToDecimal('0000000000000000');
            assert.equal(actual, '0');
        });

        it("should return 15 for last 4 bits as 1's", () => {
            const actual = gaEngine.binaryStringToDecimal('0000000000001111');
            assert.equal(actual, '15');
        });

        it("should return 61440 for first 4 bits as 1's", () => {
            const actual = gaEngine.binaryStringToDecimal('1111000000000000');
            assert.equal(actual, '61440');
        })
    });

    function getGenepool() {
        return[
            '1111111111111111',
            '1111111111110000',
            '1111111100000000',
            '1111000000000000',
            '0000000000000000',
            '0000000000001111',
            '0000000011111111',
            '0000111111111111'
        ];
    }
});