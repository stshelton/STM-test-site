import { useMoralisSubscription, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function STMTestView() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //chain id gives us the hex value
    console.log(`chainIdHex: ${chainIdHex})`)
    const chainId = parseInt(chainIdHex)
    console.log(`chainId: ${chainId}`)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [currentSupply, setCurrentSupply] = useState("0")
    const [name, setName] = useState("0")
    const [minterRole, setMinterRole] = useState("")
    const [pauserRole, setPauserRole] = useState("")
    const [amountToMint, setAmountToMint] = useState("")
    const [addressToSendPetra, setAddresToSendPetra] = useState("")
    const [minterRoleAddress, setMinterRoleAddress] = useState("")

    const dispatch = useNotification()

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log(`raffleaddress: ${raffleAddress}`)
            console.log(account)

            setAddresToSendPetra(account)
            updateUi()
        }
    }, [isWeb3Enabled])

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

        const nameOfCoin = (await getNameOfToken()).toString()
        setName(nameOfCoin)

        const minterRoleAddress = await getRoleMember()
        console.log(minterRoleAddress)
        setMinterRoleAddress(minterRoleAddress)
    }

    function ContractAddressExistsUI() {
        return (
            <div>
                {/* <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-gold py-2 px-4 rounded ml-auto"
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
                <label for="mint">Mint Petra</label>
                <input id="mint amount" placeholder="0.1"></input>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-gold py-2 px-4 rounded ml-auto"
                    onClick={async function () {
                        //console.log(enterRaffle)
                        const amountToFund =
                            document.getElementById("mint amount").value *
                            10 ** 18
                        setAmountToMint(amountToFund.toString())
                        console.log(amountToMint)
                        console.log(addressToSendPetra)
                        await mintPetra({
                            onSuccess: handleSuccess, //tx response is passed by default when not adding ()
                            onError: handleMintError,
                        })
                    }}
                    //disabled={isFetching || isLoading}
                >
                    {LoadingUi()}
                </button>
                <div>
                    Total Current Supply:
                    {currentSupply / 10 ** 18} {name}
                </div>
                <div>
                    Minter Address:
                    {minterRoleAddress}
                </div>
            </div>
        )
    }

    function LoadingUi() {
        return isFetching || isLoading ? (
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
            <div> Mint </div>
        )
    }

    const handleMintError = async function (error) {
        //console.log(error)
        console.log("mint handel error")
        console.log(error.data)
        console.log(error.data.message)
        handleNewNotification("Error", error.data.message)
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
        <div className="p-5">
            Petra test
            {raffleAddress
                ? ContractAddressExistsUI()
                : RaffleAddressDoesntExistUI()}
        </div>
    )
}

function RaffleAddressDoesntExistUI() {
    return <div>No Raffle Address Deteched</div>
}
