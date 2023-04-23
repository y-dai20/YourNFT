import styles from "./ExchangeRequestCard.module.css";

type Props = {
  ExchangeRequest: {
    sendTokenId: number;
    sender: string;
    receiveTokenId: number;
    receiver: string;
    text: string;
    timestamp: number;
    isDone: boolean;
  };
  children: React.ReactNode;
};

export default function ExchangeRequestCard({
  ExchangeRequest,
  children,
}: Props) {
  return (
    <div className={styles.card}>
      <p>Send Token Id：{ExchangeRequest.sendTokenId}</p>
      <p>Sender：{ExchangeRequest.sender}</p>
      <p>Receive Token Id：{ExchangeRequest.receiveTokenId}</p>
      <p>Receiver：{ExchangeRequest.receiver}</p>
      <p>Text：{ExchangeRequest.text}</p>
      <p>Timestamp：{ExchangeRequest.timestamp}</p>
      <p>isDone：{ExchangeRequest.isDone.toString()}</p>
      {children}
    </div>
  );
}
