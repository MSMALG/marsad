import { useState } from "react";
import PhoneShell from "../components/PhoneShell";
import BottomNav from "../components/BottomNav";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Wallets from "../pages/Wallets/Wallets";
import WalletsOverview from "../pages/Wallets/WalletsOverview";
import WalletGenerator from "../pages/Wallets/WalletGenerator";
import AIChat from "../pages/Wallets/AIChat_page";
import Expenses from "../pages/Expenses/Expenses";
import CheaperAlternative from "../pages/cheaper-alternative/CheaperAlternative";
import Security from "../pages/security/Security";
import Investment from "../pages/Investment/Investment";
import Travel from "../pages/travel/Travel";
import CountrySelect from "../pages/CountrySelect/CountrySelect";
import Rewards from "../pages/rewards/Rewards";

import type { Country, Screen } from "../pages/travel/types";

type Page =
  | "login"
  | "dashboard"
  | "wallets"
  | "wallet-detail"
  | "wallet-generator"
  | "ai-chat"
  | "expenses"
  | "investment"
  | "security"
  | "cheaper-alternative"
  | "travel";
const DEFAULT_COUNTRY: Country = {
  flag: "🇺🇸",
  nameAr: "الولايات المتحدة",
  currency: "USD",
  rate: 3.75,
  rateTarget: 3.68,
};

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [selectedWalletId, setSelectedWalletId] = useState<number | undefined>(undefined);

  const [travelScreen, setTravelScreen] = useState<Screen>("travel");
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");

  const navigateTravel = (to: Screen, dir: "forward" | "back" = "forward") => {
    setAnimDir(dir);
    setPrevScreen(travelScreen);
    setTravelScreen(to);
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    navigateTravel("travel", "back");
  };

  const renderContent = () => {
    switch (page) {
      case "login":
        return <Login onLogin={() => setPage("dashboard")} />;
      case "dashboard":
        return (
          <Dashboard
            onOpenWallet={(id) => { setSelectedWalletId(id); setPage("wallet-detail"); }}
          />
        );
      case "wallets":
        return (
          <WalletsOverview
            onOpenWallet={(id) => { setSelectedWalletId(id); setPage("wallet-detail"); }}
            onCreateNew={() => setPage("wallet-generator")}
            onOpenChat={() => setPage("ai-chat")}
          />
        );
      case "wallet-detail":
        return (
          <Wallets
            initialWalletId={selectedWalletId}
            onCreateNew={() => setPage("wallet-generator")}
            onOpenChat={() => setPage("ai-chat")}
            onBack={() => setPage("wallets")}
          />
        );
      case "wallet-generator":
        return <WalletGenerator onBack={() => setPage("wallets")} />;
      case "ai-chat":
        return <AIChat onBack={() => setPage("wallets")} />;
      case "expenses":
        return <Expenses />;
      case "security":
        return <Security />;
      case "cheaper-alternative":
        return <CheaperAlternative />;
      case "travel":
        if (travelScreen === "travel") {
          return (
            <Travel
              country={country}
              animDir={animDir}
              prevScreen={prevScreen}
              onOpenCountrySelect={() => navigateTravel("country-select", "forward")}
              onOpenRewards={() => navigateTravel("rewards", "forward")}
            />
          );
        }
        if (travelScreen === "country-select") {
          return (
            <CountrySelect
              onBack={() => navigateTravel("travel", "back")}
              onSelect={selectCountry}
            />
          );
        }
        if (travelScreen === "rewards") {
          return <Rewards onBack={() => navigateTravel("travel", "back")} />;
        }
        return null;
        case "investment":
  return <Investment />;
      default:
        return null;
    }
  };

  const showNav = page !== "login";

  return (
    <PhoneShell>
      {renderContent()}
      {showNav && <BottomNav active={page} onNavigate={setPage} />}
    </PhoneShell>
  );
}