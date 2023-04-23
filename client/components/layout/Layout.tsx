import styles from "./Layout.module.css";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
  isHome?: boolean;
};

export default function Layout({ children, isHome }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="YourNFT" content="I'm a NFT dapps" />
      </Head>
      <main>{children}</main>
    </div>
  );
}
