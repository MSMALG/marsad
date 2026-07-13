import { useState } from "react";
import SecurityAlert from "./SecurityAlert";
import BlockchainRecords from "./BlockchainRecords";

export default function Security() {
  const [screen, setScreen] =
    useState<"alert" | "blockchain">("alert");

  return (
    <>
      {screen === "alert" && (
        <SecurityAlert
          onNavigate={() =>
            setScreen("blockchain")
          }
        />
      )}

      {screen === "blockchain" && (
        <BlockchainRecords
          onBack={() =>
            setScreen("alert")
          }
        />
      )}
    </>
  );
}