import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../../context";
import api from "../../services/api";
import { isSignedIn, onSignIn } from "../../services/auth";

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const [carregango, setCarregando] = useState(false);
    const history = useHistory();
    const [error, setError] = useState("");
    const [usuario, setUsuario] = useState({
        email: "",
        senha: "",
        manterLogado: false
    });

    useEffect(() => {
        const estaLogado = () => {
            const usuario = isSignedIn();

            if (usuario) {
                onSignIn(usuario, localStorage.getItem("manterLogado")).then(() => {
                    history.push("/dashboard");
                });
            }
        }

        estaLogado();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = event => {
        setUsuario({
            ...usuario,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeLogado = () => {
        setUsuario({
            ...usuario,
            manterLogado: !usuario.manterLogado
        });
    }

    const handleLogin = async event => {
        event.preventDefault();
        setCarregando(true);
        try {
            const retorno = await api.post("/login", { email: usuario.email, senha: usuario.senha });

            if (retorno.data.error) {
                setError(retorno.data.error);
                setCarregando(false);
                return;
            }
            signIn(retorno.data, usuario.manterLogado);
            setTimeout(() => {
                setCarregando(false);
                history.push("/dashboard");
            }, 1000);
        } catch (error) {
            setCarregando(false);
            console.log(error);
        }

    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={handleLogin}>
                        <h3>Sign In</h3>

                        <div className="form-group">
                            <label>Usuário</label>
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                placeholder="E-mail ou nome de usuário..."
                                value={usuario.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="senha"
                                className="form-control"
                                placeholder="Senha..."
                                value={usuario.senha}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck1"
                                    checked={usuario.manterLogado}
                                    value={usuario.manterLogado}
                                    onChange={handleChangeLogado} />
                                <label className="custom-control-label" htmlFor="customCheck1">Manter-me logado</label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={carregango}>
                            {carregango ?
                                "Aguarde..." :
                                "Entrar"}
                        </button>
                        <p className="forgot-password text-right">
                            <Link to="/">Esqueceu a senha?</Link>
                        </p>
                    </form>
                    {error &&
                        <p className="h6 text-center text-danger">{error}</p>
                    }
                </div>
            </div>
        </>
    )
}

export default Login;