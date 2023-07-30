
console.info(localStorage.getItem("user"))



fetch('http://localhost:5678/api/works')
    .then(function (response) {
        if (response.ok) {
            console.log("riku");
            return response.json();
        }
        console.log(response.json());
    })
    .then(function (resultWork) {
        showWork(resultWork);
        fetch('http://localhost:5678/api/categories')
            .then(function (response) {
                if (response.ok) {
                    console.log("toto");
                    return response.json();
                }
            })
            .then(function (resultCat) {
                console.log(resultCat)
                addWorkModal(resultWork);
                let modaleCat = document.getElementById("cat");
                let filterList = document.getElementById("filtre");
                let buttonFilter = document.createElement("button");
                buttonFilter.setAttribute("class", "buttonFilterFull");
                buttonFilter.innerHTML = "Tous";

                // AJOUT POUR TOUS
                buttonFilter.addEventListener("click", () => {
                    let buttonToReset = document.querySelector("#filtre .buttonFilterFull");
                    buttonToReset.setAttribute("class", "buttonFilter");
                    buttonFilter.setAttribute("class", "buttonFilterFull");
                    document.querySelectorAll(".gallery figure").forEach((elem) => elem.remove());
                    showWork(resultWork);
                });

                filterList.appendChild(buttonFilter);

                for (let x = 0; x < resultCat.length; x++) {
                    //boutons 
                    let buttonFilter = document.createElement("button");
                    buttonFilter.setAttribute("class", "buttonFilter");
                    buttonFilter.innerHTML = resultCat[x].name;
                    filterList.appendChild(buttonFilter);

                    // EVENT CATEGORIES
                    buttonFilter.addEventListener("click", () => {
                        let buttonToReset = document.querySelector("#filtre .buttonFilterFull");
                        buttonToReset.setAttribute("class", "buttonFilter");
                        buttonFilter.setAttribute("class", "buttonFilterFull");

                        const workFiltered = resultWork.filter(function (work) {
                            // Identique ? booleen true false
                            return work.category.id == resultCat[x].id;
                        });
                        console.log(workFiltered)
                        // aller chercher toutes les imges pour les supprimer
                        document.querySelectorAll(".gallery figure").forEach((elem) => elem.remove());
                        // appel de la fonction qui affiche uniquement les elements de la liste filtré
                        showWork(workFiltered);
                    });
                    //fin boutons

                    //modale
                    addCatOptionModale(modaleCat, resultCat[x]);
                    //fin modale
                }
            });
    });
window.onload = function () {
    let elementOutModal = document.getElementById("backgroundModal");
    let elementModal = document.getElementById("containerModal");
    elementOutModal.addEventListener("click", () => closeModal());
    elementModal.addEventListener("click", (event) => event.stopPropagation())

    let xMark = document.querySelector(".fa-xmark");
    xMark.addEventListener("click", () => closeModal());

    let isConnected = localStorage.getItem("user") != null;
    let buttonModif = document.getElementById("editProject");
    let buttonLogin = document.getElementById("login");
    let buttonLogout = document.getElementById("logout");
    let bgEdit = document.getElementById("bgEdit");

    if (isConnected) {
        //a cacher
        buttonLogin.setAttribute("class", "no-display");

        // a montrer
        buttonModif.setAttribute("class", "visible");
        buttonLogout.setAttribute("class", "visible");
        bgEdit.setAttribute("class", "visible bg-edit");
    }

    buttonModif.addEventListener("click", () => {
        let modal = document.getElementById("backgroundModal");
        modal.setAttribute("class", "background");
    })

    let buttonAdd = document.getElementById("addButton");
    buttonAdd.addEventListener("click", () => {
        let content1 = document.getElementById("content1");
        content1.setAttribute("class", "no-display");
        let arrowLeft = document.getElementById("arrowLeft");
        arrowLeft.setAttribute("class", "fa-solid fa-arrow-left");
        let content2 = document.getElementById("content2");
        content2.setAttribute("class", "content-visible");
    })

    arrowLeft.addEventListener("click", () => {
        let content1 = document.getElementById("content1");
        content1.setAttribute("class", "content-visible");
        let arrowLeft = document.getElementById("arrowLeft");
        arrowLeft.setAttribute("class", "no-display");
        let content2 = document.getElementById("content2");
        content2.setAttribute("class", "no-display");
        refreshImgUpload()
    })

    buttonLogin.addEventListener("click", () => login())
    buttonLogout.addEventListener("click", () => logout())

    document.getElementById('imgUpload').addEventListener('change', (e) =>  {
        console.info(e.target.files[0])

        //affichage image
        let Toto = document.getElementById("imgUploaded");
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            Toto.src = reader.result;
          }, false);  

        reader.readAsDataURL(e.target.files[0]);
//fin affichage image
//cacher les element
        let iconInfoUpload = document.getElementById("iconInfoUpload")
        iconInfoUpload.setAttribute("class", "no-display");
        let imgUpload= document.getElementById("imgUpload")
        imgUpload.setAttribute("class", "no-display");
        let textInfoUpload = document.getElementById("textInfoUpload")
        textInfoUpload.setAttribute("class", "no-display");
        //fin cacher les element
        //check modal button disabled
        checkModalAddButton();
        //fin check modal button disabled
      });

      document.getElementById('cat').addEventListener('change', (e) => checkModalAddButton());
      document.getElementById('titleWorkToAdd').addEventListener('change', (e) => checkModalAddButton());
}


function showWork(listToShow) {
    let galleryPortfolio = document.querySelector("#portfolio .gallery");

    for (let x = 0; x < listToShow.length; x++) {

        let newFigure = document.createElement("figure");
        let newImg = document.createElement("img");
        let newCaption = document.createElement("figcaption");
        // image + alt
        newImg.setAttribute("src", listToShow[x].imageUrl);
        newImg.setAttribute("alt", listToShow[x].title);

        // title caption
        newCaption.innerHTML = listToShow[x].title;

        newFigure.appendChild(newImg);
        newFigure.appendChild(newCaption);
        galleryPortfolio.appendChild(newFigure);
    }
}

function addWorkModal(listToShow) {
    let galleryModal = document.querySelector("#galleryModal");

    for (let x = 0; x < listToShow.length; x++) {

        let newFigure = document.createElement("figure");
        let newImg = document.createElement("img");
        let newCaption = document.createElement("figcaption");
        // image + alt
        newImg.setAttribute("src", listToShow[x].imageUrl);
        newImg.setAttribute("alt", listToShow[x].title);

        // title caption
        newCaption.innerHTML = "editer";

        newFigure.appendChild(newImg);
        newFigure.appendChild(newCaption);
        galleryModal.appendChild(newFigure);
    }
}

function addCatOptionModale(modaleCat, resultCat) {
    let newOption = document.createElement("option");
    // option value
    newOption.setAttribute("value", resultCat.id);

    // option innerHtml
    newOption.innerHTML = resultCat.name;

    modaleCat.appendChild(newOption);
}


function closeModal() {
    let elementModal = document.getElementById("backgroundModal");
    elementModal.setAttribute("class", "no-display");
    let content1 = document.getElementById("content1");
    content1.setAttribute("class", "content-visible");
    let content2 = document.getElementById("content2");
    content2.setAttribute("class", "no-display");
    let arrowLeft = document.getElementById("arrowLeft");
    arrowLeft.setAttribute("class", "no-display");
    refreshImgUpload()
}

function refreshImgUpload() {
    let iconInfoUpload = document.getElementById("iconInfoUpload")
    iconInfoUpload.setAttribute("class", "fa-sharp fa-regular fa-image icon-img");
    let imgUpload= document.getElementById("imgUpload");
    imgUpload.setAttribute("class", "visible");
    imgUpload.value = '';
    let textInfoUpload = document.getElementById("textInfoUpload");
    textInfoUpload.setAttribute("class", "visible");
    //reinit image
    let imgUploaded = document.getElementById("imgUploaded");
    imgUploaded.setAttribute("src", "");
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "C:/Users/Lore-/Desktop/PRO/OPENCLASSROOMS/PROJET%206/FrontEnd/index.html";
}

function login() {
    window.location.href = "C:/Users/Lore-/Desktop/PRO/OPENCLASSROOMS/PROJET%206/FrontEnd/connexion.html";
}

function checkModalAddButton() {
    let img = document.getElementById("imgUpload");
    let cat = document.getElementById("cat");
    let title = document.getElementById("titleWorkToAdd");
    let button = document.getElementById("addButton");
    console.info('TATITUR')

    //& => il va check jusqu'au bout peut importe si c'est okay
    //&& => il s'arrrete des que c'est pas bon
    if(img.value != "" && img.value != null && cat.value != "" && cat.value != null && title.value != "" && title.value != null)
    {
        button.disabled = false;
    }
    else
    {
        console.info('DURDURDUR')
        button.disabled = true;
    }
}
