import React, { useState } from "react";

import Paginacao from "../Paginacao";

import "./styles.css";

const Tabela = ({ titulo, tituloBotao, mostrarBotaoNovo, data, handleShow, height, corLinha, maxHeight, children = [] }) => {
    const [items, setItems] = useState([]);

    const renderValor = (campo, item) => {
        const [grupo, subGrupo] = campo.split(".");
        let retorno = "";

        if (subGrupo) {
            retorno = item[grupo][subGrupo];
        } else {
            retorno = item[campo];
        }

        return retorno;
    }

    function renderItems(dados) {
        setItems(dados);
    }

    return (
        <>
            <div className="ibox float-e-margins mb-0">
                {titulo &&
                    <div className="ibox-title">
                        <div className="h1 pull-left">{titulo}</div>
                        <div className="ibox-tools">
                            {mostrarBotaoNovo ?
                                <div className="button-group">
                                    <button
                                        className="btn btn-outline-primary"
                                        type="button"
                                        title={tituloBotao}
                                        onClick={() => handleShow({})}>
                                        {tituloBotao}
                                    </button>&nbsp;
                        </div> : null}
                        </div>
                    </div>}
                <div className="ibox-content">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper">
                            <div className="overflow-auto" style={height}>
                                <table className="table table-sm table-striped table-hover" style={maxHeight ? { maxHeight } : { maxHeight: "52vh" }}>
                                    <thead className="thead-light">
                                        <tr role="row">
                                            {children.map((child, index) => {
                                                return (<td key={index} style={{ width: child.props.tamanho + "vw" }}>{child.props.titulo}</td>)
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="overflow-auto">
                                        {items?.map((item, index) => {
                                            return (
                                                <tr role="row" key={index} className={corLinha ? corLinha(item) : null}>
                                                    {React.Children.map(children, child => {
                                                        const valor = child.props.corpo ? child.props.corpo(item) : renderValor(child.props.campo, item);

                                                        return React.cloneElement(child, {
                                                            valor,
                                                            className: child.props.className
                                                        })
                                                    })}
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>
                            <Paginacao data={data} renderItems={response => renderItems(response)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tabela;