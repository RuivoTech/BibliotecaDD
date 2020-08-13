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
    semestre: number,
    anoSemestre: string,
    data_retirada: string,
    id_livroRetirada: number,
    alteradoPor: string,
    dataAlterado: string
}

interface Importacao {
    id?: number,
    ra: string,
    curso: string,
    semestre: number,
    chEsLivro: number,
    nome: string,
    criadoPor: string,
    dataCriado: string,
    alteradoPor: string,
    dataAlterado: string
}

class ImportacaoController {
    async index(request: Request, response: Response) {
        try {
            const { semestre, anoSemestre } = request.query;

            const retiradas = await knex('retiradas_importadas as r')
                .where({
                    semestre,
                    anoSemestre
                })
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
                    anoSemestre: retirada.anoSemestre,
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

    async updateOne(request: Request, response: Response) {
        const {
            id,
            ra,
            nome,
            curso,
            semestre,
            chEsLivro,
            criadoPor,
            dataCriado
        } = request.body;
        let data = new Date()
        try {
            const usuario = await usuariosController.getUsuario(String(request.headers.authorization));

            const retirada: Importacao = {
                id,
                ra,
                nome,
                curso,
                semestre,
                chEsLivro,
                criadoPor,
                dataCriado,
                alteradoPor: String(usuario?.nome),
                dataAlterado: String(data.getFullYear() + "-" + data.getMonth() + "-" + data.getDate())
            };

            await knex('retiradas_importadas').update(retirada).where({ id });

            return response.json(retirada);
        } catch (error) {
            return response.json({ error: error })
        }

    }

    async update(request: Request, response: Response) {
        const ids = request.body;

        let data = new Date();

        try {
            const usuario = await usuariosController.getUsuario(String(request.headers.authorization));

            const retiradasImportadas = await knex<Importacao>("retiradas_importadas").whereIn("id", ids);

            const retiradasInserir = retiradasImportadas.map(retirada => {
                return {
                    ra: retirada.ra.replace("-", ""),
                    curso: retirada.curso,
                    semestre: retirada.semestre,
                    id_livroRetirada: retirada.chEsLivro,
                    data_retirada: String(data.getFullYear() + "-" + data.getMonth() + "-" + data.getDate()),
                    nome: retirada.nome,
                    criadoPor: retirada.criadoPor,
                    dataCriado: retirada.dataCriado,
                    alteradoPor: usuario?.nome,
                    dataAlterado: String(data.getFullYear() + "-" + data.getMonth() + "-" + data.getDate())
                }
            });

            await knex("retirada").insert(retiradasInserir).then(async response => {
                await knex("retiradas_importadas")
                    .delete()
                    .whereIn("id", ids);
            });

            return response.json(retiradasInserir);
        } catch (error) {
            return response.json({ error: error })
        }

    }

    async delete(request: Request, response: Response) {
        try {
            const ids = request.body;
            console.log(ids);

            /*await knex("retiradas_importadas")
                .delete()
                .whereIn("id", ids);*/

            return response.json({ mensagem: "Retiradas removidas com sucesso!" });
        } catch (error) {
            return response.json({ error });
        }
    }
}

export default ImportacaoController;