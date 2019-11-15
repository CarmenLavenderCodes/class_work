Day = 14;
Month = "oct";
Year = 19;

step1 = year % 100;
step2 = parseInt(step1 / 4);
step3 = step2 + step1;
if (month == "jan") {
    step5 = day + step3;
}
else step4 =switch(month) {
    case "feb":
        step4 = 3; break;
    case "march":
        step4 = 6; break;
    case "apr":
        step4 = 1; break;
    case "may":
        step4 = 4; break;
    case "jun":
        step4 = 6; break;
    case "jul":
        step4 = 2; break;
    case "aug":
        step4 = 5; break;
    case "sep":
        step4 = 0; break;
    case "oct":
        step4 = 3; break;
    case "nov":
        step4 = 5; break;
    case "dec":
        step4 = 1; break;

}
step6 = step4 + step3;
step7 = day + step6;


step8 = (typeof step5 != "undefined") ? step5 : step7;
//check if leap year
isLeapYear = ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0));

if (parseInt(year / 100) == 19) {
    //1900s path
    if (isLeapYear) {
        if ((month == "jan") || (month == "feb")) {
            step9 = step8 - 1;

        } else {
            if (isLeapYear) {

            }
            else {
                if ((month == "jan") || (month == "feb")) {
                    step9 = step8 - 2;

                } else {
                    step9 = step8 - 1;
                }

            }
        }
    }


        //2000s path}