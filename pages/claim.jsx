// Import CSS styles, and necessary modules from packages
import styles from "../styles/Mp3Upload.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { abi } from '../public/museAbi.json';
import axios from "axios";

import { useContractRead } from "wagmi";

import { useTokenBalance } from '@usedapp/core'

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// NFT Minter component
export default function Claim({
                                        contentSrc,
                                        contentType,
                                    }) {
    // Get the user's wallet address and status of their connection to it
    const { address, isDisconnected } = useAccount();
    // Get the signer instance for the connected wallet
    const { data: signer } = useSigner();
    // State hooks to track the transaction hash and whether or not the NFT is being minted

    const museBalance = useTokenBalance('0xd481Df2b6638f225ca90d26e08898430AB0d179C', address)

    const { data, isError, isLoading } = useContractRead({
        addressOrName: "0xd481Df2b6638f225ca90d26e08898430AB0d179C",
        contractInterface: abi,
        functionName: "balanceOf",
        args: [address],
    });

    const { testdata, isErrorTest, isLoadingTest } = useContractRead({
        addressOrName: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        contractInterface: abi,
        functionName: "balanceOf",
        args: '0x7713974908Be4BEd47172370115e8b1219F4A5f0',
    });

    const testBalance = async () => {
        console.log('token balance ', data);
        console.log('is error ', isError);
        console.log('is loading ', isLoading);
        console.log('test tok bal ', testdata);
        console.log('is err test ', isErrorTest)
        console.log('is loading test ', isLoadingTest);
    }

    const claimTokens = async () => {

        console.log('token balance ', data);

        try {

            const userAddress = await signer.getAddress()

            const resp = await axios.post('http://localhost:8080/claim', {
                address: userAddress
            });

            console.log('server responce ', resp);

            const museContract = new Contract('0xd481Df2b6638f225ca90d26e08898430AB0d179C', abi, signer);

            const claimTx = await museContract.claimTokens(userAddress, resp.data.claimed_time, resp.data.nonce, resp.data.v, resp.data.r, resp.data.s);

            await claimTx.wait();

            console.log('claimed tokens');
        } catch (e) {
            // If an error occurs, log it to the console and reset isMinting to false
            console.log(e);
        }
    }


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
                        You have {data} tokens
                    </p>
                    <div>
                        <button
                            className={styles.button}
                            onClick={claimTokens}>
                            Claim
                        </button>
                        <button
                            className={styles.button}
                            onClick={testBalance}>
                            Test Balance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
