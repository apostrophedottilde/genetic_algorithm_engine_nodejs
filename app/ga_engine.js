module.exports = {
    randomInRange: function (genome) {
        return (Math.random() * genome.length) - 1;
    },

    replaceAt: function(string, index, replacement) {
        return string.substring(0, index) + replacement + string.substring(index + replacement.length);
    },

    crossoverPair: function(genome1, genome2) {
        const rand = this.randomInRange(genome1.length);
        const gen1PartA = genome1.substring(0, rand);
        const gen1PartB = genome1.substring(rand, genome1.length);
        const gen2PartA = genome2.substring(0, rand);
        const gen2PartB = genome2.substring(rand, genome2.length);
        return { gen1: gen1PartA.concat(gen2PartB), gen2: gen2PartA.concat(gen1PartB)
        };
    },

    mutateGenome: function(genome) {
        const rand = this.randomInRange(genome);
        return genome.charAt(rand) === '1' ? this.replaceAt(genome, rand, '0') : this.replaceAt(genome, rand, '1');
    },

    selection: function(genepool, fitnessFunction) {
        return genepool[fitnessFunction(genepool)];
    },

    determineFitnessOfEachGenomeInGenepool: function(genepool, fitnessFunction) {
        return genepool.map((g) => { return { genome: g, fitness: fitnessFunction(g) }
        });
    },

    assignRelativeFitnessPercentagesToGenepool: function (genepool) {
        const poolFitness =  this.summedFitnessOfGenepool(genepool);
        return genepool.map((g) => {
            g.percentage =  g.fitness / poolFitness * 100;
            return g;
        });
    },

    summedFitnessOfGenepool: function (genepool) {
        return genepool.map((x) => x.fitness).reduce((acc, x) => acc + x);
    },

    sortGenepoolByReletiveFitnessPercentage: function (genepool) {
       return genepool.sort((a,b) => a.percentage > b.percentage ? 1 : -1);
    },

    binStringToDec: function (genome) {
        return parseInt(genome, 2);
    },

    makeBiasedSelection: function(genepool) {
        const rouletteResult = Math.random() * 100;
        genepool = this.sortGenepoolByReletiveFitnessPercentage(genepool);
        return this.findGenomeMatchingFitnessPercentage(genepool.slice(0), rouletteResult);
    },

    selectPairFromGenepool: function(genepool) {
        return { gen1: this.selectRandomGenome(genepool), gen2: this.selectRandomGenome(genepool) };
    },

    selectRandomGenome: function(genepool) {
        return genepool[this.randomInRange(genepool[0].genome.length)].genome;
    },

    selectNextGenGenepool: function(genepool, newPool, crossoverRate) {
        if(newPool.length === genepool.length) return newPool;
        let genome1 = this.makeBiasedSelection(genepool);
        let genome2 = this.makeBiasedSelection(genepool);
        let rand = Math.random();
        if (rand > 0 && rand < crossoverRate) {
            pair = this.crossoverPair(genome1, genome2);
            genome1 = pair.gen1;
            genome2 = pair.gen2;
        }
        newPool.push(genome1);
        newPool.push(genome2);
        return this.selectNextGenGenepool(genepool, newPool);
    },

    findGenomeMatchingFitnessPercentage: function(genepool, percentage) {
        let g = genepool.shift();
        if(genepool.length === 0 || g.percentage > percentage) return g.genome;
        return this.findGenomeMatchingFitnessPercentage(genepool, percentage);
    },

    generateRandomBinaryGenome: function (len, genome) {
        if(genome.length === len) return genome;
        let bit = Math.round(Math.random());
        return this.generateRandomBinaryGenome(len, genome.concat(bit));
    },

    initialiseGenepool(len, genomeArray) {
        if(Object.keys(genomeArray).length === len) return genomeArray;
        genomeArray.push(this.generateRandomBinaryGenome(64, ""));
        return this.initialiseGenepool(len, genomeArray);
    }
};