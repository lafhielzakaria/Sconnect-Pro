const Validate_Rules = {
    first_name: {
        regex: /^[a-zA-ZÀ-ÿ\s'-]{2,}$/,
        errormessage: "First name must contain at least 2 letters."
    },
    last_name: {
        regex: /^[a-zA-ZÀ-ÿ\s'-]{2,}$/,
        errormessage: "Last name must contain at least 2 letters."
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errormessage: "Please enter a valid email address."
    },
    phone: {
        regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        errormessage: "Please enter a valid phone number."
    },
    date_of_birth: {
        regex: /^\d{4}-\d{2}-\d{2}$/,
        errormessage: "Please select a valid date of birth."
    },
    family_id: {
        asyncValidator: async (value) => {
            if (value === "") return true; 
            if (!/^\d+$/.test(value)) return false;

            try {
                const response = await fetch(`/familie/${value}`);
                console.log(response);
                if(!response){
               return false;
                }
                return true;
            } catch (error) {
                return false;
            }
        },
        errormessage: "This Family ID does not exist in the database."
    },
    quotient_familial: {
        customValidator: (value) => {
            if (familyIdInput.value.trim() !== "") {
                let num = parseFloat(value);
                return !isNaN(num) && num > 0 && /^\d+(\.\d{1,2})?$/.test(value);
            }
            return true;
        },
        errormessage: "Quotient familial must be a valid number greater than 0."
    },
    medical_certificate_date: {
        regex: /^\d{4}-\d{2}-\d{2}$/,
        errormessage: "Please select a valid medical certificate date."
    },
    pass_sport_code: {
        regex: /^.*$/,
        errormessage: "Invalid format."
    },
    is_resident: {
        regex: /^.*$/,
        errormessage: ""
    }
};

const workerForm = document.querySelector(".styled-form");
const familyIdInput = document.getElementById("family_id");
const qfInputContainer = document.getElementById("qfInput");
const residencyRow = qfInputContainer.closest(".form-row");
const qfInput = document.getElementById("quotient_familial");

familyIdInput.addEventListener("input", async (e) => {
    if (e.target.value.trim() !== "") {
        qfInputContainer.style.display = "block";
        qfInputContainer.classList.remove("hidden");
        residencyRow.classList.add("grid-2");
        residencyRow.classList.remove("single-column");
    } else {
        qfInputContainer.style.display = "none";
        qfInputContainer.classList.add("hidden");
        qfInput.value = "";
        residencyRow.classList.remove("grid-2");
        residencyRow.classList.add("single-column");
        
        qfInput.style.border = "";
        let errormessage = qfInput.nextElementSibling;
        if (errormessage) {
            errormessage.textContent = "";
            errormessage.classList.add('hidden');
        }
    }
    await validateInput(qfInput);
});

async function validateInput(input) {
    if (input.name === "quotient_familial" && qfInputContainer.classList.contains("hidden")) {
        return true;
    }
    let value = input.value.trim();
    let rule = Validate_Rules[input.name];
    if (!rule) return true;
    
    let errormessage = input.nextElementSibling;
    let isValid = true;

    if (rule.asyncValidator) {
        isValid = await rule.asyncValidator(value);
    } else if (rule.customValidator) {
        isValid = rule.customValidator(value);
    } else if (rule.regex) {
        isValid = value.match(rule.regex);
    }
    
    if (!isValid) {
        if (errormessage) {
            errormessage.textContent = rule.errormessage;
            errormessage.classList.remove('hidden');
        }
        input.style.border = "3px solid red";
        return false;
    } else {
        input.style.border = "3px solid green";
        if (errormessage) {
            errormessage.textContent = "";
            errormessage.classList.add('hidden');
        }
        return true;
    }
}

let new_worker_inputs = workerForm.querySelectorAll(".userInputs");

new_worker_inputs.forEach(input => {
    input.addEventListener("input", async () => {
        await validateInput(input);
    });
    input.addEventListener("change", async () => {
        await validateInput(input);
    });
});

async function Form_validator() {
    let wronginput = 0;
    for (let input of new_worker_inputs) {
        if (input.name === "quotient_familial" && qfInputContainer.classList.contains("hidden")) {
            continue;
        }
        let isValid = await validateInput(input);
        if (!isValid) {
            wronginput++;
        }
    }
    return wronginput;
}

workerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let wronginput = await Form_validator();
    if (wronginput > 0) {
        return;
    }
    workerForm.submit();
});