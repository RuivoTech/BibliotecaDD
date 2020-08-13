import { Request, Response } from "express";

import knex from "../database/connection";
import UsuariosController from "./UsuariosController";
import LivrosController from "./LivrosController";

const usuariosController = new UsuariosController();
const livrosController = new LivrosController();

interface Retirada {
    id?: number,
    ra: number,
    nome: string,
    curso: string,
    livro: string,
    semestre: number
}

interface Importacao {
    ra: number,
    curso: string,
    semestre: number,
    chEsLivro: number,
    nome: string,
    criadoPor: string,
    dataCriado: string,
    alteradPor: string,
    dataAlterado: string
}

class ImportacaoController {
    async index(request: Request, response: Response) {
        try {
            const retiradas = await knex('retiradas_importadas as r')
                .join('livro as l', 'r.chEsLivro', 'l.id_livro')
                .select(
                    "r.id",
                    "r.ra",
                    "r.nome",
                    "r.curso",
                    "r.semestre",
                    knex.raw("DATE_FORMAT(r.dataRetirada, '%Y-%m-%d') as data_retirada"),
                    "r.chEsLivro",
                    "r.criadoPor",
                    knex.raw("DATE_FORMAT(r.dataCriado, '%Y-%m-%d') as dataCriado"),
                    "r.alteradoPor",
                    knex.raw("DATE_FORMAT(r.dataAlterado, '%Y-%m-%d') as dataAlterado"),
                    "l.nome as livro"
                )
                .orderBy([{ column: "r.dataRetirada", order: "desc" }, { column: "r.ra", order: "asc" }]);

            return response.json(retiradas);
        } catch (error) {
            return response.json({ error: error })
        }
    }

    async create(request: Request, response: Response) {
        const retiradas = request.body;

        try {
            const usuario = await usuariosController.getUsuario(String(request.headers.authorization));
            let data = new Date();
            const livros = await livrosController.find();

            const retiradasAlteradas: Importacao[] = retiradas.map((retirada: Retirada) => {
                const livro = livros.filter(livro => livro.nome.toLowerCase() === retirada.livro.toLowerCase());

                return livro[0] && retirada.ra && {
                    ra: retirada.ra,
                    curso: retirada.curso,
                    semestre: retirada.semestre,
                    chEsLivro: livro[0].id_livro,
                    nome: retirada.nome,
                    criadoPor: usuario?.nome,
                    dataCriado: String(data.getFullYear() + "-" + data.getMonth() + "-" + data.getDate())
                };
            });

            const retiradasParaSalvar = retiradasAlteradas.filter(retirada => {
                return retirada;
            });

            await knex("retiradas_importadas").insert(retiradasParaSalvar).timeout(60000);

            return response.json({ mensagem: "Retiradas importadas com sucesso!" });
        } catch (error) {
            return response.json(error)
        }

    }
}

export default ImportacaoController;