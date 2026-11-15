import { CabinetPage } from "../../components/account/cabinet/CabinetPage";
import { getText } from "../../lib/content/server";

/** The page's title, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return { title: t("meta.account.title") };
}

/** The signed-in customer's own page: their details and their orders. */
export default function AccountPage() {
  return <CabinetPage />;
}
