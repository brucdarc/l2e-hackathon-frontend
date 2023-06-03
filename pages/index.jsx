import styles from "../styles/Home.module.css";
import InstructionsComponent from "../components/InstructionsComponent";
import NftMinter from "../components/nftMinter";
import Mp3Uploader from "../components/mp3Uploader";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <Mp3Uploader></Mp3Uploader>
      </main>
    </div>
  );
}
