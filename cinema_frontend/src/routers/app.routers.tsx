import { Route, Routes } from "react-router-dom"

import { HomePages } from "../pages/Home"
import { FilmesPages } from "../pages/Filmes"
import { FilmeFormPages } from "../pages/FilmeForm"
import { FilmeDetailsPages } from "../pages/FilmeDetails"
import { SalasPages } from "../pages/Salas"
import { SalaFormPages } from "../pages/SalaForm"
import { SessoesPages } from "../pages/Sessoes"
import { SessaoFormPages } from "../pages/SessaoForm"

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
        </Routes>
    </>
  )
}

