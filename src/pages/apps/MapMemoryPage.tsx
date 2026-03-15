import { getAppById } from "../../data/apps";
import AppPage from "../AppPage";

export default function MapMemoryPage() {
  const app = getAppById("map-memory")!;
  return <AppPage app={app} />;
}
