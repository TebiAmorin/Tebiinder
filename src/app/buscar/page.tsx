import { fetchPageData } from "@/lib/fetchPageData";
import Navbar from "@/components/Navbar";
import SearchPage from "@/components/SearchPage";

export default async function Buscar() {
  const data = await fetchPageData();

  return (
    <>
      <Navbar
        user={data.user}
        userRole={data.userRole}
        existingPlayer={data.existingPlayer}
        existingTeam={data.existingTeam}
      />

      <SearchPage
        user={data.user}
        userRole={data.userRole}
        existingPlayer={data.existingPlayer}
        existingTeam={data.existingTeam}
        jugadores={data.jugadores}
        equipos={data.equipos}
        dbStatus={data.dbStatus}
      />
    </>
  );
}
