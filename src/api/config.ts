export const address: string = "2mJjTksWLXMKbyyPi2JfQfDLUcGn3QyWvZT5QZXJpEEWP23Jseih2Qm1z2MFfGw4oAJvGN3H2B8r2CwyW3YWRmpY";
export const address1: string = "LHQhhHboKziVF7yQpayBqpKVU9cBY7nu7VSaBTfDuSfFLETvDpgrA5coAy5sro3Lvv4PmcaimkvvejSF64Dn6xd";
export const abi: any = [
    {
        "inputs": [],
        "name": "exchange",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
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
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
export const abi1:any=[
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
