const workerForm = document.querySelector(".styled-form:has(.userInputs)");
const familyIdInput = document.getElementById("family_id");
const qfInputContainer = document.getElementById("qfInput");
const residencyRow = qfInputContainer ? qfInputContainer.closest(".form-row") : null;
const qfInput = document.getElementById("quotient_familial");
const newWorkerInputs = workerForm ? workerForm.querySelectorAll(".userInputs") : [];

const associationForm = document.querySelector(".association-form");
const associationInputs = associationForm ? associationForm.querySelectorAll(".associationInput") : [];

const familyCreationForm = document.querySelector("form[action='/families/store']");
const familyCreationInputs = familyCreationForm ? familyCreationForm.querySelectorAll("input, textarea") : [];

const familyValidateRules = {
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
                if (!response.ok) {
                    return false;
                }
                const data = await response.json();
                console.log(data.exists);
                return data.exists;
            } catch (error) {
                return false;
            }
        },
        errormessage: "This Family ID does not exist in the database."
    },
    family_id: {
        asyncValidator: async (value) => {
            if (value === "") return true;
            if (!/^\d+$/.test(value)) return false;

            try {
                const response = await fetch(`/familie/${value}`);
                if (!response.ok) {
                    return false;
                }
                const data = await response.json();
                console.log(data.exists);

                if (data.exists && data.family && qfInput) {
                    qfInput.value = data.family.quotient_familial ?? "";
                    qfInput.readOnly = true;
                    if (typeof validateInput === "function") {
                        await validateInput(qfInput, familyValidateRules, qfInputContainer);
                    }
                }

                return data.exists;
            } catch (error) {
                return false;
            }
        },
        errormessage: "This Family ID does not exist in the database."
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

const associationValidateRules = {
    name: {
        regex: /^[a-zA-ZÀ-ÿ0-9\s'-]{2,}$/,
        errormessage: "Association name must contain at least 2 characters."
    },
    contact_email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errormessage: "Please enter a valid email address."
    },
    phone: {
        regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        errormessage: "Please enter a valid phone number."
    },
    siren_number: {
        regex: /^\d{14}$/,
        errormessage: "SIREN number must be exactly 14 digits."
    },
    base_price: {
        customValidator: (value) => {
            let num = parseFloat(value);
            return !isNaN(num) && num >= 0 && /^\d+(\.\d{1,2})?$/.test(value);
        },
        errormessage: "Base price must be a valid positive number."
    },
    description: {
        regex: /^.*$/,
        errormessage: ""
    }
};

const familyCreationValidateRules = {
    id: {
        asyncValidator: async (value, ruleObj) => {
            if (value === "") {
                ruleObj.errormessage = "Family ID cannot be empty.";
                return false;
            }
            if (!/^\d+$/.test(value)) {
                ruleObj.errormessage = "Family ID should be a number";
                return false;
            }
            try {
                const response = await fetch(`/familie/${value}`);
                if (!response.ok) {
                    return true;
                }

                const data = await response.json();
                if (!data.exists) {
                    return true;
                } else {
                    ruleObj.errormessage = "This Family ID already exists in the database.";
                    return false;
                }
            } catch (error) {
                return false;
            }
        },
        errormessage: "This Family ID already exists in the database."
    },
    family_name: {
        regex: /^[a-zA-ZÀ-ÿ\s'-]{7,}$/,
        errormessage: "Family name must contain at least 7 characters."
    },
    quotient_familial: {
        customValidator: (value) => {
            let num = parseFloat(value);
            return !isNaN(num) && num >= 0 && /^\d+(\.\d{1,2})?$/.test(value);
        },
        errormessage: "Quotient familial must be a valid number."
    },
    address: {
        regex: /^[\s\S]{5,}$/,
        errormessage: "Please enter a valid address."
    }
};

async function validateInput(input, ruleset, containerToCheck) {
    if (containerToCheck && input.name === "quotient_familial" && containerToCheck.classList.contains("hidden")) {
        return true;
    }
    let value = input.value.trim();
    let rule = ruleset[input.name];
    if (!rule) return true;

    let errormessage = input.nextElementSibling;
    let isValid = true;

    if (rule.asyncValidator) {
        isValid = await rule.asyncValidator(value, rule);
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
            if (!errormessage.classList.contains('help-text')) {
                errormessage.classList.add('hidden');
            }
        }
        return true;
    }
}

async function formValidator(inputs, ruleset, containerToCheck) {
    let wronginput = 0;
    for (let input of inputs) {
        if (containerToCheck && input.name === "quotient_familial" && containerToCheck.classList.contains("hidden")) {
            continue;
        }
        let isValid = await validateInput(input, ruleset, containerToCheck);
        if (!isValid) {
            wronginput++;
        }
    }
    return wronginput;
}

if (workerForm) {
    if (familyIdInput && qfInputContainer && residencyRow && qfInput) {
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
            await validateInput(familyIdInput, familyValidateRules, qfInputContainer);
            await validateInput(qfInput, familyValidateRules, qfInputContainer);
        });
    }

    newWorkerInputs.forEach(input => {
        input.addEventListener("input", async () => {
            await validateInput(input, familyValidateRules, qfInputContainer);
        });
        input.addEventListener("change", async () => {
            await validateInput(input, familyValidateRules, qfInputContainer);
        });
    });

    workerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let wronginput = await formValidator(newWorkerInputs, familyValidateRules, qfInputContainer);
        if (wronginput > 0) {
            return;
        }
        workerForm.submit();
    });
}

if (associationForm) {
    associationInputs.forEach(input => {
        input.addEventListener("input", async () => {
            await validateInput(input, associationValidateRules, null);
        });
        input.addEventListener("change", async () => {
            await validateInput(input, associationValidateRules, null);
        });
    });

    associationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let wronginput = await formValidator(associationInputs, associationValidateRules, null);
        if (wronginput > 0) {
            return;
        }
        associationForm.submit();
    });
}

if (familyCreationForm) {
    familyCreationInputs.forEach(input => {
        input.addEventListener("input", async () => {
            await validateInput(input, familyCreationValidateRules, null);
        });
        input.addEventListener("change", async () => {
            await validateInput(input, familyCreationValidateRules, null);
        });
    });

    familyCreationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let wronginput = await formValidator(familyCreationInputs, familyCreationValidateRules, null);
        if (wronginput > 0) {
            return;
        }
        // Use HTMLFormElement.prototype.submit.call to bypass event listener loops and securely submit native form
        HTMLFormElement.prototype.submit.call(familyCreationForm);
    });
}