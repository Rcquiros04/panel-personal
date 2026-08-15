/**
 * La clave de Weatherbit vive en config.js, que está en .gitignore.
 * Antes estaba escrita acá, y este archivo se sube al repositorio: una clave
 * en el código de un repo público la encuentran los rastreadores automáticos
 * en cuestión de minutos.
 *
 * Copia config.example.js a config.js y pon la tuya. Sin ella el panel sigue
 * funcionando: muestra los valores por defecto del catch de abajo.
 *
 * Ojo: en una página estática la clave siempre acaba siendo visible para quien
 * abra las herramientas del navegador. Para una clave que no se pueda exponer,
 * la llamada tiene que salir de un servidor propio que la guarde.
 */
const key_api_tiempo = window.CONFIG?.WEATHERBIT_KEY;

function getTiempo() {
    if (!key_api_tiempo) {
        console.log("Sin clave de Weatherbit: se muestran temperaturas por defecto");
        return cargarTiempoPorDefecto();
    }

    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=40.748333&lon=-73.985278&lang=es&key=${key_api_tiempo}&days=1`)
    .then(respuesta => respuesta.json())
    .then(data => cargarTiempo(data))
    .catch(error => {
        console.log("Se muestran temperaturas por defecto", error);
        cargarTiempoPorDefecto();
    });
}

function cargarTiempoPorDefecto() {
    cargarTiempo({
        city_name: "New York City",
        country_code: "US",
        data: [{ max_temp: 20, min_temp: 10, temp: 15, pop: 0, weather: { description: "Cielo despejado" } }],
    });
}

function cargarTiempo(contenido) {
    document.getElementById("tiempoMinTemp").innerHTML = `${contenido.data[0].min_temp} °C<span>Mínima</span>`;
    document.getElementById("tiempoTemp").innerHTML = `${contenido.data[0].temp} °C<span>Actual</span>`;
    document.getElementById("tiempoMaxTemp").innerHTML = `${contenido.data[0].max_temp} °C<span>Máxima</span>`;

    document.getElementById("tiempoPrec").innerHTML = `${contenido.data[0].pop} % precipitacion`;
    document.getElementById("tiempoInfo").innerHTML = contenido.data[0].weather.description;

    document.getElementById("tiempoCiudad").innerHTML = `${contenido.city_name}, ${contenido.country_code}`;
}


function getHoras() {
    const now = new Date();
    horas = [];
    
    // Ciudad de Nueva York, EE. UU.
    const newYorkTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false });
    horas.push({ city: 'New York', hour: newYorkTime.split(',')[1]});
    
    // Ciudad de Londres, Reino Unido
    const londonTime = now.toLocaleString('en-GB', { timeZone: 'Europe/London', hour12: false });
    horas.push({ city: 'Londres', hour: londonTime.split(',')[1]});
    
    // Ciudad de Sydney, Australia
    const sydneyTime = now.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour12: false });
    horas.push({ city: 'Sydney', hour: sydneyTime.split(',')[1]});
    
    // Ciudad de BsAs, Argentina
    const bsAsTime = now.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false });
    horas.push({ city: 'Buenos Aires', hour: bsAsTime.split(',')[1]});

    cargarHoras(horas);
}

function cargarHoras(horas) {
    const divHoras = document.getElementById('divHoras');

    horas.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `${item.hour}<span>${item.city}</span>`
        
        divHoras.appendChild(div);
    });
}

function getNoticia() {
    fetch('../ultima-noticia.json')
    .then(response => response.json())
    .then(data => cargarNoticia(data))
    .catch(error => console.error(error));
}

function cargarNoticia(nota) {
    const div = document.getElementById('bloqueNoticia');
    div.style.backgroundImage = `url("${nota.imagen}")`;
    div.style.backgroundSize = "cover";
    div.style.backgroundPosition = "center";

    document.getElementById('noticiaTitulo').innerHTML = nota.titulo;    
    document.getElementById('noticiaContenido').innerHTML = nota.contenido;    
    document.getElementById('noticiaAutor').innerHTML = nota.autor;
}

function cargarCancion() {
    const audio = document.getElementById('cancionDia');
    audio.src = "../assets/Moby - We Are All Made Of Stars.mp3";
}

getTiempo();
getHoras();
getNoticia();
cargarCancion();