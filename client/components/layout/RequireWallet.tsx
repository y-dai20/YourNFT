import styles from "./RequireWallet.module.css";

type Props = {
  children: React.ReactNode;
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export default function RequireWallet({
  children,
  currentAccount,
  connectWallet,
}: Props) {
  return (
    <div>
      {currentAccount ? (
        <div>
          <div className={styles.wallet}>
            <p className={styles.title}>Current Account:</p>
            <p>{currentAccount}</p>
          </div>
          {children}
        </div>
      ) : (
        <div className={styles.connectWallet}>
          <p>ウォレットを接続しましょう！</p>
          <button className="btn btn-primary m-0" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
