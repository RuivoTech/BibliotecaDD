import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Autocomplete from "../../components/Autocomplete";
import api from "../../services/api";
import { getSession } from "../../services/auth";
import Tabela from "../../components/Tabela";
import Coluna from "../../components/Coluna";
import Utils from "../../components/Utils";

const FormModal = ({ show, handleShow, data }) => {
    const [retirada, setRetirada] = useState({});
    const [value, setValue] = useState("");
    const [livrosRetirada, setLivrosRetirada] = useState([]);
    const [livros, setLivros] = useState([]);
    const [retorno, setRetorno] = useState({});

    useEffect(() => {
        setRetirada(data);
    }, [data]);

    useEffect(() => {
        const request = async () => {
            const session = getSession();
            const response = await api.get("livros", {
                headers: {
                    Authorization: `Bearer ${session.token}`
                },
                params: {
                    emEstoque: true
                }
            });

            setLivros(response.data);
        }

        request();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setRetorno({})
        }, 5000);
    }, [retorno])

    const handleChange = event => {
        setRetirada({
            ...retirada,
            [event.target.name]: event.target.value
        });
    }

    const handleClick = (item) => {
        const livroRetirada = livrosRetirada.findIndex(livro => livro.id_livro === item.id_livro);

        if (livroRetirada >= 0) {
            const livrosFiltrados = livrosRetirada.filter(livro => livro.id_livro !== item.id_livro);

            setLivrosRetirada(livrosFiltrados);
        } else {
            setLivrosRetirada([...livrosRetirada, item])
        }
        setValue("");
    }

    const handleClickLivro = (item) => {
        setRetirada({
            ...retirada,
            livro: item.nome,
            id_livroRetirada: item.id_livro
        });
    }

    const handleValue = event => {
        setValue(event.target.value);
    }

    const handleSubmit = async event => {
        event.preventDefault();
        let request = "";
        const session = getSession();
        const opcoes = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        try {
            if (retirada.id_retirada > 0) {
                request = await api.put("retiradas", retirada, opcoes)
            } else {
                request = await api.post("retiradas", { retirada, livros_retirada: livrosRetirada }, opcoes);
            }

            if (request.data.error) {
                setRetorno({
                    mensagem: request.data.error,
                    className: "danger"
                });
            } else {
                setRetorno({
                    mensagem: "Retirada cadastrada com sucesso",
                    className: "success"
                });
                setRetirada({
                    ra: "",
                    nome: "",
                    cusr: "",
                    semestre: "",
                    data_retirada: ""
                });
                setLivrosRetirada([]);
            }
        } catch (erro) {
            console.log(erro);
        }

        setTimeout(() => {
            setRetorno({});
        }, 5000);
    }

    const renderOpcoes = (item) => {
        return (
            <button className="btn btn-danger btn-sm" onClick={() => handleClick(item)}>Remover</button>
        )
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow} className="modal-lg">
                <ModalHeader toggle={handleShow}>{retirada?.nome ? retirada?.nome : "Nova retirada"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label htmlFor="id_retirada">ID:</label>
                                <input
                                    className="form-control"
                                    type="text" id="id_retirada"
                                    name="id_retirada"
                                    value={retirada.id_retirada}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-sm-3 col-lg-3">
                            <div className="form-group">
                                <label htmlFor="ra">RA:</label>
                                <input className="form-control" type="text" id="ra" name="ra" value={retirada.ra}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-sm-7 col-lg-7">
                            <div className="form-group">
                                <label htmlFor="nome">Nome:</label>
                                <input className="form-control" type="text" id="nome" name="nome" value={retirada.nome}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label htmlFor="curso">Curso:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="curso"
                                    name="curso"
                                    value={retirada.curso}
                                    style={{ textTransform: "uppercase" }}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label htmlFor="semestre">Semestre:</label>
                                <input className="form-control" type="text" id="semestre" name="semestre" value={retirada.semestre}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label htmlFor="data_retirada">Data Retirada:</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="data_retirada"
                                    name="data_retirada"
                                    value={retirada.data_retirada}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {!data.id_retirada ?
                            <>
                                <div className="col-sm-8 col-md-8 col-lg-8 my-4">
                                    <label htmlFor="livros">Adicionar livro:</label>
                                    <Autocomplete className="form-control" id="livros" name="livros" suggestions={livros}
                                        onClick={(item) => handleClick(item)}
                                        field="nome" value={value} onChange={handleValue} />
                                </div>
                                <div className="col-md-12" style={{ maxHeight: "50vh" }}>
                                    <Tabela data={livrosRetirada} maxHeight="20vh">
                                        <Coluna campo="nome" titulo="Nome" tamanho="7" />
                                        <Coluna campo="autor" titulo="Autor" tamanho="7" />
                                        <Coluna campo="id_livro" titulo="Opções" tamanho="2" corpo={(item) => renderOpcoes(item)} />
                                    </Tabela>
                                </div>
                            </> :
                            <>
                                <div className="col-sm-8 col-md-8 col-lg-8">
                                    <label htmlFor="livro">Livro:</label>
                                    <Autocomplete className="form-control" id="livro" name="livro" suggestions={livros}
                                        onClick={(item) => handleClickLivro(item)}
                                        field="nome" value={retirada.livro} onChange={handleChange} />
                                </div>
                                <div className="col-sm-2 col-md-2 col-lg-2">
                                    <div className="form-group">
                                        <label htmlFor="id_livroRetirada">ID:</label>
                                        <input className="form-control" type="text" id="id_livroRetirada" name="id_livroRetirada" value={retirada?.id_livroRetirada}
                                            onChange={handleChange} disabled />
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    {retirada.criadoPor && retirada.alteradoPor &&
                        <div style={{ left: "1em", position: "absolute" }}>
                            <p className="h6 -text-dark">Criado por:
                                <span className="text-primary">
                                    {retirada.criadoPor}
                                </span>
                                {" "}no dia{" "}
                                <span className="text-primary">
                                    {Utils.converteData(retirada, "dataCriado", "DD/MM/YYYY")}
                                </span>
                            </p>
                            <p className="h6 -text-dark">Alterado por:
                                <span className="text-primary">
                                    {retirada.alteradoPor}
                                </span>
                                {" "}no dia{" "}
                                <span className="text-primary">
                                    {Utils.converteData(retirada, "dataAlterado", "DD/MM/YYYY")}
                                </span>
                            </p>
                        </div>}
                    {retorno &&
                        <div className={"bg-" + retorno.className + " align-middle rounded"} style={{ minWidth: "30em", left: "1em", position: "absolute" }}>
                            <p className="text-white px-2 align-middle" style={{ fontSize: 20 }}>
                                {retorno.mensagem}
                            </p>
                        </div>}
                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>Salvar</button>{' '}
                    <button type="button" className="btn btn-danger" onClick={handleShow}>Cancelar</button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default FormModal;