# Guia de Conversions de Codificació (ES5 + Català)

Aquest document detalla les regles per mantenir la coherència en el projecte.

## Sintaxi JavaScript
- **Variables**: Utilitzar sempre `var`. Prohibit `let` i `const`.
- **Funcions**: Utilitzar `function()`. Prohibides les *arrow functions*.
- **Bucles**: Utilitzar `for` tradicional i `while`. Prohibit `.map()`, `.filter()`, `.reduce()`.
- **Operadors**: Prohibits els operadors ternaris. Utilitzar `if/else`.
- **Assignació**: Prohibida la desestructuració. Assignar manualment: `var nom = objecte.nom;`.

## Nomenclatura i Idioma
- **Idioma**: Tot el codi (variables, funcions, classes) i comentaris han d'estar en **Català**.
- **Format**: Utilitzar `camelCase` per a tots els identificadors.

## Estructura de Fitxers
Cada fitxer ha de tenir les capçaleres de blocs de comentaris per a:
1. IMPORTS
2. VARIABLES
3. FUNCIONS
4. EXPORTS

## Documentació de Funcions
Cada funció ha de tenir:
1. Descripció general en català.
2. Desglossament de la lògica pas a pas (A, B, C...).
