export const JournyLogAbi = [
  {
    type: "event",
    name: "EntryLogged",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "cid", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "streak", type: "uint16", indexed: false },
    ],
  },
  {
    type: "function",
    name: "currentStreak",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntryCount",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntry",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isEligibleForClanker",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastEntryTimestamp",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint32" }],
    stateMutability: "view",
  },
] as const;
