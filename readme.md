******Lightweight toolkit for genetic algorithm processes using a binary genome representation******

**This is a very simple process but can be a very powerful tool to solve multi-objective combinatorial optimisation problems (mocops).**

Import the genetic algorith toolkit.

    const ga = require('./ga_engine');
    
Define the likelihood of a crossover of genes between each genome pair selected to create each new generation  genepool.

    const crossoverRate = 0.6;
    const mutationRate = 0.08;
    
Initialise random genepool (In this example the length of our genome is 32 - length is number of bits as its binary)
 
    let genepool = ga.initialiseGenepool(32, []);
    
Here a fitness function is defined to determine the fitnesss/usefulness of a given genome/solution.

    let fitnessFunction = (g) => parseInt(g, 2);
In this example the fitness function just converts the binary genome in to a number and considers a higher number to have a higher fitness value.

The fitness function can then be used to determine the effectiveness of each genome in the genepool.

    genepool = ga.determineFitnessOfEachGenomeInGenepool(genepool, fitnessFunction);
    genepool = ga.assignRelativeFitnessPercentagesToGenepool(genepool);
    
    

Calculate initial total fitness of entire genepool

    let initialFitnessOfGenepool = ga.summedFitnessOfGenepool(genepool);

    let numGenerationsToRun = 100;

Now the initial population  has bee generated, loop for n generations before examining results

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

Now, in this very simple example we have cycled through 100 generations of 'determine usefullness of genes/solutions', 'create new genepool with generally high quality genomes/solutions' and 'randomly breed together pairs of some genomes and maybe mutate randomly - according to the defined crossover and mutation rates'.
Now we can display the original overall fitness of the population and the resulting fitness after 100 generations.

    process.stdout.write('The combined fitness of the genomes in the original population was: ' +
        initialFitnessOfGenepool + '. After ' + numGenerationsToRun +
        ' generations this has now become ' +
        finalTotalFitness + '.');
        
_In a real life example we might itterate through this process many times, constantly testing the validity of the solutions.
Usually the fitness of a genome would be determined by a custom function that might perhaps treat specific bits in the binary genome as characteristics of some abstract concept._