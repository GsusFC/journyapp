import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("JournyLog", function () {
    async function deployJournyLogFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const JournyLog = await ethers.getContractFactory("JournyLog");
        const journyLog = await JournyLog.deploy();
        return { journyLog, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should start with 0 entries for a user", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);
            const count = await journyLog.getEntryCount(owner.address);
            expect(count).to.equal(0);
        });
    });

    describe("Logging Entries & Streaks", function () {
        it("Should log an entry and start streak at 1", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);
            const cid = "QmTest123";

            await journyLog.logEntry(cid);

            const streak = await journyLog.currentStreak(owner.address);
            expect(streak).to.equal(1);

            const count = await journyLog.getEntryCount(owner.address);
            expect(count).to.equal(1);
        });

        it("Should NOT increase streak if less than 24h passed", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);

            await journyLog.logEntry("Entry1");

            // Advance time by 12 hours
            await time.increase(12 * 3600);

            await journyLog.logEntry("Entry2");

            const streak = await journyLog.currentStreak(owner.address);
            expect(streak).to.equal(1); // Still 1

            const count = await journyLog.getEntryCount(owner.address);
            expect(count).to.equal(2); // But 2 entries
        });

        it("Should increase streak if between 24h and 48h passed", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);

            await journyLog.logEntry("Entry1");

            // Advance time by 25 hours
            await time.increase(25 * 3600);

            await journyLog.logEntry("Entry2");

            const streak = await journyLog.currentStreak(owner.address);
            expect(streak).to.equal(2);
        });

        it("Should reset streak if more than 48h passed", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);

            await journyLog.logEntry("Entry1");

            // Advance time by 50 hours
            await time.increase(50 * 3600);

            await journyLog.logEntry("Entry2");

            const streak = await journyLog.currentStreak(owner.address);
            expect(streak).to.equal(1);
        });
    });

    describe("Clanker Eligibility", function () {
        it("Should return false for streak < 30", async function () {
            const { journyLog, owner } = await loadFixture(deployJournyLogFixture);
            await journyLog.logEntry("Entry1");
            const eligible = await journyLog.isEligibleForClanker(owner.address);
            expect(eligible).to.be.false;
        });
    });
});
