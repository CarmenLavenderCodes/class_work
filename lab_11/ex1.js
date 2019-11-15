/*Math.round
ƒ round() {  }
a=Math.round
ƒ round() { [] }
a(22.54)
23
parseInt
ƒ parseInt() { [] }
parseInt(22.3)
22
"abcd".substring(2,3)
"c"
"abcd".substring(2,3);
"c"
"a;b;c;d".split()
["a;b;c;d"]
"a;b;c;d".split(';')
(4) ["a", "b", "c", "d"]
"a;b;c;d".split(';',2)
(2) ["a", "b"]
*/

//attributes  =  "Carmen;32;32.5;31.5";
theSeperator = ';';
parts = ["Carmen", 32, 32.5, -31.5];
//parts = attributes.split(theSeperator);
//for (i = 0; i < parts.length; i++)
 
    parts.forEach(printIt);

function printIt(item,index){
    console.log(typeof item == 'string' && item.length>0?true:false);

console.log(parts.join(theSeperator));


function isNonNegInt(q) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return (errors.length==0);// this function should only return if their are no errors in the array
}}