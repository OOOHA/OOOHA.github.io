import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageLayout from "./components/layout/PageLayout";
import HomePage from "./pages/HomePage";
import MoziiPage from "./pages/apps/MoziiPage";
import MapMemoryPage from "./pages/apps/MapMemoryPage";
import GPhonesPage from "./pages/apps/GPhonesPage";
import AdGuardDNSPage from "./pages/apps/AdGuardDNSPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./i18n";

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/mozii" element={<MoziiPage />} />
            <Route path="/map-memory" element={<MapMemoryPage />} />
            <Route path="/gphones" element={<GPhonesPage />} />
            <Route path="/adguard-dns" element={<AdGuardDNSPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
