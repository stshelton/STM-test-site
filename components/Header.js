import Link from "next/link"
import { ConnectButton } from "web3uikit"

export default function Header() {
    //class name comes from css library called tailwindCss
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <div>
                <h1 className="py-4 px-4 font-blog text-3xl">STM Test</h1>
                <Link href="https://testnet.snowtrace.io/address/0x1aaC9a6773BA6B8a5f1bE2D42798699C489e9D84">
                    <a className="py-4 px-4 underline">View Smart Contract</a>
                </Link>
            </div>

            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
