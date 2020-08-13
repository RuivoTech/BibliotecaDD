import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";

import Logo from "../../assets/Logo.png";
import { AuthContext } from "../../context";
import { getSession } from "../../services/auth";
import { rotas } from "../../services/rotas";


const Menu = () => {
    const { signOut } = useContext(AuthContext);
    const history = useHistory();
    const [usuario, setUsuario] = useState({});
    const { isAdmin } = useContext(AuthContext);

    const sair = () => {
        signOut();

        history.push("/");
    }

    useEffect(() => {
        const response = getSession();

        const token = jwt.decode(response.token);

        setUsuario(token);
    }, []);

    return (
        <>
            <nav className="navbar navbar-light bg-light navbar-expand-sm">
                <Link className="navbar-brand" to="/dashboard">
                    <img src={Logo} alt="Biblioteca DD" height="45" width="90" />
                </Link>
                <ul className="navbar-nav mr-auto">
                    {rotas[isAdmin() ? "admin" : "normal"].includes("/livros") &&
                        <li className="nav-item dropdown">
                            <Link className="dropdown-item" to="/livros">Livros</Link>
                        </li>}
                    {rotas[isAdmin() ? "admin" : "normal"].includes("/retiradas") &&
                        <>
                            <li className="nav-item">
                                <Link className="dropdown-item" to="/retiradas">Retiradas</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="dropdown-item" to="/importacoes">Importações</Link>
                            </li>
                        </>
                    }
                    {rotas[isAdmin() ? "admin" : "normal"].includes("/usuarios") &&
                        <li className="nav-item">
                            <Link className="dropdown-item" to="/usuarios">Usuários</Link>
                        </li>}
                    <li className="nav-item">
                        <Link className="dropdown-item" to="/perfil">Perfil</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto nav-flex-icons">
                    <li className="nav-item avatar">
                        <span>{usuario.nome}</span>
                        <button className="btn btn-danger ml-2 px-3" onClick={sair}>
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Menu;