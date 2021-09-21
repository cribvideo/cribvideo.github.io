let urlParam = new URL(window.location).searchParams.get("yes");

if (urlParam == "yes") {
    navigator.serviceWorker.getRegistrations().then((regi) => {
        for (let reg of regi) {
            reg.unregister();
        }
    })
}