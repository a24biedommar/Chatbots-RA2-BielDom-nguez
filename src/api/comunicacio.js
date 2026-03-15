//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Obté les dades d'un usuari des d'un servei extern de manera asíncrona.
 * 
 * Lògica:
 * A. Defineix l'URL de l'API utilitzant el paràmetre idUsuari.
 * B. Realitza la petició HTTP mitjançant la funció asíncrona fetch.
 * C. Espera que la resposta es converteixi a format JSON.
 * D. Retorna les dades obtingudes.
 */
async function obtenirDadesUsuari(idUsuari) {
    var url = 'https://jsonplaceholder.typicode.com/users/' + idUsuari;
    var resposta = await fetch(url);
    var dades = await resposta.json();
    
    return dades;
}

/**
 * Envia dades a l'API per crear un nou recurs.
 * 
 * Lògica:
 * A. Defineix la configuració de la petició (mètode, capçaleres, cos).
 * B. Realitza la crida asíncrona amb el mètode fetch.
 * C. Converteix la resposta a format JSON.
 * D. Retorna el resultat de l'operació.
 */
async function enviarDades(dadesPerEnviar) {
    var url = 'https://jsonplaceholder.typicode.com/posts';
    var configuracio = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadesPerEnviar)
    };
    var resposta = await fetch(url, configuracio);
    var resultat = await resposta.json();
    
    return resultat;
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================
