const { writeFile } = require('fs')

cy.on('fail', (err) => {
    return false
})
cy.on('uncaught:exception', (err) => {
    console.log(err);
    return false
})

describe('Lista de capitulos', () => {
    it('Genera la lista de capitulos', () => {
        const downloadURLs = []
        cy.intercept('tracker', {})
        cy.intercept('adsco', {})
        cy.intercept('adskeeper', {})
        cy.intercept('disqus', {})
        cy.intercept('arc.io', {})
        cy.intercept('premiumvertising', {})
        cy.intercept('asacdn', {})
        cy.visit('https://www.zonarutoppuden.com/2011/04/naruto-shippuden-capitulos.html', {
            onBeforeLoad(win) {
                win.onerror = null;
                win.onclick = null;
                win.onmouseover = null;
            }
        })
        cy.url().then(url => {
            cy.fixture('ids.json').then(ids => {
                cy.get('li>a[href*="naruto-shippuden-"]').each((anchor) => {
                    const href = anchor.get(0).href
                    cy.visit(href, {
                        onBeforeLoad(win) {
                            win.onerror = null;
                        }
                    })
                    cy.get('body').find('[style*="width: 100%; height: 100%;"]').then(nastyDiv => {
                        if (nastyDiv.length > 0) {
                            cy.get('[style*="width: 100%; height: 100%;"]').invoke('remove')
                        }
                        cy.get('a[target="_blank"][rel^="nofollow"]').each(element => element.remove())
                        cy.get('.video_option>.btn-show[title^="Servidor:"]').invoke('removeAttr', 'target').click();
                        cy.get('#linkdescarga').then(link => {
                            downloadURLs.push(link.attr('href'))
                            link.attr('href', url)
                            console.log(JSON.stringify(downloadURLs))
                            cy.get('#linkdescarga').click()
                        })
                    })
                }).then(() => {
                    const listAsString = JSON.stringify(downloadURLs, null, 2)
                    writeFile('capitulos.json', listAsString, (err, data) => {
                        if (err) console.error(err);

                        console.log('¡Enhorabuena!')
                    })
                })
            })
        })
    })
})
