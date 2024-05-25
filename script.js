globalThis.addEventListener('load', () => {
    let pagos_pendientes = 0
    let dinero_total=0
    fetch("/base-datos/cuentas.json")
        .then(respuesta => { return respuesta.json() })
        .then(data => {
            data.forEach(cuenta => {
                dinero_total+=cuenta.dinero_total
                pagos_pendientes += cuenta.pagos_pendientes
            });
            document.querySelector('.pagos-pendientes').innerHTML=`Pagos pendientes: ${pagos_pendientes}`
            document.querySelector('#dinero-total').innerHTML=dinero_total
        })
})