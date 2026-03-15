import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function GPhonesPage() {
  const app = getAppById("gphones")!;
  return <AppPage app={app} />;
}
