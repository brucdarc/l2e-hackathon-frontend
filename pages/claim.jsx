// Import CSS styles, and necessary modules from packages
import styles from "../styles/Claim.module.css";
import { Contract } from "alchemy-sdk";
import {useEffect, useState} from "react";
import { useAccount, useSigner } from "wagmi";
import { abi } from '../public/museAbi.json';
import axios from "axios";
import { ethers } from "ethers";

// NFT Minter component
export default function Claim({
                                        contentSrc,
                                        contentType,
                                    }) {
    // Get the user's wallet address and status of their connection to it
    const { address, isDisconnected } = useAccount();
    // Get the signer instance for the connected wallet
    const { data: signer } = useSigner();

    const [userBalance, setUserBalance] = useState(0);

    const [userClaimable, setUserClaimable] = useState(0);

    const [claiming, setClaiming] = useState(false);

    const museContract = new Contract('0xd481Df2b6638f225ca90d26e08898430AB0d179C', abi, signer);

    useEffect(() => {

        if(signer) {
            const fetchBalance = async () => {
                const userAddress = await signer.getAddress()
                const balance = await museContract.balanceOf(userAddress)
                const scaledBalance = ethers.utils.formatEther(balance.toString());
                const res = Math.round(scaledBalance * 1e4) / 1e4;

                const resp = await axios.post('http://localhost:8080/claimable', {
                    address: userAddress
                });

                setUserBalance(res);
                setUserClaimable(Math.round(resp.data.claimable_tokens * 1e4) / 1e4);
            }

            fetchBalance();
        }

    }, [signer, claiming]);
    const testBalance = async () => {

        console.log(userBalance);
        /*
        console.log('balance data ', data);
        console.log('is error ', isError);
        console.log('is loading ', isLoading);
        console.log('status ', status);

         */
        //console.log('test tok bal ', testdata);
        //console.log('is err test ', isErrorTest)
        //console.log('is loading test ', isLoadingTest);

        const userAddress = await signer.getAddress()
        const thing = await museContract.balanceOf(userAddress)

        console.log(thing.toString())
    }

    const claimTokens = async () => {

        //console.log('token balance ', data);

        setClaiming(true);

        try {

            const userAddress = await signer.getAddress()

            const resp = await axios.post('http://localhost:8080/claim', {
                address: userAddress
            });

            console.log('server responce ', resp);

            const claimTx = await museContract.claimTokens(userAddress, resp.data.claimed_time, resp.data.nonce, resp.data.v, resp.data.r, resp.data.s);

            await claimTx.wait();

            console.log('claimed tokens');
        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }

        setClaiming(false);
    }

    return (
        <div className={styles.page_flexBox}>
            <div className={styles.page_container}>
                <div>
                    <h1 className={styles.nft_title}>
                        Claim Them Tokens
                    </h1>
                    <p className={styles.text}>
                        You have {userBalance} MUSE
                    </p>
                    <p className={styles.text}>
                        You can claim {userClaimable} MUSE
                    </p>
                    <div>
                        <button
                            className={styles.button}
                            disabled={claiming}
                            onClick={claimTokens}>

                            Claim
                        </button>
                        {/*
                        <button
                            className={styles.button}
                            onClick={testBalance}>
                            Test Balance
                        </button>
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}
