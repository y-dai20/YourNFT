import styles from "./NFTCard.module.css";

type Props = {
  NFTAttribute: {
    name: string;
    description: string;
    imageURL: string;
    owner: string;
  };
  children: React.ReactNode;
  index: number;
};

export default function NFTCard({ NFTAttribute, children, index }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.word}>Index：{index}</p>
      <p className={styles.word}>NAME：{NFTAttribute.name}</p>
      <p className={styles.word}>Description：{NFTAttribute.description}</p>
      <p className={styles.word}>
        ImageURL：
        <a href={"https://" + NFTAttribute.imageURL}>{NFTAttribute.imageURL}</a>
      </p>
      <p className={styles.word}>Owner：{NFTAttribute.owner}</p>
      {children}
    </div>
  );
}
