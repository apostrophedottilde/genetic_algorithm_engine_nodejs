This is a very simple usecase of these genetics algorithm helpers.

    const ga = require('./ga_engine');
    
    let genepool;
    
    //initialise constants
    const crossoverRate = 0.6;
    const mutationRate = 0.08;
    
    // initialise random genepool
    genepool = ga.initialiseGenepool(32, []);
    
    // get fitnesses
    // this fitness function is used to calculate the remative fitness of a solution/genome.
    // in this example the fitness value is purely the decimal representation of the binary genome
    // where a higher value is considdered a better solution.
    let fitnessFunction = (g) => parseInt(g, 2);
    genepool = ga.determineFitnessOfEachGenomeInGenepool(genepool, fitnessFunction);
    genepool = ga.assignRelativeFitnessPercentagesToGenepool(genepool);
    // calculate initial total fitness of entire genepool
    let initialFitnessOfGenepool = ga.summedFitnessOfGenepool(genepool);

    let numGenerationsToRun = 100;

    // loop for n generations before examining results
    let finalTotalFitness;
    for(let i = 0; i <= numGenerationsToRun; i++) {
        // create new generation
        genepool = ga.selectNextGenGenepool(genepool, [], crossoverRate);

        // for each genome maybe mutate
        genepool.map((g) => {
            let rand = Math.random();
            if (rand > 0 && rand < mutationRate) return ga.mutateGenome(g);
        });

        genepool = ga.assignRelativeFitnessPercentagesToGenepool(
            ga.determineFitnessOfEachGenomeInGenepool(genepool, fitnessFunction));

        finalTotalFitness = ga.summedFitnessOfGenepool(genepool);
    }
    // display the original overall fitness of the population with the resulting fitness.
    process.stdout.write('The combined fitness of the genomes in the original population was: ' +
        initialFitnessOfGenepool + '. After ' + numGenerationsToRun +
        ' generations this has now become ' +
        finalTotalFitness + '.');
