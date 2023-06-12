// Import CSS styles, and necessary modules from packages
import styles from "../styles/Mp3Upload.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import axios from "axios"

const API_KEY = '687a0e8eef14413d63ad'
const API_SECRET = 'd866031fc7aa5e4a8b941845510b645f76895cd527ab50ec9ca01baad142c20e'
const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNzQyYzBmZS1lOGY4LTQ2YjktYTE2MC0zODEyZjE2MTk4MmQiLCJlbWFpbCI6ImJydWNkYXJjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2ODdhMGU4ZWVmMTQ0MTNkNjNhZCIsInNjb3BlZEtleVNlY3JldCI6ImQ4NjYwMzFmYzdhYTVlNGE4Yjk0MTg0NTUxMGI2NDVmNzY4OTVjZDUyN2FiNTBlYzljYTAxYmFhZDE0MmMyMGUiLCJpYXQiOjE2ODYyNzk0MDh9.vX_jT-4JiO2HEJq2ZNvsQWykWTbQVqnxICXuunI3Ahk`

import { abi } from '../public/MusicalMasterpiecesAbi.json';
import {ethers} from "ethers";

// NFT Minter component
export default function Mp3Uploader({
                                        contentSrc,
                                        contentType,
                                    }) {

    const { data: signer } = useSigner();

    const [selectedFile, setSelectedFile] = useState();
    const [LotteryTokenAmount, setLotteryTokenAmount] = useState('');
    const [SongTitle, setSongTitle] = useState('');
    const [isUploadingToIpfs, setIsUploadingToIpfs] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const MumasContract = new Contract('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', abi, signer);


    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const amountChangeHandler = (event) => {
        console.log(event.target.value);
        setLotteryTokenAmount(event.target.value);
    };

    const handleSubmission = async() => {

        const formData = new FormData();

        formData.append('file', selectedFile)

        console.log('selected file ', selectedFile);

        const metadata = JSON.stringify({
            name: 'File name',
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', options);

        setIsUploadingToIpfs(true);
        try{
            const audioFileResult = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET
                }
            });
            console.log(audioFileResult.data);

            console.log('ifps hash ', audioFileResult.data.IpfsHash);

            console.log('concat hash ', 'https://ipfs.io/ipfs/'.concat(audioFileResult.data.IpfsHash))

            const metaDataJson = {
                name: SongTitle,
                audio: 'https://ipfs.io/ipfs/'.concat(audioFileResult.data.IpfsHash)
            }

            const jsonMetadataResult = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metaDataJson, {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET
                },
            })

            console.log('json pinata call result ', jsonMetadataResult);
            console.log('json ipfs hash', jsonMetadataResult.data.IpfsHash);

            const jsonIpfsUrl = 'https://ipfs.io/ipfs/'.concat(jsonMetadataResult.data.IpfsHash);

            console.log('json ipfs url before mint call ', jsonIpfsUrl);

            setIsMinting(true);
            setIsUploadingToIpfs(false);
            await mintToLottery(jsonIpfsUrl);
        } catch (error) {
            console.log(error);
            setIsUploadingToIpfs(false);
        }

    };

    const mintToLottery =  async (ipfsHashLocal) => {
        try {

            const scaledLotteryTokenAmount = ethers.utils.parseEther(LotteryTokenAmount.toString());

            console.log('ipfs hash right before mint call ', ipfsHashLocal);

            const mintTx = await MumasContract.mintMusic(ipfsHashLocal, scaledLotteryTokenAmount);

            await mintTx.wait();

            console.log('minted to lottery');
        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }
        setIsMinting(false);
    }
    return (
        <div className={styles.page_flexBox}>
            <div className={styles.page_container}>
                <h1 className={styles.nft_title}>
                    Upload Music
                </h1>
                <div className={styles.lotto_input_container}>
                    <p className={styles.mintSectionHeaderText}>
                        Upload your music as an mp3 or wav file to share with others
                    </p>
                    <div className={styles.inputField}>
                        <input type="file" onChange={changeHandler} />
                    </div>
                </div>
                <div className={styles.lotto_input_container}>
                    <h1 className={styles.mintSectionHeaderText}>
                        Choose a Song Name
                    </h1>
                    <div className={styles.inputField}>
                        <input
                            type="text"
                            value={SongTitle}
                            onChange={(event) => setSongTitle(event.target.value)}
                            placeholder={'Hardstyle Banger'}
                        />
                    </div>
                </div>
                <div className={styles.lotto_input_container}>
                    <h1 className={styles.mintSectionHeaderText}>
                        How many MUSE tokens should the total lottery pool be?
                    </h1>
                    <div className={styles.inputField}>
                        <input
                            type="text"
                            value={LotteryTokenAmount}
                            onChange={amountChangeHandler}
                            placeholder={10}
                        />
                    </div>
                </div>
                <div className={styles.mintButton}>
                    <button
                        className={styles.button}
                        disabled={SongTitle == '' || isNaN(parseFloat(LotteryTokenAmount)) || !selectedFile || isUploadingToIpfs || isMinting}
                        onClick={handleSubmission}>
                        <b>{isUploadingToIpfs ? 'Uploading to IPFS....' : isMinting ? 'Sending Transaction...' : 'Mint to Lottery'}</b>
                    </button>
                </div>
            </div>
        </div>
    );
}
