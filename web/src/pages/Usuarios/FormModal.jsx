import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import api from "../../services/api";
import { getSession } from "../../services/auth";

const FormModal = ({ show, handleShow, data }) => {
    const [usuario, setUsuario] = useState({});
    const [retorno, setRetorno] = useState({});

    useEffect(() => {
        setUsuario(data);
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            setRetorno({});
        }, 10000);
    }, [retorno]);

    const handeChange = event => {
        setUsuario({
            ...usuario,
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
            if (usuario.id > 0) {
                request = await api.put("usuarios", usuario, opcoes);
            } else {
                request = await api.post("usuarios", usuario, opcoes);
            }

            if (request.data.error) {
                setRetorno({
                    mensagem: request.data.error,
                    className: "danger"
                });
            } else {
                setRetorno({
                    mensagem: "Usuário cadastrado com sucesso!",
                    className: "success"
                });
            }
        } catch (erro) {
            console.log(erro);
        }
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow} className="modal-lg">
                <ModalHeader toggle={handleShow}>{usuario?.nome ? usuario?.nome : "Novo usuário"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label htmlFor="id">ID:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="id"
                                    name="id"
                                    value={usuario?.id}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-sm-12"></div>
                        <div className="col-sm-10 col-lg-10">
                            <div className="form-group">
                                <label htmlFor="nome">Nome:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={usuario?.nome}
                                    onChange={handeChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-10 col-lg-10">
                            <div className="form-group">
                                <label htmlFor="nomeUsuario">Nome de Usuário:</label>
                                <input
                                    className="form-control"
                                    type="text" id="autor"
                                    name="nomeUsuario"
                                    value={usuario?.nomeUsuario}
                                    onChange={handeChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-10 col-lg-10">
                            <div className="form-group">
                                <label htmlFor="email">E-mail:</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={usuario?.email}
                                    onChange={handeChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label htmlFor="nivel">Nível:</label>
                                <select name="nivel" value={usuario?.nivel} className="custom-select" onChange={handeChange} required>
                                    <option value="1">Normal</option>
                                    <option value="2">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
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