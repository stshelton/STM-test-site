import { useMoralisSubscription, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function STMTestView() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //chain id gives us the hex value
    //console.log(`chainIdHex: ${chainIdHex})`)
    const chainId = parseInt(chainIdHex)
    //console.log(`chainId: ${chainId}`)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [currentSupply, setCurrentSupply] = useState("0")
    const [name, setName] = useState("0")
    const [minterRole, setMinterRole] = useState("")
    const [pauserRole, setPauserRole] = useState("")
    const [amountToMint, setAmountToMint] = useState("")
    const [addressToSendPetra, setAddresToSendPetra] = useState("")
    const [minterRoleAddress, setMinterRoleAddress] = useState("")
    const [capAmount, setCapAmount] = useState("")
    const [currentWalletsBalance, setCurrentWalletBalance] = useState("")

    const dispatch = useNotification()

    //styling
    const nonEditableTextStyle =
        "appearance-none block w-6/12 bg-blue-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    const editableTextStyle =
        "appearance-none block w-6/12 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log(`raffleaddress: ${raffleAddress}`)
            console.log(`current connected ${account}`)

            setAddresToSendPetra(account)
            updateUi()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        async function getMinterRole() {
            if (minterRole.length > 0) {
                const minterRoleAddress = await getRoleMember()
                console.log(minterRoleAddress)
                setMinterRoleAddress(minterRoleAddress)
            }
        }
        getMinterRole()
    }, [minterRole])

    useEffect(() => {
        async function checkMintAmount() {
            console.log(`amount to mint ${amountToMint}`)
            if (amountToMint > 0.0) {
                await mintPetra({
                    onSuccess: handleSuccess, //tx response is passed by default when not adding ()
                    onError: handleMintError,
                })
            }
        }
        checkMintAmount()
    }, [amountToMint])

    const { runContractFunction: getTotalSupply } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: getMinterRole } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "MINTER_ROLE",
        params: {},
    })

    const { runContractFunction: getNameOfToken } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "name",
        params: {},
    })

    const { runContractFunction: getCapAmount } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getCapAmount",
        params: {},
    })

    const { runContractFunction: getBalanceOfCurrentAccount } = useWeb3Contract(
        {
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "balanceOf",
            params: { account: account },
        }
    )

    const {
        runContractFunction: mintPetra,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "mint",
        params: { to: addressToSendPetra, amount: amountToMint },
    })

    const { runContractFunction: getRoleMember } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRoleMember",
        params: { role: minterRole, index: 0 },
    })

    async function updateUi() {
        const totalSupplyFromCall = (await getTotalSupply()).toString()
        setCurrentSupply(totalSupplyFromCall)

        const minterRole = (await getMinterRole()).toString()
        setMinterRole(minterRole)
        console.log(minterRole)

        const nameOfCoin = (await getNameOfToken()).toString()
        setName(nameOfCoin)

        const capAmount = (await getCapAmount()).toString()
        setCapAmount(capAmount)

        const currentBalance = (await getBalanceOfCurrentAccount()).toString()
        setCurrentWalletBalance(currentBalance)
    }

    function ContractAddressExistsUI() {
        return (
            <div className="space-y-10">
                {/* <button
                    classNameName="bg-blue-500 hover:bg-blue-700 text-white font-gold py-2 px-4 rounded ml-auto"
                    onClick={async function () {
                        console.log(enterRaffle)
                        await enterRaffle({
                            onSuccess: handleSuccess, //tx response is passed by default when not adding ()
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isFetching || isLoading}
                >
                    {LoadingUi()}

                </button> */}

                <div classNameName="space-y-2">
                    <label htmlFor="mint">Enter Interchange Fee</label>
                    <input
                        className={editableTextStyle}
                        id="mint amount"
                        placeholder="0.0"
                    ></input>
                    <button
                        classNameName="bg-blue-500 hover:bg-blue-700 text-white font-gold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            //console.log(enterRaffle)
                            const amountToFund =
                                document.getElementById("mint amount").value *
                                10 ** 18

                            if (amountToFund <= 0) {
                                handleNewNotification(
                                    "Error",
                                    "Please enter a number greater then 0"
                                )
                                return
                            }
                            if (amountToMint == amountToFund) {
                                await mintPetra({
                                    onSuccess: handleSuccess, //tx response is passed by default when not adding ()
                                    onError: handleMintError,
                                })
                            } else {
                                setAmountToMint(amountToFund.toString())
                            }

                            console.log(amountToMint)
                            console.log(addressToSendPetra)
                        }}
                        //disabled={isFetching || isLoading}
                    >
                        {LoadingUi()}
                    </button>
                </div>

                <div className="space-y-2">
                    <label>Change newly minted STM receipt address:</label>
                    <input
                        className={editableTextStyle}
                        id="receiptAddress"
                    ></input>
                    <button
                        classNameName="bg-blue-500 hover:bg-blue-700 text-white font-gold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            //console.log(enterRaffle)
                            const receiptAddress = document
                                .getElementById("receiptAddress")
                                .value.toString()

                            setAddresToSendPetra(receiptAddress)

                            console.log(amountToMint)
                            console.log(addressToSendPetra)
                        }}
                        //disabled={isFetching || isLoading}
                    >
                        Change Address
                        {/* {LoadingUi()} */}
                    </button>
                </div>

                <div className="space-y-2">
                    Current Connected Wallets Balance:
                    <div className={nonEditableTextStyle}>
                        {currentWalletsBalance / 10 ** 18} {name}
                    </div>
                </div>

                <div className="space-y-2">
                    Total Current Supply:
                    <div className={nonEditableTextStyle}>
                        {currentSupply / 10 ** 18} {name}
                    </div>
                </div>

                <div className="space-y-2">
                    Supply Cap:
                    <div className={nonEditableTextStyle}>
                        {capAmount / 10 ** 18} {name}
                    </div>
                </div>

                <div>
                    Minter Role Address:
                    <div className={nonEditableTextStyle}>
                        {minterRoleAddress}
                    </div>
                </div>
                <div>
                    <label>Address to receive minted STM:</label>
                    <div className={nonEditableTextStyle}>
                        {addressToSendPetra}
                    </div>
                </div>
            </div>
        )
    }

    function LoadingUi() {
        return isFetching || isLoading ? (
            <div classNameName="animate-spin spinner-border h-10 w-10 border-b-2 rounded-full"></div>
        ) : (
            <div> Mint </div>
        )
    }

    const handleMintError = async function (error) {
        //console.log(error)
        console.log("mint handel error")
        console.log(error)
        // console.log(error.data)
        // console.log(error.data.message)
        if (typeof error.data != "undefined") {
            if (typeof error.data.message != "undefined") {
                handleNewNotification("Error", error.data.message)
            }
        } else {
            handleNewNotification("Error")
        }
    }

    //on success doesnt confirm that block has a confirmation just checks to see if transaction was sent to metamask
    //thats why we wait one to wait for block to be confirmed
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        updateUi()
        handleNewNotification(
            "Mint Success",
            "You have successfully minted more coin"
        )
    }

    const handleNewNotification = function (title, message) {
        dispatch({
            type: "info",
            message: message,
            title: title,
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div classNameName="p-5">
            {raffleAddress
                ? ContractAddressExistsUI()
                : RaffleAddressDoesntExistUI()}
        </div>
    )
}

function RaffleAddressDoesntExistUI() {
    return (
        <div>
            No Smart Minting Smart Contract Detected. Please connect to
            blockchain
        </div>
    )
}
