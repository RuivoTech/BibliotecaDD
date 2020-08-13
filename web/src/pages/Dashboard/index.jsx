import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from "react-router-dom";

import Tabela from "../../components/Tabela";
import Coluna from "../../components/Coluna";
import api from "../../services/api";
import { getSession } from "../../services/auth";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [livros, setLivros] = useState([]);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    useEffect(() => {
        const requisicao = async () => {
            const token = getSession();
            await api.get("home", {
                headers: {
                    Authorization: `Bearer ${token.token}`
                }
            }).then(response => {
                setLivros(response.data.livros);
                setData(response.data.quantidadeLivros);
            });
        }

        requisicao();
    }, []);

    useEffect(() => {
        setWidth(window.innerWidth / 2);
        setHeight(window.innerHeight / 2);
    }, [windowWidth, windowHeight]);

    const selecionarClassName = (item) => {
        return item.quantidade === 0 ? "table-danger" : item.quantidade <= 5 ? "table-warning" : "table-light";
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ minHeight: "45px" }}>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="btn btn-info" target="_blank" to="/relatorio/emBaixa">Gerar PDF</Link>
                    </li>
                </ul>
                <input className="form-control col-md-5" type="text" placeholder="Pesquisar..." id="pesquisar" />
            </nav>

            <div className="mx-2 pb-5">
                <div className="card overflow-hidden align-items-center">

                    <div className="row " style={{ height: "76vh" }}>
                        <div className="col-sm-6 col-md-6 col-lg-6">
                            <h3 className="h1 text-center">Livros mais retirados</h3>
                            <BarChart width={width} height={height} data={data}>
                                <XAxis dataKey="nome" hide={true} />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid stroke="#0c0c0c" strokeDasharray="5 5" />
                                <Bar dataKey="quantidade" fill="#8884d8" barSize={25} />
                            </BarChart>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-6">
                            <Tabela
                                data={livros}
                                titulo="Livros em baixa quantidade"
                                corLinha={(item) => selecionarClassName(item)}
                            >
                                <Coluna campo="id_livro" titulo="#" tamanho="2" />
                                <Coluna campo="nome" titulo="Nome" tamanho="10" />
                                <Coluna campo="quantidade" titulo="Quantidade" tamanho="3" />
                                <Coluna campo="tipo" titulo="Tipo" tamanho="3" />
                            </Tabela>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;