let url = window.location.href;
let swDirect = "/20213-PWA-GSA-U2-P2/sw.js"

if (navigator.serviceWorker) {
    console.log("Service Worker disponible")
    if (url.includes("localhost")) {
        swDirect = "/sw.js"
    }
    navigator.serviceWorker.register(swDirect)
} else {
    console.log("Service Worker NO disponible")
}

let principal = $('#principal')
let notice = $('#notice')

$('.btn-seguir').on('click', function(e) {
    e.preventDefault();
    principal.fadeOut(function(){
        notice.slideDown(1000)
    })
})

$('.btn-regresar').on('click', function(e) {
    e.preventDefault();
    notice.fadeOut(function(){
        principal.slideDown(1000)
    })
})