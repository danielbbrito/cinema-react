import { Route, Routes } from "react-router-dom"

import { HomePages } from "../pages/Home"
import { FilmesPages } from "../pages/Filmes"
import { FilmeFormPages } from "../pages/FilmeForm"
import { FilmeDetailsPages } from "../pages/FilmeDetails"
import { SalasPages } from "../pages/Salas"
import { SalaFormPages } from "../pages/SalaForm"
import { SessoesPages } from "../pages/Sessoes"
import { SessaoFormPages } from "../pages/SessaoForm"
import { LancheCombosPages } from "../pages/LancheCombos"
import { LancheComboFormPages } from "../pages/LancheComboForm"
import { PedidosPages } from "../pages/Pedidos"

export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<HomePages />} />
            <Route path="/filmes" element={<FilmesPages />} />
            <Route path="/filmes/novo" element={<FilmeFormPages />} />
            <Route path="/filmes/:id" element={<FilmeDetailsPages />} />
            <Route path="/filmes/:id/editar" element={<FilmeFormPages />} />
            <Route path="/salas" element={<SalasPages />} />
            <Route path="/salas/novo" element={<SalaFormPages />} />
            <Route path="/salas/:id/editar" element={<SalaFormPages />} />
            <Route path="/sessoes" element={<SessoesPages />} />
            <Route path="/sessoes/novo" element={<SessaoFormPages />} />
            <Route path="/sessoes/:id/editar" element={<SessaoFormPages />} />
            <Route path="/lancheCombos" element={<LancheCombosPages />} />
            <Route path="/lancheCombos/novo" element={<LancheComboFormPages />} />
            <Route path="/lancheCombos/:id/editar" element={<LancheComboFormPages />} />
            <Route path="/pedidos" element={<PedidosPages />} />
        </Routes>
    </>
  )
}

