// Import CSS styles, and necessary modules from packages
import styles from "../styles/Mp3Upload.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";

// NFT Minter component
export default function MusicPlayer({
                                    }) {

    const {data: signer} = useSigner();

    const onPlayMusic = async () => {
        console.log();

        if(signer) {

            const userAddress = await signer.getAddress()

            await axios.post('http://localhost:8080/play', {
                address: userAddress
            });
        }
    }

    const onPauseMusic = async () => {

        if(signer) {
            const userAddress = await signer.getAddress()

            await axios.post('http://localhost:8080/pause', {
                address: userAddress
            });
        }
    }


    return (
        <div className={styles.page_flexBox}>
            <div className={styles.page_container}>
                <div>
                    <h1 className={styles.nft_title}>
                        Listen to Music
                    </h1>
                    <AudioPlayer
                        autoPlay
                        src="https://plum-provincial-alpaca-888.mypinata.cloud/ipfs/QmWgSuRaZx1w6RYigYwtzYXoq4vNEFKHQm8vJGgX7XZfnu"
                        onPlay={e => onPlayMusic()}
                        onPause={e => onPauseMusic()}
                        showFilledVolume={true}
                        showDownloadProgress={true}
                        showFilledProgress={true}
                        showSkipControls={true}
                        // other props here
                    />
                </div>
            </div>
        </div>
    );
}
