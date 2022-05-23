//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Word MasterMind Variation Test", function () {
    this.timeout(100000000);
    
    it("Should give true for correct answer1", async () => {
        let poseidon = await buildPoseidon();
        let F = poseidon.F;

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        var solution = ["C", "D", "H", "Z"]
        var guess = ["Z", "D", "H", "C"]
        var solution_unicode = solution.map((x) => x.charCodeAt(0))
        var guess_unicode = guess.map((x) => x.charCodeAt(0))

        const h = poseidon(["18374778544983",solution_unicode[0],solution_unicode[1],solution_unicode[2],solution_unicode[3]]);
        
        const INPUT = {
            "pubGuessA":guess_unicode[0],
            "pubGuessB":guess_unicode[1],
            "pubGuessC":guess_unicode[2],
            "pubGuessD":guess_unicode[3],
            "pubNumHit":"2",
            "pubNumBlow":"2",
            "pubSolnHash":F.toString(h, 10),
        
            "privSolnA":solution_unicode[0],
            "privSolnB":solution_unicode[1],
            "privSolnC":solution_unicode[2],
            "privSolnD":solution_unicode[3],
            "privSalt":"18374778544983"
        }

        const witness = await circuit.calculateWitness(INPUT,true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(F.toString(h, 10))));
    });

    it("Should give true for correct answer2", async () => {
        let poseidon = await buildPoseidon();
        let F = poseidon.F;

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        var solution = ["C", "D", "H", "Z"]
        var guess = ["C", "D", "H", "Z"]
        var solution_unicode = solution.map((x) => x.charCodeAt(0))
        var guess_unicode = guess.map((x) => x.charCodeAt(0))

        const h = poseidon(["17897873892749665",solution_unicode[0],solution_unicode[1],solution_unicode[2],solution_unicode[3]]);
        
        const INPUT = {
            "pubGuessA":guess_unicode[0],
            "pubGuessB":guess_unicode[1],
            "pubGuessC":guess_unicode[2],
            "pubGuessD":guess_unicode[3],
            "pubNumHit":"4",
            "pubNumBlow":"0",
            "pubSolnHash":F.toString(h, 10),
        
            "privSolnA":solution_unicode[0],
            "privSolnB":solution_unicode[1],
            "privSolnC":solution_unicode[2],
            "privSolnD":solution_unicode[3],
            "privSalt":"17897873892749665"
        }

        const witness = await circuit.calculateWitness(INPUT,true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(F.toString(h, 10))));
    });
});