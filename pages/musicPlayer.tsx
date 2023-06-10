// Import CSS styles, and necessary modules from packages
import styles from "../styles/MusicPlayer.module.css";
import { Contract } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";

import { abi } from '../public/MusicalMasterpiecesAbi.json';
import { abi as museAbi} from '../public/museAbi.json';


import ReactDOM from "react-dom";
import {ethers} from "ethers";

import Popup from 'reactjs-popup';

import Modal from 'react-modal';


// NFT Minter component
export default function MusicPlayer({
                                    }) {
    type Lottery = {
        uri: string;
        identifier: string;
        currentTokensInLotto : string;
        musicMinter : string;
        tokenAmountTrigger: string;
        userTokensInLotto: string;
        name: string;
        audioUrl: string;
    }

    const {data: signer} = useSigner();

    const MumasContract = new Contract('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', abi, signer);

    const [currentSongUrl, setCurrentSongUrl] = useState('');
    const [currentSongName, setCurrentSongName] = useState('Nothing');
    const [lotteries, setLotteries] = useState<Lottery[]>([]);

    const [open, setOpen] = useState(false);

    const [enteringLotto, setEnteringLotto] = useState(false);

    let tokensForLottery;

    const closeModal = () => setOpen(false);

    useEffect(() => {

        const fetchActiveLottos = async () => {
            const activeLotteries = await MumasContract.getAllLotteryURI();
            const moreData = await MumasContract.getLottosByTokensIds(activeLotteries.identifiers, await signer.getAddress());

            let lotties: Lottery[] = []

            for(let i = 0; i < activeLotteries.uris.length; i++){
                lotties.push({
                    uri: activeLotteries.uris[i],
                    identifier: activeLotteries.identifiers[i],
                    currentTokensInLotto : moreData.currentTokensInLottos[i],
                    musicMinter : moreData.musicMinters[i],
                    tokenAmountTrigger: moreData.tokenAmountTriggers[i],
                    userTokensInLotto: moreData.userTokensInLottos[i],
                    name: '',
                    audioUrl: '',
                })
            }

            await fetchMetadata(lotties);

            console.log('lotties after fetch ', lotties);

            setLotteries(lotties);
        }

        if(signer) {
            fetchActiveLottos();
        }

    }, [signer, enteringLotto]);

    const fetchMetadata = async (lotties) => {

        let promises = []

         lotties.forEach((lottery) => {
            let prom = axios.get(lottery.uri).then( (ipfsResponse) => {
                lottery.name = ipfsResponse.data.name;
                lottery.audioUrl = ipfsResponse.data.audio;
            });
            promises.push(prom);
        })

        await Promise.all(promises);

    }

    const enterLotto = async (tokenId) => {
        setEnteringLotto(true);
        try {

            const scaledLotteryTokenAmount = ethers.utils.parseEther(tokensForLottery.toString());

            const mintTx = await MumasContract.enterMusicLotto(tokenId, scaledLotteryTokenAmount);

            await mintTx.wait();

            console.log('minted to lottery');

        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }
        setEnteringLotto(false);
    }

    const approveTokens = async () => {
        try {

            const largeApproval = '10000000000000000000000000000000000000'

            const museContract = new Contract('0xd481Df2b6638f225ca90d26e08898430AB0d179C', museAbi, signer);

            const approveTx = await museContract.approve('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', largeApproval);

            await approveTx.wait();

        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }
    }


    const onPlayMusic = async () => {
        console.log();

        if(signer) {

            const userAddress = await signer.getAddress()

            await axios.post('http://listen-2-win.us-east-2.elasticbeanstalk.com/play', {
                address: userAddress
            });
        }
    }

    const onPauseMusic = async () => {

        if(signer) {
            const userAddress = await signer.getAddress()

            await axios.post('http://listen-2-win.us-east-2.elasticbeanstalk.com/pause', {
                address: userAddress
            });
        }
    }

    const handlePlay = async (lottery: Lottery)=> {
        setCurrentSongUrl(lottery.audioUrl);
        setCurrentSongName(lottery.name);
        await onPlayMusic();
    }

    const RenderSongs = () => (
        <div>

        <div className={styles.song_list_container}>
        {lotteries.map(
            (lottery) =>
                <div className={styles.song_container}>
                    <h3 className={styles.do_font}>
                        {lottery.name}
                    </h3>

                    <button
                        className={styles.music_button}
                        onClick={() => handlePlay(lottery)}
                    >
                        Play
                    </button>
                    <button className={styles.music_button} onClick={() => setOpen(true)}> Enter Lottery </button>
                    <Modal className={styles.modal} ariaHideApp={false} isOpen={open} onRequestClose={() => setOpen(false)}>
                        <div className={styles.close_corner}>
                            <button className={styles.button} onClick={() => closeModal()}>Close</button>
                        </div>
                        <h1 className={styles.nft_title}>Win this Music NFT</h1>
                        <h2 className={styles.currently_playing_text}>{lottery.name}</h2>
                        <div className={styles.lotto_input_container}>
                            <h3 className={styles.mintSectionHeaderText}>Tokens in Lottery {ethers.utils.formatEther(lottery.currentTokensInLotto.toString())}</h3>
                            <h3 className={styles.mintSectionHeaderText}>Your Tokens In Lottery: {ethers.utils.formatEther(lottery.userTokensInLotto.toString())}</h3>
                            <h3 className={styles.mintSectionHeaderText}>Tokens Needed To End Lottery: {ethers.utils.formatEther(lottery.tokenAmountTrigger.toString())}</h3>
                        </div>
                        <div className={styles.lotto_input_container}>
                            <h3 className={styles.mintSectionHeaderText}>Number of Tokens To Add To Lotto</h3>
                            <div className={styles.inputField}>
                                <input
                                  type="text"
                                  value={tokensForLottery}
                                  onChange={(event) => {tokensForLottery = event.target.value}}
                                  placeholder={'10.0'}
                                />
                            </div>
                            <div className={styles.mintButton}>
                                <button className={styles.button}
                                        onClick={() => approveTokens()}> Approve Tokens </button>
                            </div>
                            <div className={styles.mintButton}>
                                <button className={styles.button}
                                        disabled={enteringLotto}
                                        onClick={() => enterLotto(lottery.identifier)}> {'Enter Lottery'} </button>
                            </div>
                        </div>
                    </Modal>
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
                    <h2 className={styles.currently_playing_header}>
                        Currently PLaying:
                    </h2>
                    <h2 className={styles.currently_playing_text}>
                        {currentSongName}
                    </h2>
                        <div className={styles.audio_player_wrapper}>
                            <AudioPlayer
                                autoPlay
                                src={currentSongUrl}
                                onPlay={e => onPlayMusic()}
                                onPause={e => onPauseMusic()}
                                showFilledVolume={true}
                                showDownloadProgress={true}
                                showFilledProgress={true}
                                showSkipControls={true}
                                // other props here
                            />
                        </div>
                    <RenderSongs/>
                </div>
            </div>
        </div>
    );
}
