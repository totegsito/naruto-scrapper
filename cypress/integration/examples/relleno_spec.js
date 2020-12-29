cy.on('fail', (err) => {
    return false
})
cy.on('uncaught:exception', (err) => {
    console.log(err);
    return false
})

describe('Connectors', function () {
    it('obtiene la lista de capítulos canon', function() {
        cy.visit('https://animerelleno.com/animes/naruto-shippuden', {
            onBeforeLoad(win) {
                win.onerror = null;
            }
        })

        cy.get('tr[draggable=false][class=""]').then(function($el) {
            const elsAsHtmlElements = [...$el];
            const indexes = elsAsHtmlElements
                .filter((capitulo,index) => !capitulo.innerText.includes('RELLENO'))
                .map(el => {
                    const indexEl = el.querySelector('.has-text-centered[data-label="#"]');
                    const chapterIndexAsString = indexEl.innerText.trim().toLowerCase();
                    return parseInt(chapterIndexAsString, 10);
                })
        })
    })
})

