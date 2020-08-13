import React, { useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";
import XLSX from 'xlsx';

import api from "../../services/api";
import Tabela from "../../components/Tabela";
import Coluna from "../../components/Coluna";
import { getSession } from "../../services/auth";

const ImportarModal = ({ show, handleShow }) => {
    const [semestre, setSemestre] = useState(0);
    const [anosSemestre, setAnosSemestre] = useState([]);
    const [anoSemestre, setAnoSemestre] = useState(new Date().getFullYear());
    const [file, setFile] = useState({});
    const [data, setData] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [retorno, setRetorno] = useState({});

    useEffect(() => {
        const anoInicial = new Date().getFullYear() - 6;
        const anoFinal = new Date().getFullYear() + 5;
        const anos = Array(anoFinal - anoInicial).fill('').map((v, idx) => anoFinal - idx);

        setAnosSemestre(anos);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (semestre === 0) {
            setRetorno({
                mensagem: "Por favor, selecione um semestre.",
                className: "danger"
            });
            return;
        }

        setCarregando(true);
        const session = getSession();

        const retiradas = data.map(retirada => {
            return retirada.ra !== "" ? {
                ra: retirada.ra,
                nome: retirada.nome,
                curso: retirada.curso,
                semestre,
                anoSemestre,
                livro: retirada.livro
            } : null
        });

        api.post("/importarRetirada", retiradas, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        })
            .then(response => {
                setRetorno({
                    mensagem: response.data.mensagem,
                    className: "success"
                });
                setCarregando(false);
            }).catch(error => {
                setCarregando(false);
                console.log(error);
                setRetorno({
                    mensagem: "Erro ao tentar importar os dados.",
                    className: "danger"
                });
            });
    }

    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) setFile(files[0]);
    };

    const handleFile = () => {
        setCarregando(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: ["ra", "nome", "unidade", "curso", "livro"] });
            /* Update state */
            data.splice(0, 1);
            setData(data);
        };

        reader.readAsArrayBuffer(file);
        setCarregando(false);
    }

    return (
        <>
            <Modal isOpen={show} toggle={handleShow} className="modal-xl">
                <ModalHeader toggle={handleShow}>Importar Retiradas</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-2">
                            <select className="custom-select" name="semestre" value={semestre} onChange={e => setSemestre(e.target.value)}>
                                <option value="0">Semestre...</option>
                                <option value="1">01</option>
                                <option value="2">02</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <select
                                className="custom-select"
                                name="anoSemestre"
                                value={anoSemestre}
                                onChange={e => setAnoSemestre(e.target.value)}
                            >
                                {anosSemestre.map((anoSemestre, index) => {
                                    return <option key={index} value={anoSemestre}>{anoSemestre}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <input type="file" className="form-control-file" id="file" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-4">
                            <button
                                type="button"
                                className="btn btn-success"
                                disabled={carregando}
                                onClick={handleFile}
                            >
                                {carregando ? "Aguarde..." : "Importar"}
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Tabela data={data} titulo="Retiradas Importadas">
                                <Coluna campo="ra" titulo="RA" />
                                <Coluna campo="nome" titulo="Aluno" />
                                <Coluna campo="curso" titulo="Curso" />
                                <Coluna campo="livro" titulo="Livro" />
                            </Tabela>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {retorno &&
                        <div className={"bg-" + retorno.className + " align-middle rounded d-flex align-items-center justify-content-center"} style={{ minWidth: "30em", left: "1em", position: "absolute" }}>
                            <p className="text-white">
                                {retorno.mensagem}
                            </p>
                        </div>}
                    <button type="submit" className="btn btn-success mr-2" onClick={handleSubmit} disabled={carregando}>Salvar</button>
                    <button type="button" className="btn btn-danger ml-2" onClick={handleShow}>Cancelar</button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default ImportarModal;