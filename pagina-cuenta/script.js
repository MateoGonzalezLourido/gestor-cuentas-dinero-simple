globalThis.addEventListener('load', () => {
    document.querySelector('nav').style.display = "none"
    fetch("/base-datos/cuentas.json")
        .then(respuesta => { return respuesta.json() })
        .then(data => {
            data.forEach(cuenta => {
                mostrar_administrador_cuenta(cuenta)
            });
        })
})
document.querySelector('#bt-menu-desplegable').addEventListener('click', () => {
    console.log(document.querySelector('nav').style.display)
    if (document.querySelector('nav').style.display != 'none') {
        document.querySelector('nav').style.display = "none"
    }
    else {
        document.querySelector('nav').style.display = "grid"
    }
})

function mostrar_administrador_cuenta(datos_cuenta) {
    document.querySelector('main').innerHTML += `
    <section class="administrar-cuenta">
    <div class="cabeza">
        <span class="nombre-cuenta">${datos_cuenta.nombre}</span>
        <span class="dinero-cuenta">Dinero: ${datos_cuenta.dinero_total}€</span>
        <span class="pagos-prendientes-cuenta">Pagos pendientes: ${datos_cuenta.pagos_pendientes}</span>
    </div>
    <div class="cuerpo">
        <div class="esta-semana">
            <div style="border-bottom: 1px solid #000;text-wrap: nowrap;margin-bottom: 3px">Esta semana</div>
            <span class="ganado-semana">Ganado:${datos_cuenta.datos_esta_semana.dinero_ingresado}€</span>
            <span class="gastado-semana">Gastado:${datos_cuenta.datos_esta_semana.dinero_sacado}€</span>
        </div>
        <div style="width: 100%;display: flex;align-items: end;flex-direction: column;">
            <div>
                <div class="ingresar-dinero">
                    <input id="ingresar-dinero-${datos_cuenta.id}"class="ingresar-dinero-cuenta" type="number" value="0"><button onclick="ingresar_dinero_cuenta(${datos_cuenta.id})">Ingresar</button>
                </div>
                <div class="sacar-dinero">
                    <input id="sacar-dinero-${datos_cuenta.id}"class="sacar-dinero-cuenta" type="number" value="0"><button onclick="sacar_dinero_cuenta(${datos_cuenta.id})">Sacar</button>
                </div>
            </div>
        </div>
</section>
    `
}
function ingresar_dinero_cuenta(id_cuenta) {
    fetch("/base-datos/cuentas.json")
        .then(respuesta => { return respuesta.json() })
        .then(data => {
            //cambiar datos de la cuenta
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id_cuenta) {
                    const dinero = document.querySelector(`#ingresar-dinero-${id_cuenta}`).value;
                    if (validar_dinero_operar(dinero) === dinero) {
                        const tiempoTranscurrido = Date.now();
                        data[i].dinero_total += dinero
                        data[i].dinero_ingresado_total += dinero
                        data[i].datos_esta_semana.dinero_ingresado += dinero
                        data[i].registro_actividad.unshift(`Ingreso ( ${(new Date(tiempoTranscurrido)).toLocaleDateString()} ): ${dinero}€`)
                    }
                    break
                }
            }
            //actualizar base de datos
            console.log(data)
        })
}
function sacar_dinero_cuenta(id_cuenta) {
    fetch("/base-datos/cuentas.json")
        .then(respuesta => { return respuesta.json() })
        .then(data => {
            //cambiar datos de la cuenta
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id_cuenta) {
                    const dinero = document.querySelector(`#sacar-dinero-${id_cuenta}`).value;
                    if (validar_dinero_operar(dinero) === dinero) {
                        if (dinero <= data[i].dinero_total) {
                            const tiempoTranscurrido = Date.now();
                            data[i].dinero_total -= dinero
                            data[i].dinero_gastado_total += dinero
                            data[i].datos_esta_semana.dinero_sacado += dinero
                            data[i].registro_actividad.unshift(`Sacado( ${(new Date(tiempoTranscurrido)).toLocaleDateString()} ): ${dinero}€`)
                        }
                        else {//mandar mensaje de transacción cancelada
                            alert(`Transacción cancelada (cuenta: ${data[i].nombre})\nDinero a sacar: ${dinero}€\nDinero en la cuenta ${data[i].dinero_total}€`)
                        }
                    }
                    else {
                        alert(`Transacción cancelada (cuenta: ${data[i].nombre}).\n Dinero a sacar: ${dinero}€\nIntroduzca una cantidad de dinero mayor a 0€ para operar`)
                    }
                    break
                }
            }
            //actualizar base de datos
            console.log(data)
        })
}

function validar_dinero_operar(dinero) {
    if (!isNaN(Number(dinero))) {
        if (dinero <= 0) {
            alert(`Transacción cancelada (cuenta: ${data[i].nombre}).\n Dinero a sacar: ${dinero}€\nNo se puede operar con cantidades iguales o inferiores a 0€`)
            return false
        }
        else {
            return dinero
        }
    }
    else {
        alert(`Transacción cancelada (cuenta: ${data[i].nombre}).\n Dinero a sacar: ${dinero}€\nIntroduzca una cantidad de dinero mayor a 0€ para operar`)
        return false
    }
}