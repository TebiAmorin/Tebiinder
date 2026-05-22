import { redirect } from "next/navigation";
import { fetchPageData } from "@/lib/fetchPageData";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";

export default async function Admin() {
  const data = await fetchPageData();

  // Gate: only ojeador (admin) role can access
  if (!data.user || data.userRole !== "ojeador") {
    redirect("/");
  }

  return (
    <>
      <Navbar
        user={data.user}
        userRole={data.userRole}
        existingPlayer={data.existingPlayer}
        existingTeam={data.existingTeam}
      />

      <AdminPanel jugadores={data.jugadores} equipos={data.equipos} />
    </>
  );
}
