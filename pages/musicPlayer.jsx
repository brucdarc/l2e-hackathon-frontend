// Import CSS styles, and necessary modules from packages
import styles from "../styles/MusicPlayer.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";

import { abi } from '../public/MusicalMasterpiecesAbi.json';
import {ethers} from "ethers";

// NFT Minter component
export default function MusicPlayer({
                                    }) {

    const {data: signer} = useSigner();

    const MumasContract = new Contract('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', abi, signer);

    const [currentLotteries, setCurrentLotteries] = useState({});
    const [lotteriesData, setLotteriesData] = useState({});

    const fetchActiveLottos = async () => {
        const activeLotteries = await MumasContract.getAllLotteryURI();
        const moreData = await MumasContract.getLottosByTokensIds(activeLotteries.identifiers, await signer.getAddress());
        console.log('current lotteries ', activeLotteries);
        console.log('more data ', moreData);
        const lotteriesWithIndexes = {
            ...activeLotteries,
            indexes: Array.from({length: activeLotteries.identifiers.length}, (_, i) => i)
        }
        console.log('lotteries with indexes ', lotteriesWithIndexes);
        setCurrentLotteries(lotteriesWithIndexes);
        setLotteriesData(moreData);
    }


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

    //currentTokensInLottos
    //musicMinters
    //tokenAmountTriggers
    //userTokensInLottos
    /*
    <p>
                    Metadata Url
                    {currentLotteries.uris[index]}
                </p>
                <p>
                    Token ID
                    {currentLotteries.identifiers[index].toString()}
                </p>
                <p>
                    Current Tokens In Lotto
                    {lotteriesData.currentTokensInLottos[index].toString()}
                </p>
                <p>
                    Address of Minter
                    {lotteriesData.musicMinters[index].toString()}
                </p>
                <p>
                    Lotto End Trigger Token Amount
                    {ethers.utils.formatEther(lotteriesData.tokenAmountTriggers[index])}
                </p>
                <p>
                    User Tokens In Lotto
                    {ethers.utils.formatEther(lotteriesData.userTokensInLottos[index])}
                </p>
     */

    //currentLotteries?.indexes?.
    const fakeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]

    const RenderSongs = () => (
        <div>

        <div className={styles.song_list_container}>
        {fakeArray.map(
            (index) =>
                <div className={styles.song_container}>
                    <h3 className={styles.do_font}>
                        {'Song Title'}
                    </h3>

                    <button
                        className={styles.music_button}
                    >
                        Play
                    </button>
                    <button
                        className={styles.music_button}
                    >
                        Enter Lottery
                    </button>

                </div>
        )}
        </div>
        </div>
    );


    return (
        <div>
            <h1 className={styles.nft_title}>
                Listen to Music
            </h1>
            <div className={styles.page_flexBox}>
                <div className={styles.page_container}>
                    <h2 className={styles.currently_playing_text}>
                        Currently PLaying: Nothing
                    </h2>
                        <div className={styles.audio_player_wrapper}>
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
                    {/*}
                    <button
                        onClick={fetchActiveLottos}>
                        test shit
                    </button>
                    */}
                    <RenderSongs/>
                </div>
            </div>
        </div>
    );
}
