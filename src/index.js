const axios = require('axios');
const cheerio = require('cheerio');
const { canon, capitulos } = require('./config');

const obtenerEnlacesADetalleCapitulos = (listadoCapitulos) => {
    const selectorListado = cheerio.load(listadoCapitulos);
    const episodios = [...selectorListado('.listaEpisodios').find('li>a[href*="naruto-shippuden-"]')]
    return episodios.map(episodio => episodio.attribs.href)
}

const obtenerEnlaceADescarga = (detalleCapitulo) => {
    const selectorDetalle = cheerio.load(detalleCapitulo);
    const enlace = [...selectorDetalle('#videobox_content').find('.video_option>.btn-show[title^="Servidor:"]')]
    return enlace[0].attribs.href
}

const obtenerEnlace = (detalleCapitulo) => {
    const selectorDetalle = cheerio.load(detalleCapitulo);
    const enlace = [...selectorDetalle('#linkdescarga')]
    return enlace[0].attribs.href
}

const getListado = async () => {
    const { data: listaCapitulos } = await axios.get(capitulos.list);
    return listaCapitulos;
}

const obtenerDetalleCapitulo = async (url) => {
    const { data: detalleCapitulo } = await axios.get(url);
    return detalleCapitulo;
}

const obtenerDescargaCapitulo = async (url) => {
    const { data: descargaCapitulo } = await axios.get(url);
    return descargaCapitulo;
}

const filtrarRelleno = (enlaces) => enlaces.filter(enlace => {
    const [_, id] = enlace.match(/[a-z]+-(\d{1,3})/)
    return canon.includes(parseInt(id, 10));
})

const main = async () => {
    const listaCapitulos = await getListado();
    const enlacesADetalles = obtenerEnlacesADetalleCapitulos(listaCapitulos)
    const enlacesSinRelleno = filtrarRelleno(enlacesADetalles)
    const enlaces = []
    for await (const enlaceDetalle of enlacesSinRelleno) {
        const detalle = await obtenerDetalleCapitulo(`${capitulos.base}${enlaceDetalle}`)
        const enlaceADescarga = obtenerEnlaceADescarga(detalle);
        const paginaDescarga = await obtenerDescargaCapitulo(enlaceADescarga);
        const enlace = obtenerEnlace(paginaDescarga);
        enlaces.push(enlace);
        console.log(enlace)
    }
    return enlaces
}

main().then(console.log).catch(console.log);
