// Penulisan nama situs yang seragam: "Betah" + "Jogja" (serif italic, oranye merek).
// Dipakai di mana pun nama situs tampil sebagai merek (navigasi, hero, teks berjalan, kaki halaman).
export function Jogja() {
  return <em className="sorot jogja">Jogja</em>
}

export default function Merek() {
  return <>Betah <Jogja /></>
}
