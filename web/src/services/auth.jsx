export const TOKEN_KEY = "@BibliotecaDD:token";

export const onSignIn = (usuario, manterLogado = false) => {
    manterLogado ?
        localStorage.setItem(TOKEN_KEY, JSON.stringify(usuario))
        :
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(usuario));
    localStorage.setItem("manterLogado", JSON.stringify(manterLogado));
}

export const onSignOut = () => {
    JSON.parse(localStorage.getItem("manterLogado")) ?
        localStorage.removeItem(TOKEN_KEY)
        :
        sessionStorage.removeItem(TOKEN_KEY);
    localStorage.setItem("manterLogado", "false");
}

export const isSignedIn = () => {
    const token = JSON.parse(localStorage.getItem("manterLogado")) ? localStorage.getItem(TOKEN_KEY) : sessionStorage.getItem(TOKEN_KEY);

    return token !== null ? true : false;
};

export const getSession = () => {
    const session = JSON.parse(localStorage.getItem("manterLogado")) ? localStorage.getItem(TOKEN_KEY) : sessionStorage.getItem(TOKEN_KEY);

    return JSON.parse(session);
}