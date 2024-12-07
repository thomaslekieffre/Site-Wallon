document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);

    const params = new URLSearchParams(url.search);
    const value = params.get('registered');

    console.log(value)

    if (value) {
        document.querySelector(".login-success").hidden = false;
        // Remplace the params
        const urlWithoutParams = window.location.origin + window.location.pathname;
        history.replaceState(null, '', urlWithoutParams);
    }
})