// Import CSS styles, and necessary modules from packages
import styles from "../styles/Mp3Upload.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
//import { useAccount, useSigner } from "wagmi";
import axios from "axios";

// NFT Minter component
export default function Claim({
                                        contentSrc,
                                        contentType,
                                    }) {
    // Get the user's wallet address and status of their connection to it
    const { address, isDisconnected } = useAccount();
    // Get the signer instance for the connected wallet
    //const { data: signer } = useSigner();
    // State hooks to track the transaction hash and whether or not the NFT is being minted
    const [txHash, setTxHash] = useState();
    const [isMinting, setIsMinting] = useState(false);

    const [fileData, setFileData] = useState("");

    /*
    const claimTokens = async () => {
        const userAddress = await signer.getAddress()

        await axios.post('http://localhost:8080/claim', {
            address: userAddress
        });
    }

     */


    // Function to mint a new NFT
    const mintNFT = async () => {
        // Create a new instance of the NFT contract using the contract address and ABI
    };
    return (
        <div className={styles.page_flexBox}>
            <div className={styles.page_container}>
                <div>
                    <h1 className={styles.nft_title}>
                        Claim Them Tokens
                    </h1>
                    <p className={styles.text}>
                        You have 1 Billion Tokens
                    </p>
                    <div>
                        <button
                            className={styles.button}
                            onClick={claimTokens}>
                            Claim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
