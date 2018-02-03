const assert = require('assert'),
    gaEngine = require('../app/ga_engine'),
    pool = require('../app/genepool'),
    sinon    = require('sinon');

let sandbox;

describe('GA Engine', () => {

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox = sinon.sandbox.restore();
    });

    const randomNumberStub = sinon.stub(gaEngine, 'randomInRange');

    describe('crossover', () => {
        it('should swap a and b parts from each genome in pair', () => {
            const genome1 = '1111111100000000';
            const genome2 = '0000000011111111';
            randomNumberStub.returns(8);

            const actual = gaEngine.crossoverPair(genome1, genome2);

            assert.equal(actual.gen1, '1111111111111111');
            assert.equal(actual.gen2, '0000000000000000');
        });
    });

    describe('mutation', () => {
        it('should mutate random bit by flipping 1 to 0', () => {
            const genome = '1111111111111111';

            randomNumberStub.returns(4);

            const actual = gaEngine.mutateGenome(genome);

            assert.equal(actual, '1111011111111111');

        });

        it('should mutate random bit by flipping 0 to 1', () => {
            const genome = '0000000000000000';

            randomNumberStub.returns(4);

            const actual = gaEngine.mutateGenome(genome);

            assert.equal(actual, '0000100000000000');

        });
    });

    describe('selection', () => {
        it('should select a single genome from genepool based on fitness', () => {
            sinon.stub(pool, 'genepool').returns(getFirstGenerationGenepool());
            const genepool = pool.genepool;
            const fitnessFunction = (g) => 5;
            const actual = gaEngine.selection(genepool, fitnessFunction);
            assert.equal(actual, '0000000000001111');
        });

        it('should get the sum fitness score from the every genome in the genepool', () => {
            sinon.stub(pool, 'genepool').returns(getFirstGenerationGenepool());
            const actual = gaEngine.summedFitnessOfGenepool(firstGenerationGenepoolWithFitnessValues());
            assert.equal(actual, 262140);
        });

        it('should calculate fitness scores for each genome and return array of genome->fitness pair objects', () => {
            sinon.stub(pool, 'genepool').returns(getFirstGenerationGenepool());
            let genepool = pool.genepool;
            let fitnessFunction = (g) => gaEngine.binStringToDec(g);

            let actual = gaEngine.determineFitnessOfEachGenomeInGenepool(genepool, fitnessFunction);

            assert.equal(JSON.stringify(actual), JSON.stringify(firstGenerationGenepoolWithFitnessValues()));
        });

        it('should sort genomes by their fitness value to aid in rank selection', () => {

            let actual = gaEngine.sortGenepoolByReletiveFitnessPercentage(genepoolWithUnOrderedReletiveFitnessPercentages());

            assert.equal(JSON.stringify(actual), JSON.stringify([
                {genome: '0000000000000000', fitness: 0, percentage: 0},
                {genome: '0000000000001111', fitness: 15, percentage: 0.005722133211261158},
                {genome: '0000000011111111', fitness: 255, percentage: 0.09727626459143969},
                {genome: '0000111111111111', fitness: 4095, percentage: 1.5621423666742962},
                {genome: '1111000000000000', fitness: 61440, percentage: 23.437857633325702},
                {genome: '1111111100000000', fitness: 65280, percentage: 24.90272373540856},
                {genome: '1111111111110000', fitness: 65520, percentage: 24.99427786678874},
                {genome: '1111111111111111', fitness: 65535, percentage: 25}
                ]
               ));
        });

        it('should assign reletive fitness percentages to each genome', () => {

            const genepoolWithFitnesses = firstGenerationGenepoolWithFitnessValues();
            let actual = gaEngine.assignRelativeFitnessPercentagesToGenepool(genepoolWithFitnesses);

            assert.equal(JSON.stringify(actual), JSON.stringify([
                {genome: '1111111111111111', fitness: 65535, percentage: 25},
                {genome: '1111111111110000', fitness: 65520, percentage: 24.99427786678874},
                {genome: '1111111100000000', fitness: 65280, percentage: 24.90272373540856},
                {genome: '1111000000000000', fitness: 61440, percentage: 23.437857633325702},
                {genome: '0000000000000000', fitness: 0, percentage: 0},
                {genome: '0000000000001111', fitness: 15, percentage: 0.005722133211261158},
                {genome: '0000000011111111', fitness: 255, percentage: 0.09727626459143969},
                {genome: '0000111111111111', fitness: 4095, percentage: 1.5621423666742962}
            ]));
        });

        it('should select a genome from existing genepool based on a biasy of its fitness', () => {
            const genepoolWithFitnesses = genepoolWithUnOrderedReletiveFitnessPercentages();
            sandbox.stub(Math, 'random').returns(24.666666 / 100);

            let actual = gaEngine.makeBiasedSelection(genepoolWithFitnesses);

            assert.equal(actual, '1111111100000000');
        });

        it('should create new genepool of same size based on reletive fitneses of existing members', () => {
            let actual = gaEngine.selectNextGenGenepool(genepoolWithOrderedreletivefitnesses(), [], 0.02);

            assert.equal(actual.length, genepoolWithUnOrderedReletiveFitnessPercentages().length);
        });

        it('should select 1 random genome from the genepool', () => {
            randomNumberStub.returns(2);
            let actual = gaEngine.selectRandomGenome(firstGenerationGenepoolWithFitnessValues());
            assert.equal(actual, '1111111100000000');
        });
    });


    describe('binary string to decimal conversion', () => {
        it("should return 65535 for a string of 1's", () => {
            const actual = gaEngine.binStringToDec('1111111111111111');
            assert.equal(actual, '65535');
        });

        it("should return 0 for a string of 0's", () => {
            const actual = gaEngine.binStringToDec('0000000000000000');
            assert.equal(actual, '0');
        });

        it("should return 15 for last 4 bits as 1's", () => {
            const actual = gaEngine.binStringToDec('0000000000001111');
            assert.equal(actual, '15');
        });

        it("should return 61440 for first 4 bits as 1's", () => {
            const actual = gaEngine.binStringToDec('1111000000000000');
            assert.equal(actual, '61440');
        })
    });

    describe('genepool creation', () => {
        it("should create binary string genome of given length", () => {
            let desiredLength = 32;
            let actual = gaEngine.generateRandomBinaryGenome(desiredLength, "");
            assert.notEqual(actual.match("^[0-1]*$"), null);
            assert.equal(actual.length, desiredLength);
        });

        it("should create entire random genepool of given length", () => {
            let desiredLength = 1000;
            let actual = gaEngine.initialiseGenepool(desiredLength, []);
            assert.equal(Object.keys(actual).length, desiredLength);
        });
    });

    function getFirstGenerationGenepool() {
        return [
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

    function firstGenerationGenepoolWithFitnessValues() {
        return [
            {genome: '1111111111111111', fitness: 65535},
            {genome: '1111111111110000', fitness: 65520},
            {genome: '1111111100000000', fitness: 65280},
            {genome: '1111000000000000', fitness: 61440},
            {genome: '0000000000000000', fitness: 0},
            {genome: '0000000000001111', fitness: 15},
            {genome: '0000000011111111', fitness: 255},
            {genome: '0000111111111111', fitness: 4095}
        ];
    }

    function genepoolWithOrderedreletivefitnesses() {
        return [
            {genome: '0000000000000000', fitness: 0, percentage: 0},
            {genome: '0000000000001111', fitness: 15, percentage: 0.005722133211261158},
            {genome: '0000000011111111', fitness: 255, percentage: 0.09727626459143969},
            {genome: '0000111111111111', fitness: 4095, percentage: 1.5621423666742962},
            {genome: '1111000000000000', fitness: 61440, percentage: 23.437857633325702},
            {genome: '1111111100000000', fitness: 65280, percentage: 24.90272373540856},
            {genome: '1111111111110000', fitness: 65520, percentage: 24.99427786678874},
            {genome: '1111111111111111', fitness: 65535, percentage: 25}
        ];
    }

    function genepoolWithUnOrderedReletiveFitnessPercentages() {
        return [
            {genome: '1111111111111111', fitness: 65535, percentage: 25},
            {genome: '1111111111110000', fitness: 65520, percentage: 24.99427786678874},
            {genome: '1111111100000000', fitness: 65280, percentage: 24.90272373540856},
            {genome: '1111000000000000', fitness: 61440, percentage: 23.437857633325702},
            {genome: '0000000000000000', fitness: 0, percentage: 0},
            {genome: '0000000000001111', fitness: 15, percentage: 0.005722133211261158},
            {genome: '0000000011111111', fitness: 255, percentage: 0.09727626459143969},
            {genome: '0000111111111111', fitness: 4095, percentage: 1.5621423666742962}
        ]
    }
});