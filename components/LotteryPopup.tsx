

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";

import { abi } from '../public/MusicalMasterpiecesAbi.json';
import { abi as museAbi} from '../public/museAbi.json';


import ReactDOM from "react-dom";
import {ethers} from "ethers";

import Popup from 'reactjs-popup';

import Modal from 'react-modal';
//import { Modal } from 'react-responsive-modal';
import styles from "../styles/MusicPlayer.module.css";
import {Contract} from "alchemy-sdk";
import {useState} from "react";



export default function LotteryPopup({
                                        lottery,
                                        open, setPopupOpen, MumasContract, signer
                                     }) {

  const [isTransacting, setIsTransacting] = useState(false);
  const [tokenValue, setTokenValue] = useState('1.0');

  const enterLotto = async (tokenId) => {
    setIsTransacting(true);
    try {

      const scaledLotteryTokenAmount = ethers.utils.parseEther(tokenValue.toString());

      const mintTx = await MumasContract.enterMusicLotto(tokenId, scaledLotteryTokenAmount);

      await mintTx.wait();

      console.log('minted to lottery');

    } catch (e) {
      // If an error occurs, log it to the console and reset isMinting to false
      console.log(e);
    }
    setIsTransacting(false);
  }

  const toEtherAndFixDecimals = (bignumer) => {
    const inEther = ethers.utils.formatEther(bignumer.toString())
    const rounded = Math.round(parseFloat( inEther ) * 1e4) / 1e4
    return rounded;
  }

  const approveTokens = async () => {
    setIsTransacting(true);
    try {

      const largeApproval = '10000000000000000000000000000000000000'

      const museContract = new Contract('0xd481Df2b6638f225ca90d26e08898430AB0d179C', museAbi, signer);

      const approveTx = await museContract.approve('0x142671aa7c6a50638bbc3BDd758eeB76579b3A32', largeApproval);

      await approveTx.wait();

    } catch (e) {
      // If an error occurs, log it to the console and reset isMinting to false
      console.log(e);
    }
    setIsTransacting(false);
  }

  return(
  <Modal className={styles.modal} ariaHideApp={false} isOpen={open}>
    <div className={styles.audio_player_wrapper}>
      <div className={styles.close_corner}>
        <button className={styles.button} onClick={() => setPopupOpen(lottery.identifier, false)}>Close</button>
      </div>
      <h1 className={styles.nft_title}>Win this Music NFT</h1>
      <h2 className={styles.currently_playing_text}>{lottery.name}</h2>
      <div className={styles.lotto_input_container}>
        <div className={styles.amountRow}>
          <h3 className={styles.mintSectionHeaderText}>Tokens in Lottery </h3>
          <div className={styles.topRow}>
          <h3 className={styles.tokenDisplay}>{toEtherAndFixDecimals(lottery.currentTokensInLotto)}</h3>
            <h3 className={styles.tokenDisplay}>MUSE</h3>
          </div>
        </div>
        <div className={styles.amountRow}>
          <h3 className={styles.mintSectionHeaderText}>Your Tokens In Lottery</h3>
          <div className={styles.innerRow}>
          <h3 className={styles.tokenDisplay}>{toEtherAndFixDecimals(lottery.userTokensInLotto)}</h3>
            <h3 className={styles.tokenDisplay}>MUSE</h3>
          </div>
        </div>
        <div className={styles.amountRow}>
          <h3 className={styles.mintSectionHeaderText}>Tokens Needed To End Lottery</h3>
          <div className={styles.bottomRow}>
            <h3 className={styles.tokenDisplay}>{toEtherAndFixDecimals(lottery.tokenAmountTrigger)}</h3>
            <h3 className={styles.tokenDisplay}>MUSE</h3>
          </div>
        </div>
      </div>
      <div className={styles.lotto_input_container}>
        <h3 className={styles.mintSectionHeaderText}>Number of Tokens To Add To Lotto</h3>
        <div className={styles.inputField}>
          <input
            type="text"
            value={tokenValue}
            onChange={(event) => {setTokenValue(event.target.value)}}
            placeholder={'10.0'}
          />
        </div>
        <div className={styles.mintButton}>
          <button className={styles.button}
                  disabled={isTransacting}
                  onClick={() => approveTokens()}> Approve Tokens </button>
        </div>
        <div className={styles.mintButton}>
          <button className={styles.button}
                  disabled={isTransacting}
                  onClick={() => enterLotto(lottery.identifier)}> {'Enter Lottery'} </button>
        </div>
      </div>
    </div>
  </Modal>);

}
