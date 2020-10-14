export const address: string = "5HMZX5qPQZJSi8cE1i3vHTrUy3Z9qYfZT3s1LWVCbm7uM3zvJzApT2FjfELYmKLYA71QoArLvTZXZpusPWJyPHDH";
export const abi: any = [
    {
        "inputs": [],
        "name": "exchange",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "myExchangeValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "backedValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimantValue",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "myRecordInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "createTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastWithDrawTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "total",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct ISeed.Record",
                        "name": "data",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct ISeed.RecordInfo[]",
                "name": "result",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "myValidRecordInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "createTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastWithDrawTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "total",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct ISeed.Record",
                        "name": "data",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct ISeed.RecordInfo[]",
                "name": "result",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "withDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]