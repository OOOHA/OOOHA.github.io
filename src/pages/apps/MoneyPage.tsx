import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function MoneyPage() {
  const app = getAppById("money")!;
  return <AppPage app={app} />;
}
