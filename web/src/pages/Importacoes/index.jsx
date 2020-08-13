import React, { useState, useEffect } from "react";

import api from "../../services/api";
import FormModal from "./FormModal";
import { getSession } from "../../services/auth";
import Tabela from "../../components/Tabela";
import Coluna from "../../components/Coluna";
import ImportarModal from "./ImportarModal";

const Importacoes = () => {
    const token = getSession();
    const [retiradas, setRetiradas] = useState([]);
    const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [show, setShow] = useState(false);
    const [retiradaSelecionada, setRetiradaSelecionada] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [className, setClassName] = useState("");
    const [showImportar, setShowImportar] = useState(false);
    const [itemsRetirar, setItemsRetirar] = useState([]);
    const [semestre, setSemestre] = useState(0);
    const [anosSemestre, setAnosSemestre] = useState([]);
    const [anoSemestre, setAnoSemestre] = useState(new Date().getFullYear());

    useEffect(() => {
        const requisicao = async () => {
            await api.get("importacoes", {
                params: {
                    semestre,
                    anoSemestre
                },
                headers: {
                    Authorization: `Bearer ${token.token}`
                }
            }).then(response => {
                setRetiradas(response.data);
                setRetiradasFiltradas(response.data);
            });
        }

        requisicao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semestre, anoSemestre]);

    useEffect(() => {
        const anoInicial = new Date().getFullYear() - 6;
        const anoFinal = new Date().getFullYear() + 5;
        const anos = Array(anoFinal - anoInicial).fill('').map((v, idx) => anoFinal - idx);

        setAnosSemestre(anos);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setMensagem("");
            setClassName("");
        }, 3000);
    }, [mensagem]);

    const handleChangePesquisa = event => {
        const filtroRetiradas = retiradas.filter((retirada) => {
            return retirada.nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .includes(
                    event.target.value
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                );
        });
        setPesquisa(event.target.value);

        setRetiradasFiltradas(filtroRetiradas);
    }

    const handleShow = (retirada = {}) => {
        setRetiradaSelecionada(retirada);

        setShow(!show);
    }

    const handleShowImportar = () => {
        setShowImportar(!showImportar);
    }

    const handleSave = async () => {
        const response = await api.put("/importacoes", itemsRetirar, {
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        });

        if (!response.data.error) {
            const items = retiradas.filter(retirada => !itemsRetirar.includes(retirada.id));

            setRetiradas(items);
            setRetiradasFiltradas(items);
            setItemsRetirar([]);

            setMensagem("Retirada salva com sucesso.");
            setClassName("bg-success");
        } else {
            setMensagem(response.data.error);
            setClassName("bg-danger");
        }
    }

    const handleCheck = (id) => {
        const itemsExistem = itemsRetirar.findIndex(item => item === id);

        if (itemsExistem >= 0) {
            const itemsFiltrados = itemsRetirar.filter(item => item !== id);

            setItemsRetirar(itemsFiltrados);
        } else {
            setItemsRetirar([...itemsRetirar, id]);
        }
    }

    const handleCheckAll = (event) => {
        if (event.target.checked) {
            const items = retiradas.map(retirada => retirada.id);
            setItemsRetirar(items);
        } else {
            setItemsRetirar([]);
        }
    }

    const renderSelectedItems = (item) => {
        return <input
            type="checkbox"
            value={item.id}
            onChange={() => handleCheck(item.id)}
            title={`Selecionar para retirar -> ${item.id} - ${item.nome}`}
            checked={itemsRetirar.includes(item.id)}
        />
    }

    const renderOpcoes = (item) => {
        return (
            <>
                <button className="btn btn-primary btn-sm mx-2" onClick={() => handleShow(item)}>Editar</button>
            </>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <ul className="navbar-nav mr-auto">
                    <button className="btn btn-primary ml-2" onClick={() => handleShowImportar()}>Importar Retiradas</button>
                </ul>

                <input
                    className="form-control col-md-5"
                    type="text"
                    placeholder="Pesquisar..."
                    value={pesquisa}
                    onChange={handleChangePesquisa}
                />
            </nav>
            <div className="mx-2 pb-5">
                <div className="card align-items-center" style={{ height: "76vh" }}>
                    <div className="col-12">
                        <div className="row my-3">
                            <div className="col-1">
                                <select
                                    name="semestre"
                                    id="semestre"
                                    className="custom-select"
                                    value={semestre}
                                    onChange={e => setSemestre(e.target.value)}
                                >
                                    <option value="0">Semestre</option>
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                </select>
                            </div>
                            <div className="col-1">
                                <select
                                    name="anoSemestre"
                                    id="anoSemestre"
                                    className="custom-select"
                                    value={anoSemestre}
                                    onChange={e => setAnoSemestre(e.target.value)}
                                >
                                    {anosSemestre.map((anoSemestre, index) => {
                                        return <option key={index} value={anoSemestre}>{anoSemestre}</option>
                                    })}
                                </select>
                            </div>
                            {mensagem &&
                                <div
                                    className={className}
                                    style={{
                                        maxHeight: "3vh",
                                        borderRadius: "3rem",
                                        minWidth: "30vw",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    <p className="text-white" style={{ fontSize: 20, lineHeight: 1 }}>
                                        {mensagem}
                                    </p>
                                </div>}
                        </div>
                        <Tabela
                            data={retiradasFiltradas}
                            titulo="Retiradas importadas"
                            tituloBotao="Salvar"
                            mostrarBotaoNovo={retiradas.length}
                            handleShow={handleSave}
                        >
                            <Coluna
                                campo="id"
                                titulo={<input type="checkbox" onChange={handleCheckAll} title="Selecionar todos para retirar" />}
                                tamanho="2"
                                corpo={(item) => renderSelectedItems(item)}
                            />
                            <Coluna campo="ra" titulo="RA" tamanho="4" />
                            <Coluna campo="nome" titulo="Nome" tamanho="10" />
                            <Coluna campo="curso" titulo="Curso" tamanho="4" />
                            <Coluna campo="livro" titulo="Livro" tamanho="10" />
                            <Coluna titulo="Opções" corpo={(item) => renderOpcoes(item)} tamanho="2" />
                        </Tabela>
                    </div>
                </div>
            </div>
            <FormModal show={show} handleShow={handleShow} data={retiradaSelecionada} />
            <ImportarModal show={showImportar} handleShow={handleShowImportar} />
        </>
    )
}

export default Importacoes;