var change= .75;

var quarter=.25;
var dime=.10;
var nickle=.05;
var penny =.01;

// step one divide change by quarter with % so nothing remains



    Quarter_Return=change%quarter;
    Change=change-(Quarter_Return*quarter);





Change=change-(Quarter_Return*quarter);

dime_return=change%dime;

change=change-(dime_return*dime);

nickle_return=change%nickle;

change=change-(nickle_return*nickle);

penny_return=change;

console.log("number of quarters"+" "+Quarter_Return+ "number of dimes"+ " "+dime_return+"number of nickles"+ " "+ nickle_return+ "number of pennies"+" "+penny_return );

