import React, { useState, useEffect, useContext } from "react";
import { Route, useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";

import Menu from "./components/Menu";
import { isSignedIn, getSession } from "./services/auth";
import { AuthContext } from "./context";
import { rotas } from "./services/rotas";

const PrivateRoute = ({ component: Component, path, location, ...resto }) => {
    const { signOut } = useContext(AuthContext);
    const history = useHistory();
    const [estaLogado, setEstaLogado] = useState(false);

    useEffect(() => {
        if (isSignedIn()) {
            setEstaLogado(!estaLogado);
        } else {
            signOut();
            history.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const session = getSession();
        const token = jwt.decode(session.token);
        const nivel = token.nivel === 2 ? "admin" : "normal";
        if (!rotas[nivel].includes(location.pathname)) {
            history.push("/dashboard");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    return (
        estaLogado &&
        <>
            <Menu />
            <Route path={path}
                render={(props) => <Component {...props} {...resto} />}
            />
        </>
    )
}

export default PrivateRoute;