let apiKey = '';
// Elementos HTML para interactuar
const buscar = document.getElementById('buscar');
const btnBuscar = document.getElementById('btn_buscar');
const animacionCarga = document.querySelector('.loader');
const btnCerrarAviso = document.getElementById('btn_cerrar_aviso');
const aviso = document.querySelector('.aviso');
const msjAviso = document.getElementById('msj_aviso');
// Elementos HTML a cargar datos del clima (DIARIO)
const ubicacion = document.getElementById('ubicacion');
const fechaUbi = document.getElementById('fecha');
const tempActual = document.getElementById('temp');
const imgClima = document.getElementById('img_clima');
const estadoDia = document.getElementById('estado');
const sensTermica = document.getElementById('st');
const humedad = document.getElementById('humedad');
const viento = document.getElementById('viento');
const bgClima = document.querySelector('.bg_clima');
// Elementos HTML a cargar datos del clima (SEMANAL)
const diaUno = document.getElementById('dia_1');
const imgDiaUno = document.getElementById('img_dia_1');
const tempDiaUno = document.getElementById('temp_dia_1');
const diaDos = document.getElementById('dia_2');
const tempDiaDos = document.getElementById('temp_dia_2');
const imgDiaDos = document.getElementById('img_dia_2');
const diaTres = document.getElementById('dia_3');
const imgDiaTres = document.getElementById('img_dia_3');
const tempDiaTres = document.getElementById('temp_dia_3');

let ciudad = 'buenos aires';
const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Codigos condiciones clima a optimizar -> (podria ser un objeto que cada categoria tenga su array).
const listLluvias = [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276, 1237, 1264];
const listNublado = [1003, 1006, 1009, 1030, 1135, 1147];
const listSoleado = [1000];
const listNieve = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282, 1069, 1204, 1207, 1249, 1252]
const listTormenta = [1087, 1273, 1276, 1279, 1282];

// Información que se mostrara predeterminada al abrir la página.
const clima = async (city) => {
    try {
        const datosPredeterminados = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=es&days=3`)
        const datos = await datosPredeterminados.json();
        // console.log(datos);
        let codigo = datos.current.condition.code;
        let esDia = datos.current.is_day;
        console.log(datos)

        // Carga el nombre de la ubicación
        if (datos.location.name === datos.location.region) {
            ubicacion.innerHTML = `${datos.location.name}, ${datos.location.country}`;
        } else {
            ubicacion.innerHTML = `${datos.location.name}, ${datos.location.region}, ${datos.location.country}`;
        }        

        cargarClima(datos, fechaUbi, estadoDia, tempActual, sensTermica, humedad, viento);
        condicionClima(codigo, listLluvias, listNublado, listSoleado, listTormenta, listNieve, esDia, imgClima);

    } catch (error) {
        console.error('Error en la solicitud.', error);
        msjAviso.textContent = 'La ciudad ingresada no es válida. Por favor, intente nuevamente.'
        aviso.style.left = '0';
    }
}

const cargarClima = (datosCLima, fecha, condicionDia, temp, st, hum, vie) => {
    let climaSemana = datosCLima.forecast.forecastday;
    let climaDiario = datosCLima.current;

    // Obtener y cargar fecha de la ubicación actual.
    let fechaCompleta = datosCLima.location.localtime.split(' ');
    // console.log(fechaCompleta)
    let fechaLocal = fechaCompleta[0].split('-');

    // Clima diario
    fecha.innerHTML = `${fechaLocal[2]}/${fechaLocal[1]}/${fechaLocal[0]} - ${fechaCompleta[1]}hs`;
    condicionDia.innerHTML = `${climaDiario.condition.text}.`;
    temp.innerHTML = Math.round(climaDiario.temp_c);
    st.innerHTML = `St: ${Math.round(climaDiario.feelslike_c)}°c`;
    hum.innerHTML = `Humedad: ${climaDiario.humidity}%`;
    vie.innerHTML = `Viento: ${Math.round(climaDiario.wind_kph)} km/h`
 
    // Clima semanal
    let listDias = [];
    // for (let i = 1; i < climaSemana.length; i++) {
    //     listDias.push(climaSemana[i].date);
    // }
    climaSemana.forEach(element => {
        listDias.push(element.date);
    });
    console.log('Lista dias')
    console.log(listDias)
    let indiceDiaUno = new Date(listDias[0]).getDay();
    let indiceDiaDos = new Date(listDias[1]).getDay();
    let indiceDiaTres = new Date(listDias[2]).getDay();
    console.log('Dia: ' + indiceDiaDos)
    diaUno.innerHTML = 'Hoy';
    imgDiaUno.src = climaSemana[0].day.condition.icon;
    tempDiaUno.innerHTML = `${Math.round(climaSemana[0].day.maxtemp_c)}°c , ${Math.round(climaSemana[0].day.mintemp_c)}°c`;

    diaDos.innerHTML = diasSemana[indiceDiaDos];
    imgDiaDos.src = climaSemana[1].day.condition.icon;
    tempDiaDos.innerHTML = `${Math.round(climaSemana[1].day.maxtemp_c)}°c , ${Math.round(climaSemana[1].day.mintemp_c)}°c`;

    diaTres.innerHTML = diasSemana[indiceDiaTres];
    imgDiaTres.src = climaSemana[2].day.condition.icon;
    tempDiaTres.innerHTML = `${Math.round(climaSemana[2].day.maxtemp_c)}°c , ${Math.round(climaSemana[2].day.mintemp_c)}°c`;

}

// Muestra la imagen de la condicion climática
const condicionClima = (codigoClima, lluvia, nublado, soleado, tormenta, nieve, esDeDia, imgCondicionClima) => {
    switch (true) {
        case soleado.includes(codigoClima):
            if (esDeDia == 1) {
                imgCondicionClima.src = '/assets/img_clima/clima/day.svg';
                bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/despejado.jpg")'
            } else {
                imgCondicionClima.src = '/assets/img_clima/clima/night.svg';
                bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/noche.jpg")'
            }
            break;
        case nublado.includes(codigoClima):
            imgCondicionClima.src = '/assets/img_clima/clima/cloudy.svg';
            bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/nublado.jpg")'
            break;
        case lluvia.includes(codigoClima):
            imgCondicionClima.src = '/assets/img_clima/clima/rainy-4.svg';
            bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/lluvia.jpg")'
            break;
        case tormenta.includes(codigoClima):
            imgCondicionClima.src = '/assets/img_clima/clima/thunder.svg';
            bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/tormenta.jpg")'
            break;
        case nieve.includes(codigoClima):
            imgCondicionClima.src = '/assets/img_clima/clima/snowy-5.svg';
            bgClima.style.backgroundImage = 'url("/assets/img_clima/clima/bg/nieve.jpg")'
            break;
        default:
            console.log('Error en obtener la imagen de la condicion del clima.');
            break;
    }
}
const valorInput = () => {
    ciudad = buscar.value.toLowerCase();
    if (buscar.value == '') {
        // console.log('Input vacio, ingresa un valor.')
        msjAviso.textContent = 'Parece que olvidaste ingresar una ciudad. Por favor, inténtalo de nuevo';
        aviso.style.left = '0';
    } else {
        clima(ciudad);
    }
    buscar.value = '';
}

window.addEventListener('load', async () => { 
    try {
        const response = await fetch('/.netlify/functions/env');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        apiKey = await response.text();
      } catch (error) {
        console.error('Error en solicitud de la api.', error);
      }
    // Llama a la función clima después de obtener la API Key  
    if (apiKey) {
        clima(ciudad);
        setTimeout(() => {
            animacionCarga.style.display = 'none';
            document.querySelector('.titulo_app').style.opacity = '100%';
            document.querySelector('.cont_clima').style.opacity = '100%';
        }, 3000);
    }
})

btnBuscar.addEventListener('click', () => {
    ciudad = buscar.value.toLowerCase();
    valorInput();
})

buscar.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        valorInput();
    }
})
btnCerrarAviso.addEventListener('click', () => {
    aviso.style.left = '-100%';
    console.log('click')
})
