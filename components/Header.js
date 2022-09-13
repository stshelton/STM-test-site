import { ConnectButton } from "web3uikit"

export default function Header() {
    //class name comes from css library called tailwindCss
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text3x1">STM Test</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
