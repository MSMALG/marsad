import { useState } from "react";
import PhoneShell from "../components/PhoneShell";
import BottomNav from "../components/BottomNav";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Wallets from "../pages/Wallets/Wallets";
import Expenses from "../pages/Expenses/Expenses";
import CheaperAlternative from "../pages/cheaper-alternative/CheaperAlternative";
import Security from "../pages/security/Security";

import Travel from "../pages/travel/Travel";
import CountrySelect from "../pages/CountrySelect/CountrySelect";
import Rewards from "../pages/rewards/Rewards";

import type { Country, Screen } from "../pages/travel/types";

type Page =
  | "login"
  | "dashboard"
  | "wallets"
  | "expenses"
  | "security"
  | "cheaper-alternative"
  | "rewards"
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

  const getActiveTab = () => {
    if (page === "dashboard") return "home";
    if (page === "expenses") return "expenses";
    if (page === "travel") return "invest";
    return "more";
  };


  const renderContent = () => {
    switch (page) {
      case "login":
        return <Login onLogin={() => setPage("dashboard")} />;
      case "dashboard":
        return <Dashboard onNavigate={(p) => setPage(p as Page)} />;
      case "wallets":
        return <Wallets />;
      case "expenses":
        return <Expenses />;
      case "security":
        return <Security />;
        case "rewards":
  return <Rewards onBack={() => setPage("dashboard")} />;
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
      default:
        return null;
    }
    
  };

  const showNav = page !== "login";

  return (
    <PhoneShell>
      {renderContent()}
    {showNav && (
  <BottomNav 
    active={page as any} 
    onNavigate={(p) => setPage(p as Page)} 
  />
)}
    </PhoneShell>
  );
}