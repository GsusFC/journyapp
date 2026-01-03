import { ethers } from "hardhat";

async function main() {
    const ContractAddress = "0x960820a7FC4463aF8e2F8a6Aa3B371aBcf3548b6";
    const UserAddress = process.env.ALLOW_USER;

    if (!UserAddress) {
        console.error("Please provide ALLOW_USER env var");
        process.exit(1);
    }

    const journyLog = await ethers.getContractAt("JournyLog", ContractAddress);

    console.log(`Adding ${UserAddress} to allowlist...`);

    const tx = await journyLog.setAllowed(UserAddress, true);
    await tx.wait();

    console.log(`User ${UserAddress} allowed!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
