function appLoad() {
    initialiseHome();
}

function initialiseHome() {
    const homeElem = document.getElementsByClassName("home")[0];
    const midElem = document.getElementsByClassName("home-mid")[0];

    homeElem.scrollTo(0, 100);
}

setInterval(() => {
    document.getElementById("root-style").innerHTML = `
        :root {
            --v-height: ${window.innerHeight}px
        }
    `;
}, 10);