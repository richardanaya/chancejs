define(['Chance', 'mocha', 'chai', 'underscore'], function (Chance, mocha, chai, _) {
    var expect = chai.expect;

    describe("Basics", function () {
        var bool, integer, natural, character, string, chance = new Chance();

        describe("Bool", function () {
            it("returns a random boolean", function () {
                bool = chance.bool();
                expect(bool).to.be.a('boolean');
            });

            it("is within the bounds of what we'd call random", function () {
                var true_count = 0;
                _(1000).times(function () {
                    bool = chance.bool();
                    if (bool) {
                        true_count++;
                    }
                });

                // Note: In very extreme circumstances this test may fail as, by its
                // nature it's random. But it's a low enough percentage that I'm
                // willing to accept it.
                // Award to anyone that calculates the actual probability of this
                // test failing and submits a pull request adding it to this comment!
                expect(true_count).to.be.within(200, 800);
            });
        });

        describe("Integer", function () {
            it("returns a random integer", function () {
                integer = chance.integer();
                expect(integer).to.be.a('number');
            });

            it("is sometimes negative, sometimes positive", function () {
                var positive_count = 0;
                _(1000).times(function () {
                    integer = chance.integer();
                    if (integer > 0) {
                        positive_count++;
                    }
                });

                // Note: In very extreme circumstances this test may fail as, by its
                // nature it's random. But it's a low enough percentage that I'm
                // willing to accept it.
                expect(positive_count).to.be.within(200, 800);
            });

            it("can take a negative min and obey it", function () {
                _(1000).times(function () {
                    integer = chance.integer({min: -25});
                    expect(integer).to.be.above(-26);
                });
            });

            it("can take a negative min and negative max and obey both", function () {
                _(1000).times(function () {
                    integer = chance.integer({min: -25, max: -1});
                    expect(integer).to.be.within(-26, 0);
                });
            });
        });

        describe("Natural", function () {
            it("returns a random natural", function () {
                natural = chance.natural();
                expect(natural).to.be.a('number');
            });

            it("is always positive", function () {
                var positive_count = 0;
                _(1000).times(function () {
                    natural = chance.natural();
                    if (natural > 0) {
                        positive_count++;
                    }
                });

                expect(positive_count).to.equal(1000);
            });

            it("can take just a min and obey it", function () {
                _(1000).times(function () {
                    natural = chance.natural({min: 9007199254740991});
                    expect(natural).to.be.above(9007199254740990);
                });
            });

            it("can take just a max and obey it", function () {
                _(1000).times(function () {
                    natural = chance.natural({max: 100});
                    expect(natural).to.be.below(101);
                });
            });

            it("can take both a max and min and obey them both", function () {
                _(1000).times(function () {
                    natural = chance.natural({min: 90, max: 100});
                    expect(natural).to.be.within(89, 101);
                });
            });
        });

        describe("Character", function () {
            it("returns a character", function () {
                character = chance.character();
                expect(character).to.be.a('string');
                expect(character).to.have.length(1);
            });

            it("pulls only from pool, when specified", function () {
                var pool = 'abcde';
                _(1000).times(function () {
                    character = chance.character({pool: pool});
                    expect(character).to.match(/[abcde]/);
                });
            });
        });

        describe("String", function () {
            it("returns a string", function () {
                string = chance.string();
                expect(string).to.be.a('string');
            });

            it("obeys length, when specified", function () {
                var length;
                _(1000).times(function () {
                    // Generate a random length from 1-25
                    length = chance.natural({min: 1, max: 25});
                    string = chance.string({length: length});
                    expect(string).to.have.length(length);
                });
            });
        });
    });

    describe("Seed", function () {
        var seed, chance1, chance2;

        describe("random", function () {
            it("does not return repeatable results if no seed provided", function (done) {
                chance1 = new Chance();
                // Wait 5 ms before creating chance2 else sometimes they happen on the same
                // tick and end up with the same seed!
                setTimeout(function () {
                    chance2 = new Chance();
                    _(1000).times(function () {
                        expect(chance1.random()).to.not.equal(chance2.random());
                    });
                    done();
                }, 5);
            });

            it("returns repeatable results if seed provided on the Chance object", function () {
                seed = new Date().getTime();
                chance1 = new Chance(seed);
                chance2 = new Chance(seed);

                _(1000).times(function () {
                    expect(chance1.random()).to.equal(chance2.random());
                });
            });
        });
    });

});
