import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function AdGuardDNSPage() {
  const app = getAppById("adguard-dns")!;
  return <AppPage app={app} />;
}
