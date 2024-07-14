class YummyApp {
    constructor() {
        this.rowData = document.getElementById("rowData");
        this.searchContainer = document.getElementById("searchContainer");
        this.submitBtn = null;

        this.nameInputTouched = false;
        this.emailInputTouched = false;
        this.phoneInputTouched = false;
        this.ageInputTouched = false;
        this.passwordInputTouched = false;
        this.repasswordInputTouched = false;

        this.init();
    }

    async init() {
        $(document).ready(() => {
            this.searchByName("").then(() => {
                $(".loading-screen").fadeOut(500);
                $("body").css("overflow", "visible");
            });

            this.bindEvents();
            this.closeSideNav(); 
        });
    }

    bindEvents() {
        $(".side-nav-menu i.open-close-icon").click(() => this.toggleSideNav());
        $(".links li").click((e) => this.handleNavClick(e));
    }

    async handleNavClick(e) {
        const action = e.target.getAttribute('data-action');
        this.closeSideNav();

        switch(action) {
            case 'search':
                this.showSearchInputs();
                break;
            case 'categories':
                await this.getCategories();
                break;
            case 'area':
                await this.getArea();
                break;
            case 'ingredients':
                await this.getIngredients();
                break;
            case 'contact':
                this.showContacts();
                break;
        }
    }

    openSideNav() {
        $(".side-nav-menu").animate({ left: 0 }, 500);
        $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
        $(".links li").css({ top: 0 }); 
    }

    closeSideNav() {
        let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
        $(".side-nav-menu").animate({ left: -boxWidth }, 500);
        $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
        $(".links li").css({ top: 300 }); 
    }

    toggleSideNav() {
        if ($(".side-nav-menu").css("left") === "0px") {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }

    displayMeals(arr) {
        let cartoona = "";
        for (let i = 0; i < arr.length; i++) {
            cartoona += `
                <div class="col-md-3">
                    <div onclick="app.getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
        }
        this.rowData.innerHTML = cartoona;
    }

    async fetchAndDisplay(endpoint, displayFunction) {
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(endpoint);
        let data = await response.json();
        displayFunction.call(this, data);
        $(".inner-loading-screen").fadeOut(300);
    }

    async getCategories() {
        await this.fetchAndDisplay('https://www.themealdb.com/api/json/v1/1/categories.php', function(data) {
            this.displayCategories(data.categories);
        });
    }

    displayCategories(arr) {
        let cartoona = "";
        for (let i = 0; i < arr.length; i++) {
            cartoona += `
                <div class="col-md-3">
                    <div onclick="app.getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute text-center text-black p-2">
                            <h3>${arr[i].strCategory}</h3>
                            <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        this.rowData.innerHTML = cartoona;
    }

    async getArea() {
        await this.fetchAndDisplay('https://www.themealdb.com/api/json/v1/1/list.php?a=list', function(data) {
            this.displayArea(data.meals);
        });
    }

    displayArea(arr) {
        let cartoona = "";
        for (let i = 0; i < arr.length; i++) {
            cartoona += `
                <div class="col-md-3">
                    <div onclick="app.getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                    </div>
                </div>
            `;
        }
        this.rowData.innerHTML = cartoona;
    }

    async getIngredients() {
        await this.fetchAndDisplay('https://www.themealdb.com/api/json/v1/1/list.php?i=list', function(data) {
            this.displayIngredients(data.meals.slice(0, 20));
        });
    }

    displayIngredients(arr) {
        let cartoona = "";
        for (let i = 0; i < arr.length; i++) {
            cartoona += `
                <div class="col-md-3">
                    <div onclick="app.getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
            `;
        }
        this.rowData.innerHTML = cartoona;
    }

    async getCategoryMeals(category) {
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`, function(data) {
            this.displayMeals(data.meals.slice(0, 20));
        });
    }

    async getAreaMeals(area) {
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, function(data) {
            this.displayMeals(data.meals.slice(0, 20));
        });
    }

    async getIngredientsMeals(ingredient) {
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`, function(data) {
            this.displayMeals(data.meals.slice(0, 20));
        });
    }

    async getMealDetails(mealID) {
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`, function(data) {
            this.displayMealDetails(data.meals[0]);
        });
    }

    displayMealDetails(meal) {
        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
            }
        }

        let tags = meal.strTags ? meal.strTags.split(",") : [];
        let tagsStr = '';
        for (let i = 0; i < tags.length; i++) {
            tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
        }

        let cartoona = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
                <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        `;
        this.rowData.innerHTML = cartoona;
    }

    showSearchInputs() {
        this.searchContainer.innerHTML = `
            <div class="row py-4">
                <div class="col-md-6">
                    <input onkeyup="app.searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
                </div>
                <div class="col-md-6">
                    <input onkeyup="app.searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
                </div>
            </div>
        `;
        this.rowData.innerHTML = "";
    }

    async searchByName(term) {
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`, function(data) {
            this.displayMeals(data.meals || []);
        });
    }

    async searchByFirstLetter(term) {
        term = term === "" ? "a" : term;
        await this.fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`, function(data) {
            this.displayMeals(data.meals || []);
        });
    }

    showContacts() {
        this.rowData.innerHTML = `
            <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                <div class="container w-75 text-center">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" onkeyup="app.inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" onkeyup="app.inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *example@yyy.zzz</div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" onkeyup="app.inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" onkeyup="app.inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
                        </div>
                        <div class="col-md-6">
                            <input id="passwordInput" onkeyup="app.inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                        </div>
                        <div class="col-md-6">
                            <input id="repasswordInput" onkeyup="app.inputsValidation()" type="password" class="form-control" placeholder="Repassword">
                            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid repassword</div>
                        </div>
                    </div>
                    <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
                </div>
            </div>
        `;

        this.submitBtn = document.getElementById("submitBtn");

        this.bindInputFocusEvents();
    }

    bindInputFocusEvents() {
        document.getElementById("nameInput").addEventListener("focus", () => { this.nameInputTouched = true; });
        document.getElementById("emailInput").addEventListener("focus", () => { this.emailInputTouched = true; });
        document.getElementById("phoneInput").addEventListener("focus", () => { this.phoneInputTouched = true; });
        document.getElementById("ageInput").addEventListener("focus", () => { this.ageInputTouched = true; });
        document.getElementById("passwordInput").addEventListener("focus", () => { this.passwordInputTouched = true; });
        document.getElementById("repasswordInput").addEventListener("focus", () => { this.repasswordInputTouched = true; });
    }

    inputsValidation() {
        if (this.nameInputTouched) {
            this.toggleValidationAlert("name", this.nameValidation());
        }
        if (this.emailInputTouched) {
            this.toggleValidationAlert("email", this.emailValidation());
        }
        if (this.phoneInputTouched) {
            this.toggleValidationAlert("phone", this.phoneValidation());
        }
        if (this.ageInputTouched) {
            this.toggleValidationAlert("age", this.ageValidation());
        }
        if (this.passwordInputTouched) {
            this.toggleValidationAlert("password", this.passwordValidation());
        }
        if (this.repasswordInputTouched) {
            this.toggleValidationAlert("repassword", this.repasswordValidation());
        }

        if (this.isFormValid()) {
            this.submitBtn.removeAttribute("disabled");
        } else {
            this.submitBtn.setAttribute("disabled", true);
        }
    }

    toggleValidationAlert(field, isValid) {
        const alertElement = document.getElementById(`${field}Alert`);
        if (isValid) {
            alertElement.classList.replace("d-block", "d-none");
        } else {
            alertElement.classList.replace("d-none", "d-block");
        }
    }

    isFormValid() {
        return (
            this.nameValidation() &&
            this.emailValidation() &&
            this.phoneValidation() &&
            this.ageValidation() &&
            this.passwordValidation() &&
            this.repasswordValidation()
        );
    }

    nameValidation() {
        return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
    }

    emailValidation() {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value);
    }

    phoneValidation() {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
    }

    ageValidation() {
        return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
    }

    passwordValidation() {
        return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
    }

    repasswordValidation() {
        return document.getElementById("repasswordInput").value === document.getElementById("passwordInput").value;
    }
}

const app = new YummyApp();
