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
 * Valida si un objecte dades té tots els camps requerits.
 * 
 * Lògica:
 * A. Defineix una llista de camps obligatoris.
 * B. Recorre la llista de camps obligatoris amb un bucle tradicional.
 * C. Per a cada camp, comprova si existeix a l'objecte de dades.
 * D. Si falta algun camp, retorna fals immediatament.
 * E. Si tots els camps existeixen, retorna cert.
 */
function validarDadesUsuari(dades) {
    var campsObligatoris = ['nom', 'correu', 'edat'];
    var i;
    var camp;
    var valor;

    for (i = 0; i < campsObligatoris.length; i = i + 1) {
        camp = campsObligatoris[i];
        valor = dades[camp];
        
        if (valor === undefined || valor === null) {
            return false;
        }
    }
    
    return true;
}

/**
 * Comprova si una adreça de correu és vàlida.
 * 
 * Lògica:
 * A. Defineix una expressió regular bàsica per al correu.
 * B. Utilitza el mètode test per validar el format.
 * C. Retorna el resultat de la validació.
 */
function esCorreuValid(correu) {
    var expressioRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var resultat = expressioRegular.test(correu);
    
    return resultat;
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================
