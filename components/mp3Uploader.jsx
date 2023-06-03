// Import CSS styles, and necessary modules from packages
import styles from "../styles/Mp3Upload.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

// NFT Minter component
export default function Mp3Uploader({
                                      contentSrc,
                                      contentType,
                                  }) {
    // Get the user's wallet address and status of their connection to it
    const { address, isDisconnected } = useAccount();
    // Get the signer instance for the connected wallet
    const { data: signer } = useSigner();
    // State hooks to track the transaction hash and whether or not the NFT is being minted
    const [txHash, setTxHash] = useState();
    const [isMinting, setIsMinting] = useState(false);

    const [fileData, setFileData] = useState("");

    const onFileChange = async event => {

        //console.log(event)

        console.log(event.target.files[0])

        const text = await event.target.files[0].text()

        console.log(text)

        // Update the state
        //setFileData(event.target.files[0]);

    };

    const onFileUpload = () => {
        /*
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("api/uploadfile", formData);

         */
    };

    // Function to mint a new NFT
    const mintNFT = async () => {
        // Create a new instance of the NFT contract using the contract address and ABI
    };
    return (
        <div className={styles.page_flexBox}>
            <div className={styles.page_container}>
                <div>
                    <h1 className={styles.nft_title}>
                        Upload Music
                    </h1>
                    <p className={styles.text}>
                        Upload your song as an mp3 file to share with others
                    </p>
                    <div>
                        <input type="file" onChange={onFileChange} />
                        <button
                            className={`${styles.button} ${
                                isMinting && `${styles.isMinting}`
                            }`}
                            onClick={onFileUpload}>
                            Upload!
                        </button>
                    </div>
                </div>

                {/*
                <div className={styles.nft_info}>
                    <h1 className={styles.nft_title}>Create Web3 Dapp NFT</h1>
                    <h3 className={styles.nft_author}>By Alchemy.eth</h3>
                    <p className={styles.text}>
                        Bootstrap a full stack dapp in 5 minutes with customizable
                        components and project templates using Create Web3 Dapp.
                    </p>
                    <hr className={styles.break} />
                    <h3 className={styles.nft_instructions_title}>INSTRUCTIONS</h3>
                    <p className={styles.text}>
                        This NFT is on MATIC Mumbai. You’ll need some test MATIC to mint the
                        NFT. <a href="https://mumbaifaucet.com/">Get free test MATIC</a>
                    </p>
                    {isDisconnected ? (
                        <p>Connect your wallet to get started</p>
                    ) : !txHash ? (
                        <button
                            className={`${styles.button} ${
                                isMinting && `${styles.isMinting}`
                            }`}
                            disabled={isMinting}
                            onClick={async () => await mintNFT()}
                        >
                            {isMinting ? "Minting" : "Mint Now"}
                        </button>
                    ) : (
                        <div>
                            <h3 className={styles.attribute_input_label}>TX ADDRESS</h3>
                            <a
                                href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div className={styles.address_container}>
                                    <div>
                                        {txHash.slice(0, 6)}...{txHash.slice(6, 10)}
                                    </div>
                                    <img
                                        src={
                                            "https://static.alchemyapi.io/images/cw3d/Icon%20Large/etherscan-l.svg"
                                        }
                                        width="20px"
                                        height="20px"
                                    />
                                </div>
                            </a>
                        </div>
                    )}
                </div>
                */}

            </div>
        </div>
    );
}
