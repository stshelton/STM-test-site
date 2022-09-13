import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import STMTestView from "../components/STMTestView"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>STM Contract</title>
                <meta name="description" content="STM Contract" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <STMTestView />
        </div>
    )
}
