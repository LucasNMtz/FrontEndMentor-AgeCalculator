const submitBtn = document.getElementById("submit-btn");
const main = document.querySelector("main");
let btnWidth = submitBtn.offsetWidth;
let mainWidth = main.offsetWidth;

if (window.innerWidth < 795) submitBtn.style.right = `${((mainWidth/2 - btnWidth/2)/mainWidth)*100}%`;
else submitBtn.style.right = `0`;

window.addEventListener("resize", ()=>{
    if (window.innerWidth < 795){
        console.log("Window Width < 795:", window.innerWidth);
        mainWidth = main.offsetWidth;
        submitBtn.style.right = `${((mainWidth/2 - btnWidth/2)/mainWidth)*100}%`;
    }else{
        console.log("Window Width >= 795:", window.innerWidth);
        submitBtn.style.right = `0`;
    } 
})

const form = document.getElementById("date-form");
const inputs = document.querySelectorAll(".date-input");
const labels = document.querySelectorAll(".date-label");
const errorMessages = document.querySelectorAll(".input-error-msg-span");
const ageSpans = document.querySelectorAll(".age-span");

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();

console.log("Current Year:", currentYear);
console.log("Current Month:", currentMonth);
console.log("Current Day:", currentDay);

const yearPattern = /^\d{4}$/;
const monthPattern = /^(1[0-2]|[1-9])$/;
const dayPattern = /^([1-9]|[12]\d|3[01])$/;

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    ageSpans.forEach((span)=>{
        span.classList.remove("age-span-active");
    })

    isValid(inputs[0], labels[0], errorMessages[0]);
    isValid(inputs[1], labels[1], errorMessages[1]);
    isValid(inputs[2], labels[2], errorMessages[2]);

    let year = inputs[2].value.trim();
    let month = inputs[1].value.trim();
    let day = inputs[0].value.trim();

    console.log("Year:", year);
    console.log("Month:", month);
    console.log("Day:", day);

    let emptyCounter = 0;
    let invalidCounter = 0;

    console.log("Year Validation:", yearPattern.test(year));

    inputs.forEach((input, index)=>{
        if(input.value === ""){
            isInvalid(input, labels[index], errorMessages[index], "This field is required");
            emptyCounter++;
        }else{
            isValid(input, labels[index], errorMessages[index]);
        }
    })

    if(!yearPattern.test(year)){
        isInvalid(inputs[2], labels[2], errorMessages[2], "Must be a valid year");
        invalidCounter++;
    }else if (year > currentYear){
        isInvalid(inputs[2], labels[2], errorMessages[2], "Must be in the past");
        invalidCounter++;
    }else{
        isValid(inputs[2], labels[2], errorMessages[2]);
    }

    let monthDays = 0;
    const pattern31Days = /^(1|3|5|7|8|10|12)$/;
    const pattern30Days = /^(4|6|9|11)$/;

    if(monthPattern.test(month)){
        if(year == currentYear && month > currentMonth){
            isInvalid(inputs[1], labels[1], errorMessages[1], "Must be in the past");
            invalidCounter++;
        }else{
            isValid(inputs[1], labels[1], errorMessages[1]);
        }
        // 1, 3, 5, 7, 8, 10, 12 = 31
        // 4, 6, 9, 11 = 30
        // 2 = 28 / (29 Leap Year)
        // Leap Year: (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) 
        if(pattern31Days.test(month)){
            monthDays = 31;
        }else if(pattern30Days.test(month)){
            monthDays = 30;
        }else{
            if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
                monthDays = 29;
            }else{
                monthDays = 28;
            }
        }
    }else{
        isInvalid(inputs[1], labels[1], errorMessages[1], "Must be a valid month");
        invalidCounter++;
    }

    console.log("Month Days:", monthDays);

    if(monthDays != 0){
        if (dayPattern.test(day)){
            if(year == currentYear && month == currentMonth && day > currentDay){
                isInvalid(inputs[0], labels[0], errorMessages[0], "Must be in the past");
                invalidCounter++;
            }else if(day > monthDays){
                isInvalid(inputs[0], labels[0], errorMessages[0], "Must be a valid day");
                invalidCounter++;
            }else{
                isValid(inputs[0], labels[0], errorMessages[0]);
            }
        }else{
            isInvalid(inputs[0], labels[0], errorMessages[0], "Must be a valid day");
            invalidCounter++;
        }
    }else{
        invalidCounter = 3;
    }

    console.log("Invalid Counter:", invalidCounter);

    if(invalidCounter === 3 && emptyCounter === 0){
        inputs.forEach((input, index)=>{
            isInvalid(input, labels[index], errorMessages[index], "");
            errorMessages[index].classList.remove("input-error-msg-active");
        })
        errorMessages[0].classList.add("input-error-msg-active");
        errorMessages[0].textContent = "Must be a valid date";
    }

    if(invalidCounter === 0 && emptyCounter === 0){
        const age = {};
    
        let yearDiff = currentYear - year;

        let monthDiff = currentMonth - month;
        if (monthDiff < 0 || (monthDiff === 0 && currentDay < day)) {
            yearDiff--;
            monthDiff += 12;
        }
        
        let dayDiff = currentDay - day;
        if (dayDiff < 0) {
            monthDiff--;
            dayDiff += monthDays;
        }

        age.years = yearDiff;
        age.months = monthDiff;
        age.days = dayDiff;

        console.log("Age Array:", age);

        ageSpans.forEach((span)=>{
            span.classList.add("age-span-active-letter-spacing");
            span.classList.add("age-span-active");
        })

        ageSpans[0].textContent = `${age.years}`;
        ageSpans[1].textContent = `${age.months}`;
        ageSpans[2].textContent = `${age.days}`;
    }

    console.log("");
})

function isInvalid(input, label, errorMsg, msg){
    if (!input.classList.contains("invalid-input")){
        input.classList.add("invalid-input");
        label.classList.add("invalid-input-date-label");
        errorMsg.classList.add("input-error-msg-active");
        errorMsg.textContent = msg;
    }
}

function isValid(input, label, errorMsg){
    input.classList.remove("invalid-input");
    label.classList.remove("invalid-input-date-label");
    errorMsg.classList.remove("input-error-msg-active");
}

submitBtn.addEventListener("click", ()=>{
    ageSpans.forEach((span)=>{
        span.classList.remove("age-span-active");
    })
})
