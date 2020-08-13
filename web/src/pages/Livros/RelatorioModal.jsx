import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";

const RelatorioModal = ({ show, handleShow }) => {
    const [tipo, setTipo] = useState("todos");

    const handleChange = event => {
        setTipo(event.target.value)
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow}>
                <ModalHeader toggle={handleShow}>
                    Relatório de Livros
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-6">Tipo do livro:</div>
                        <div className="col-sm-10">
                            <div className="custom-control custom-radio">
                                <input
                                    className="custom-control-input"
                                    id="todos"
                                    type="radio"
                                    name="tipo"
                                    value="todos"
                                    checked={tipo === "todos"}
                                    onClick={handleChange}
                                />
                                <label className="custom-control-label" for="todos">Todos</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    className="custom-control-input"
                                    id="engenharia"
                                    name="tipo"
                                    type="radio"
                                    value="engenharia"
                                    checked={tipo === "engenharia"}
                                    onClick={handleChange}
                                />
                                <label className="custom-control-label" for="engenharia">Engenharia</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    className="custom-control-input"
                                    id="normal"
                                    name="tipo"
                                    type="radio"
                                    value="normal"
                                    checked={tipo === "normal"}
                                    onClick={handleChange}
                                />
                                <label className="custom-control-label" for="normal">Normal</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    className="custom-control-input"
                                    id="gastronomia"
                                    name="tipo"
                                    type="radio"
                                    value="gastronomia"
                                    checked={tipo === "gastronomia"}
                                    onClick={handleChange}
                                />
                                <label className="custom-control-label" for="gastronomia">Gastronomia</label>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Link to={"/relatorio/livros/" + tipo} target="_blank" className="btn btn-success btn-lg">Gerar Relatório</Link>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default RelatorioModal;