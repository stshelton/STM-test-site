import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import STMTestView from "../components/STMTestView"
import { useState } from "react"
import { Navbar } from "../components/navbar"
import ContractInfoView from "../components/ContractInfoView"

export default function Home() {
    const [currentTab, setCurrentTab] = useState("STM Demo")
    return (
        <div className={styles.container}>
            <Head>
                <title>STM Contract</title>
                <meta name="description" content="STM Contract" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Navbar
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
            ></Navbar>
            {currentTab == "STM Demo" ? (
                <STMTestView></STMTestView>
            ) : (
                <ContractInfoView></ContractInfoView>
            )}
        </div>
    )
}
