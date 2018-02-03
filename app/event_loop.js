const ga = require('./ga_engine');
const assert = require('assert');


let genepool;

//initialise constants
const crossoverRate = 0.6;
const mutationRate = 0.08;

// initialise random genepool
genepool = ga.initialiseGenepool(32, []);

// get fitnesses
let fitnessFunction = (g) => parseInt(g, 2);
genepool = ga.determineFitnessOfEachGenomeInGenepool(genepool, (g) => parseInt(g, 2));
genepool = ga.assignRelativeFitnessPercentagesToGenepool(genepool);

// calculate initial total fitness of entire genepool
let initialFitnessOfGenepool = ga.summedFitnessOfGenepool(genepool);

// create new generation
genepool = ga.selectNextGenGenepool(genepool, [], crossoverRate);

// for each genome maybe mutate
genepool.map((g) => {
    let rand = Math.random();
    if (rand > 0 && rand < mutationRate) return ga.mutateGenome(g);
});

genepool = ga.assignRelativeFitnessPercentagesToGenepool(
    ga.determineFitnessOfEachGenomeInGenepool(genepool, fitnessFunction));

let finalTotalFitness = ga.summedFitnessOfGenepool(genepool);

assert.equal(initialFitnessOfGenepool, finalTotalFitness);