import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";

const RelatorioModal = ({ show, handleShow }) => {
    const [datas, setDatas] = useState({
        dataInicio: "0000-00-00",
        dataFim: "0000-00-00"
    });

    const handleChange = event => {
        console.log(event.target)
        setDatas({
            ...datas,
            [event.target.name]: event.target.value
        })
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow}>
                <ModalHeader toggle={handleShow}>
                    Relatório de Retiradas
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label for="dataInicio">Data inicio:</label>
                                <input
                                    className="form-control"
                                    id="dataInicio"
                                    name="dataInicio"
                                    type="date"
                                    value={datas.dataInicio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label for="dataFim">Data fim:</label>
                                <input
                                    className="form-control"
                                    id="dataFim"
                                    name="dataFim"
                                    type="date"
                                    value={datas.dataFim}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Link to={"/relatorio/retiradas/" + datas.dataInicio + "/" + datas.dataFim} target="_blank" className="btn btn-success btn-lg">Gerar Relatório</Link>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default RelatorioModal;