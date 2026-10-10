import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function WiregramPage() {
  const app = getAppById("wiregram")!;
  return <AppPage app={app} />;
}
