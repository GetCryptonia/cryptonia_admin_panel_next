import { redirect } from "next/navigation";
import { NAV_HOME } from "@/lib/constants/routes";

export default function Home() {
  redirect(NAV_HOME);
}
