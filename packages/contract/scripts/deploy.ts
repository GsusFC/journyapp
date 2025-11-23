import { ethers } from "hardhat";

async function main() {
    const journyLog = await ethers.deployContract("JournyLog");

    await journyLog.waitForDeployment();

    console.log(`JournyLog deployed to ${journyLog.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
