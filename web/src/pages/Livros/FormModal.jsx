import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import api from "../../services/api";
import { getSession } from "../../services/auth";
import Utils from "../../components/Utils";

const FormModal = ({ show, handleShow, data }) => {
    const [livro, setLivro] = useState({});
    const [retorno, setRetorno] = useState({});

    useEffect(() => {
        setLivro(data);
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            setRetorno({});
        }, 10000);
    }, [retorno]);

    const handeChange = event => {
        setLivro({
            ...livro,
            [event.target.name]: event.target.value
        });
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
            if (livro.id_livro > 0) {
                request = await api.put("livros", livro, opcoes)
            } else {
                request = await api.post("livros", livro, opcoes);
            }

            if (request.data.error) {
                setRetorno({
                    mensagem: request.data.error,
                    className: "danger"
                });
            } else {
                setRetorno({
                    mensagem: "Livro cadastrado com sucesso",
                    className: "success"
                });

                setLivro({
                    id_livro: "",
                    nome: "",
                    autor: "",
                    quantidade: "",
                    tipo: ""
                });
            }
        } catch (erro) {
            console.log(erro);
        }
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow} className="modal-lg">
                <ModalHeader toggle={handleShow}>{livro?.nome ? livro?.nome : "Novo livro"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label htmlFor="id_livro">ID:</label>
                                <input className="form-control" type="text" id="id_livro" name="id_livro" value={livro.id_livro}
                                    disabled />
                            </div>
                        </div>
                        <div className="col-sm-10 col-lg-10">
                            <div className="form-group">
                                <label htmlFor="nome">Nome:</label>
                                <input className="form-control" type="text" id="nome" name="nome" value={livro.nome}
                                    onChange={handeChange} />
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label htmlFor="autor">Autor:</label>
                                <input className="form-control" type="text" id="autor" name="autor" value={livro.autor}
                                    onChange={handeChange} />
                            </div>
                        </div>
                        <div className="col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label htmlFor="quantidade">Quantidade:</label>
                                <input className="form-control" type="number" id="quantidade" name="quantidade" value={livro.quantidade}
                                    onChange={handeChange} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label htmlFor="tipo">Tipo:</label>
                                <select name="tipo" value={livro.tipo} className="custom-select" onChange={handeChange} required>
                                    <option>Selecione um tipo...</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Engenharia">Engenharia</option>
                                    <option value="Gastronomia">Gastronomia</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div style={{ left: "1em", position: "absolute" }}>
                        {livro.criadoPor &&

                            <p className="h6 -text-dark">Criado por:
                                <span className="text-primary">
                                    {livro.criadoPor}
                                </span>
                                {" "}no dia{" "}
                                <span className="text-primary">
                                    {Utils.converteData(livro, "dataCriado", "DD/MM/YYYY")}
                                </span>
                            </p>}
                        {livro.alteradoPor &&
                            <p className="h6 -text-dark">Alterado por:
                                <span className="text-primary">
                                    {livro.alteradoPor}
                                </span>
                                {" "}no dia{" "}
                                <span className="text-primary">
                                    {Utils.converteData(livro, "dataAlterado", "DD/MM/YYYY")}
                                </span>
                            </p>
                        }
                    </div>
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