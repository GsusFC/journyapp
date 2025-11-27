import { createConfig } from "ponder";
import { http } from "viem";
import { JournyLogAbi } from "./abis/JournyLog";

export default createConfig({
  chains: {
    baseSepolia: {
      id: 84532,
      rpc: http(process.env.PONDER_RPC_URL_84532),
    },
  },
  contracts: {
    JournyLog: {
      abi: JournyLogAbi,
      chain: "baseSepolia",
      address: "0xf5FeFabd1B0Ad49a0DE92B7c04FBa3518083Dc64",
      // Block donde se desplegó el contrato (23 Nov 2025)
      startBlock: 34_059_544,
    },
  },
});
