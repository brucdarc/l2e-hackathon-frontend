import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<a href="" target={"_self"}>
				<h1>Listen</h1>
			</a>
			<a href="" target={"_self"}>
				<h1>Claim</h1>
			</a>
			<a href="" target={"_self"}>
				<h1>Upload</h1>
			</a>
			<p> </p>
			<p> </p>
			<ConnectButton></ConnectButton>
		</nav>
	);
}
