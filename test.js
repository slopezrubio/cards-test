// Builds an HTML Element with the tag name passed as 1st argument
// var cards = document.createElement('cards');
//
// var content = document.createTextNode("Soy una carta");
// cards.appendChild(content);
//
// window.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('app').appendChild(cards);
//     console.log(cards.textContent);
// });

/* --------------------------------------------------------------------------------- */
// var content = document.createTextNode("Soy una carta");
//
// var cards = document.createElement('div');
// cards.appendChild(content);
//
// window.addEventListener('DOMContentLoaded', function() {
//     console.time('appendChild');
//     document.getElementById('app').appendChild(cards);
//     console.timeEnd('appendChild');
//     console.time('innerHTML');
//     document.getElementById('app').innerHTML = '<div>Soy una carta</div>';
//     console.timeEnd('innerHTML');
//
// });

/* --------------------------------------------------------------------------------- */

/**
 * VARIABLES
 */

// if (true) {
//     var philosopher = "Peter Sloterdijk";
// }
//
// //console.log(philosopher); // Peter Sloterdijk
//
// if (true) {
//     let philosopher = "Gilles Deleuze";
// }
//
// console.log(philosopher); // Peter Sloterdijk
//
// function shiftUp() {
//     var currentShift = 5;
//     currentShift++;
// }
// shiftUp();
//
// console.log(currentShift); // ReferenceError: currentShift is not defined

/* --------------------------------------------------------------------------------- */

/**
 * Hoisting in variables
 */

// console.log(unexistentVariable);
//
// var unexistentVariable = 4;
//
// var philosopher2 = "Jacques Derrida";
//
// (function() {
//     var philosopher2;
//     philosopher2 = "Michael Foucault";
// })();
//
// console.log(philosopher2);

// console.log(texto);
// let texto = "Fenotipo";

/* --------------------------------------------------------------------------------- */

/**
 * CONSTANTS
*/

// const philosophers = [
//     {
//         name: "Gilles Deleuze",
//         epoch: '20th Century'
//     },
//     {
//         name: "Slavok Zizek",
//         epoch: '21th Century'
//     },
//     {
//         name: "Edward Said",
//         epoch: '20th Century'
//     },
//     {
//         name: "Pierre Bourdieu",
//         epoch: '20th Century'
//     },
// ];
//
// philosophers.push({
//     name: "Judith Butler",
//     epoch: "21th Century"
// });
//
// console.log(philosophers[philosophers.length - 1]);

/* --------------------------------------------------------------------------------- */

/**
 * DATA TYPES
 */

// console.log('3396' - 345); // 3051
// console.log('3396' + 345); // 3396345
//
// console.log(3.67E+12); // 3670000000000
// console.log(2e-5); // 0.00002
// //console.log(e-98); // ReferenceError: e is not defined
//
// console.log('\251');

// let dialogue = "";
//
// if (dialogue) {
//     console.log("You are talkative");
// } else {
//     console.log("Are you saying something?");
// }
//
// let values = [];
//
// values.push(null === false);
// let condition = null === 0;
// values.push(condition);
// condition = null == false;
// values.push(condition);
// values.push(NaN !== false);
//
// console.log(values);

// let values = [];
//
// if (null) {
//     values.push(true);
// }  else {
//     values.push(false);
// }
//
// if (NaN) {
//     values.push(true);
// } else {
//     values.push(false);
// }
//
// if ("") {
//     values.push(true);
// } else {
//     values.push(false);
// }
//
// if (5) {
//     values.push(true);
// } else {
//     values.push(false);
// }
//
// if (undefined) {
//     values.push(true)
// } else {
//     values.push(false);
// }
//
// console.log(values);

/* --------------------------------------------------------------------------------- */

/*
 * ARRAYS
 */

// let arr = [];
// arr.length = 5;
// console.log(arr);

// let arr = Array(3);
// console.log(arr);

// let arr = ["Gilles Deleuze", "Michael Foucault", "Guy Debord"];
// console.log(arr['length']);
// console.log(arr['length' - 1]);

// let philosophers = ["Gilles Deleuze", "Michael Foucault", "Guy Debord"];
// philosophers.length = 4;
// console.log(philosophers);

/*
 * ARRAYS
 */

let elements = document.getElementsByClassName('row');

Array.prototype.forEach.call(elements, function(element) {
    console.log(element);
}); // Nothing will happen: var 'elements' is not array

console.log(typeof elements); // object


// document.getElementsByTagName('DIV').forEach(function(element) {
//     console.log(typeof element);
// });

/*
 * WINDOW OBJECT
 */

