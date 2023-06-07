import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";

//import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli } from '@usedapp/core'

import { useContractRead } from 'wagmi'
import {abi as museAbi} from '../../public/museAbi.json';

export default function Navbar() {

	return (
		<nav className={styles.navbar}>
			<a href="/musicPlayer" target={"_self"}>
				<h1>Listen</h1>
			</a>
			<a href="/claim" target={"_self"}>
				<h1>Claim</h1>
			</a>
			<a href="/upload" target={"_self"}>
				<h1>Upload</h1>
			</a>
			<p> </p>
			<p> </p>
			<ConnectButton showBalance={true}></ConnectButton>
		</nav>
	);
}
