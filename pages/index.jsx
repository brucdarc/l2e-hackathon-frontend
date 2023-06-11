import styles from "../styles/Home.module.css";
import InstructionsComponent from "../components/InstructionsComponent";
import NftMinter from "../components/nftMinter";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
          <h1>Welcome to Listen 2 Win!</h1>
          <p>Here you can earn tokens from listening to music, and then use those tokens to enter into a lottery for music nfts.</p>
          <p>
              Head over to the listen tab to listen to music. Once you have accumulated some listen time, claim tokens at the claim tab.
          </p>
          <p>
              Upload your songs over at the upload tab. This will automatically mint a music nft, and start a lottery for that nft! While the lottery is ongoing, everyone can listen to that song and earn tokens.
          </p>
          <h1>Please Switch to the Goerli Network if You Haven't Already</h1>
          <img className={styles.logo} src={'/image/logo1.png'} alt={''}/>
      </main>
    </div>
  );
}
