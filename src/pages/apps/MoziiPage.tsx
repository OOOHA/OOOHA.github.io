import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function MoziiPage() {
  const app = getAppById("mozii")!;
  return <AppPage app={app} />;
}
