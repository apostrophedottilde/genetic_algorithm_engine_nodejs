
module.exports = {

    randomInRange: function (genome) {
        return (Math.random() * genome.length) - 1;
    },

    replaceAt: function(string, index, replacement) {
        return string.substring(0, index) +
            replacement +
            string.substring(index + replacement.length);
    },

    crossoverEquallySizedPair: function(genome1, genome2) {
        let rand = this.randomInRange(genome1.length);
        const gen1PartA = genome1.substring(0, rand);
        const gen1PartB = genome1.substring(rand, genome1.length);
        const gen2PartA = genome2.substring(0, rand);
        const gen2PartB = genome2.substring(rand, genome2.length);

        return {
            gen1: gen1PartA.concat(gen2PartB),
            gen2: gen2PartA.concat(gen1PartB)
        };
    },

    mutateGenome: function(genome) {
        let rand = this.randomInRange(genome);
        const randomGene = genome.charAt(rand);

        genome = randomGene === '1' ? this.replaceAt(genome, rand, '0') : replaceAt(genome, rand, '1');
        return genome;
    },

    selection: function(genepool, fitnessFunction) {
        let fitness = fitnessFunction();
        return genepool[fitness];
    },

    binaryStringToDecimal: function (genome) {
        return digit = parseInt(genome, 2);
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