import React, { useMemo } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import packageJSON from "../package.json";
import jwt from "jsonwebtoken";

import Manutencao from "./pages/Manutencao";
import "./App.css";
import { AuthContext } from "./context";
import { onSignIn, onSignOut, getSession } from "./services/auth";
import PrivateRoute from './PrivateRoute';

import Footer from "./components/Footer";
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Livros from './pages/Livros';
import Perfil from "./pages/Perfil";
import Retiradas from './pages/Retiradas';
import Importacoes from './pages/Importacoes';
import Usuarios from "./pages/Usuarios";
import RelatorioLivros from "./pages/Livros/Relatorio";
import RelatorioDashboard from "./pages/Dashboard/Relatorio";
import RelatorioRetiradas from "./pages/Retiradas/Relatorio";

const App = () => {
    const authContext = useMemo(() => {
        return {
            signIn: (login, manterLogado) => {
                onSignIn(login, manterLogado);
            },
            signOut: () => {
                onSignOut();
            },
            isAdmin: () => {
                const session = getSession();
                const user = jwt.decode(session.token);
                return user.nivel === 2;
            }
        }
    }, [])

    return (
        <>
            {packageJSON.manutencao ?
                <Manutencao />
                :
                <AuthContext.Provider value={authContext}>
                    <HashRouter>
                        <Switch>
                            <PrivateRoute path="/dashboard" component={Dashboard} />
                            <PrivateRoute path="/livros" component={Livros} />
                            <PrivateRoute path="/retiradas" component={Retiradas} />
                            <PrivateRoute path="/importacoes" component={Importacoes} />
                            <PrivateRoute path="/usuarios" component={Usuarios} />
                            <PrivateRoute path="/perfil" component={Perfil} />
                            <Route path="/relatorio/livros/:param" component={RelatorioLivros} />
                            <Route path="/relatorio/emBaixa" component={RelatorioDashboard} />
                            <Route path="/relatorio/retiradas/:dataInicio/:dataFim" component={RelatorioRetiradas} />
                            <Route exact path="/" component={Login} />
                        </Switch>
                    </HashRouter>
                </AuthContext.Provider>
            }
            {window.location.hash.split("/")[1] !== "relatorio" &&
                <Footer />}
        </>
    );
}

export default App;
