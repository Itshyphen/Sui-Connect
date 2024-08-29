import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import {
  ConnectButton,
  useAccountBalance,
  useWallet,
  ErrorCode,
  formatSUI,
  AllDefaultWallets,
  defineStashedWallet,
  WalletProvider,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
function App() {
  const wallet = useWallet();
  const { balance } = useAccountBalance();
  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return "";

    return "00" +Array.from(value)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  }
  function hexToBase64(hex: string): string {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));    
    return btoa(String.fromCharCode(...bytes));
  }

  return (
    <div className="App">      
      <div className="card">
        <ConnectButton
          onConnectError={(error) => {
            if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
              console.warn(
                "user rejected the connection to " + error.details?.wallet
              );
            } else {
              console.warn("unknown connect error: ", error);
            }
          }}
        />

        {!wallet.connected ? (
          <p>Connect DApp with Suiet wallet from now!</p>
        ) : (
          <div>
            <div>
              <p>current wallet: {wallet.adapter?.name}</p>
              <p>
                wallet status:{" "}
                {wallet.connecting
                  ? "connecting"
                  : wallet.connected
                  ? "connected"
                  : "disconnected"}
              </p>
              <p>wallet address: {wallet.account?.address}</p>
              <p>current network: {wallet.chain?.name}</p>
              <p>
                wallet balance:{" "}
                {formatSUI(balance ?? 0, {
                  withAbbr: false,
                })}{" "}
                SUI
              </p>
              <p>
                wallet publicKey: {hexToBase64(uint8arrayToHex(wallet.account?.publicKey!))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider
      defaultWallets={[
        ...AllDefaultWallets,
        defineStashedWallet({
          appName: "Suiet Kit Playground",
        }),
      ]}
    >
      {/* if you want to custiomize you wallet list, please check this doc
          https://kit.suiet.app/docs/components/WalletProvider#customize-your-wallet-list-on-modal
       */}
      <App />
    </WalletProvider>
  </React.StrictMode>
);
