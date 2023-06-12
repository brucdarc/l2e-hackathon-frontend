// Import CSS styles, and necessary modules from packages
import styles from "../styles/MusicPlayer.module.css";
import { Contract } from "alchemy-sdk";
import {useEffect, useRef, useState} from "react";
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
import LotteryPopup from "../components/LotteryPopup";
import fa from "@walletconnect/legacy-modal/dist/cjs/browser/languages/fa";


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
        popupOpen: boolean;
    }

    const {data: signer} = useSigner();

    const MumasContract = new Contract('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', abi, signer);
    const museContract = new Contract('0xd481Df2b6638f225ca90d26e08898430AB0d179C', museAbi, signer);

    const [currentLotteryIndex, setCurrentLotteryIndex] = useState(0);
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [userClaimable, setUserClaimable] = useState(0);

    const [updateClaimable, setUpdateClaimable] = useState(0);
    const [claiming, setClaiming] = useState(false);

    const doUpdateClaimable = () =>{
        setUpdateClaimable(updateClaimable + 1);
    }

    const player = useRef();

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
                    popupOpen: false,
                })
            }

            await fetchMetadata(lotties);

            console.log('lotties after fetch ', lotties);

            setLotteries(lotties);
        }

        if(signer) {
            fetchActiveLottos();
        }

    }, [signer]);

    useEffect( () => {

        const fetchBalance = async () => {
            const userAddress = await signer.getAddress()
            const balance = await museContract.balanceOf(userAddress)
            const scaledBalance = ethers.utils.formatEther(balance.toString());
            const res = Math.trunc(parseFloat( scaledBalance ) * 1e4) / 1e4;
            
            const resp = await axios.post('https://backend.listen2win.net/claimable', {
                address: userAddress
            });

            setUserClaimable(Math.trunc(resp.data.claimable_tokens * 1e4) / 1e4);
        }

        if(signer) fetchBalance();

    }, [signer, updateClaimable]);



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


    const onPlayMusic = async () => {
        console.log();

        if(signer) {

            const userAddress = await signer.getAddress()

            await axios.post('https://backend.listen2win.net/play', {
                address: userAddress
            });
            console.log('Sent Play Request To Backend');

            doUpdateClaimable();
        }
    }

    const onPauseMusic = async () => {

        if(signer) {
            const userAddress = await signer.getAddress()

            await axios.post('https://backend.listen2win.net/pause', {
                address: userAddress
            });

            console.log('Sent Pause Request To Backend');

            doUpdateClaimable();
        }
    }

    const claimTokens = async () => {

        //console.log('token balance ', data);

        setClaiming(true);

        try {

            const userAddress = await signer.getAddress()

            const resp = await axios.post('https://backend.listen2win.net/claim', {
                address: userAddress
            });

            const claimTx = await museContract.claimTokens(userAddress, resp.data.claimed_time, resp.data.nonce, resp.data.v, resp.data.r, resp.data.s);

            await claimTx.wait();

            console.log('claimed tokens');
        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }

        setClaiming(false);
    }

    const handlePlay = async (lottery: Lottery, index)=> {
        setCurrentLotteryIndex(index);
        // @ts-ignore
        player?.current.audio.current.play();
        await onPlayMusic();
        doUpdateClaimable();
    }

    const setPopupOpen = async (tokenID, isOpen) => {
        const lottosCopy = [...lotteries];

        for(let i = 0; i<lottosCopy.length; i++){
            if(lottosCopy[i].identifier == tokenID){
                lottosCopy[i].popupOpen = isOpen;
            }
        }
        setLotteries(lottosCopy);
    }

    const nextSong = () => {
        setCurrentLotteryIndex( currentLotteryIndex == lotteries.length - 1 ?
            0 :
            currentLotteryIndex + 1
        );
    }

    const previousSong = () => {
        setCurrentLotteryIndex( currentLotteryIndex == 0 ?
          lotteries.length - 1 :
          currentLotteryIndex - 1
        );
    }

    const RenderSongs = () => (
        <div>

        <div className={styles.song_list_container}>
        {lotteries.map(
            (lottery, index) =>
                <div className={styles.song_container}>
                    <h3 className={styles.song_title_grid}>
                        {lottery.name}
                    </h3>
                    <button
                        className={styles.music_button}
                        onClick={() => handlePlay(lottery, index)}
                    >
                        Play
                    </button>
                    <button className={styles.music_button} onClick={() => setPopupOpen(lottery.identifier, true)}> Enter Lottery </button>
                    <LotteryPopup lottery={lottery} MumasContract={MumasContract} open={lottery.popupOpen} signer={signer} setPopupOpen={setPopupOpen}></LotteryPopup>
                </div>
        )}
        </div>
        </div>
    );

    return (
        <div>
            <div className={styles.title_holder}>
                <h1 className={styles.page_title}>
                    Listen to Music
                </h1>
                <div className={styles.earned_token_holder}>
                    <h2 className={styles.userClaimable}>{userClaimable} MUSE Earned</h2>
                    <button
                        className={styles.claim_button}
                        disabled={claiming}
                        onClick={claimTokens}>
                        {claiming ? 'Claiming...' : 'Claim Now'}
                    </button>
                </div>
            </div>
            <div className={styles.page_flexBox}>
                <div className={styles.page_container}>
                    <h2 className={styles.currently_playing_header}>
                        Currently PLaying:
                    </h2>
                    <h2 className={styles.currently_playing_text}>
                        {lotteries[currentLotteryIndex]?.name}
                    </h2>
                        <div className={styles.audio_player_wrapper}>
                            <AudioPlayer
                                autoPlay={false}
                                src={lotteries[currentLotteryIndex]?.audioUrl}
                                onPlay={e => onPlayMusic()}
                                onPause={e => onPauseMusic()}
                                onClickNext={nextSong}
                                onClickPrevious={previousSong}
                                onEnded={nextSong}
                                showFilledVolume={true}
                                showDownloadProgress={true}
                                showFilledProgress={true}
                                showSkipControls={true}
                                ref={player}
                                // other props here
                            />
                        </div>
                    <RenderSongs/>
                </div>
            </div>
        </div>
    );
}
