
console.info(localStorage.getItem("user"))
let fileTooBig = false;

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
    let buttonProfile = document.getElementById("editProfile");
    let buttonLogin = document.getElementById("login");
    let buttonLogout = document.getElementById("logout");
    let bgEdit = document.getElementById("bgEdit");

    if (isConnected) {
        //a cacher
        buttonLogin.setAttribute("class", "no-display");

        // a montrer
        buttonModif.setAttribute("class", "pos-modif-proj");
        buttonProfile.setAttribute("class", "visible edit-profile");
        buttonLogout.setAttribute("class", "visible");
        bgEdit.setAttribute("class", "visible bg-edit");
        let filter = document.getElementById("filtre");
        filter.setAttribute("class", "no-display");

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

    arrowLeft.addEventListener("click", () => goLeft());

    buttonLogin.addEventListener("click", () => login())
    buttonLogout.addEventListener("click", () => logout())

    document.getElementById("buttonAddPhoto").addEventListener("click", ()=> document.getElementById('imgUpload').click())

    document.getElementById('imgUpload').addEventListener('change', (e) => {
        let errorFileSize = document.getElementById("errorFileSize");
        console.info(e.target.files[0])

        if (e.target.files[0].size > 4000000) {
            fileTooBig = true;
            errorFileSize.setAttribute("class", "errorMessage");
            return;
        }
        fileTooBig = false;
        errorFileSize.setAttribute("class", "no-display");

        //affichage image
        let Toto = document.getElementById("imgUploaded");
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            Toto.src = reader.result;
        }, false);
        reader.readAsDataURL(e.target.files[0]);

        const readerToSave = new FileReader();
        readerToSave.addEventListener("load", function () {
            fileAsBinaryToSave = readerToSave.result;
        }, false);
        readerToSave.readAsBinaryString(e.target.files[0]);

        //fin affichage image
        //cacher les element
        let iconInfoUpload = document.getElementById("iconInfoUpload")
        iconInfoUpload.setAttribute("class", "no-display");
        let imgUpload = document.getElementById("buttonAddPhoto")
        imgUpload.setAttribute("class", "no-display");
        let textInfoUpload = document.getElementById("textInfoUpload")
        textInfoUpload.setAttribute("class", "no-display");
        //fin cacher les element
        //check modal button disabled
        checkModalAddButton();
        //fin check modal button disabled
    });

    document.getElementById('cat').addEventListener('change', (e) => checkModalAddButton());
    document.getElementById('titleWorkToAdd').addEventListener('keyup', (e) => checkModalAddButton());
    addButtonModal2.addEventListener("click", () => sendNewWork())
}


function goLeft() {
    let content1 = document.getElementById("content1");
    content1.setAttribute("class", "content-visible");
    let arrowLeft = document.getElementById("arrowLeft");
    arrowLeft.setAttribute("class", "no-display");
    let content2 = document.getElementById("content2");
    content2.setAttribute("class", "no-display");
    refreshFormUpload();
}

function showWork(listToShow) {
    // aller chercher toutes les imges pour les supprimer
    document.querySelectorAll(".gallery figure").forEach((elem) => elem.remove());
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
    document.querySelectorAll(".gallery-modal figure").forEach((elem) => elem.remove());
    let galleryModal = document.querySelector("#galleryModal");

    for (let x = 0; x < listToShow.length; x++) {

        let newFigure = document.createElement("figure");
        let newImg = document.createElement("img");
        let newCaption = document.createElement("figcaption");

        let containerImg = document.createElement("div");
        containerImg.setAttribute("class", "img-lock")

        let containerIcons = document.createElement("div")
        containerIcons.setAttribute("class", "icones-modale");
        let arrowsIcon = document.createElement("i");
        arrowsIcon.setAttribute("class", "fa-solid fa-arrows-up-down-left-right");
        let trashIcon = document.createElement("i");
        trashIcon.setAttribute("class", "fa-solid fa-trash-can");
        trashIcon.setAttribute("id", "iconDelete" + listToShow[x].id);
        trashIcon.addEventListener("click", () => {
            fetch('http://localhost:5678/api/works/' + listToShow[x].id, {
                method: 'DELETE',
                headers: {
                    Authorization : "Bearer " + localStorage.getItem("user")
                }
            }).then(function (response) {
                if (response.ok) {
                    //RAFRAICHIR LA GALLERIE MODALE + Gallerie index
                    refreshWorks();
                }
            })
        })



        // image + alt
        newImg.setAttribute("src", listToShow[x].imageUrl);
        newImg.setAttribute("alt", listToShow[x].title);

        // title caption
        newCaption.innerHTML = "éditer";

        containerIcons.appendChild(arrowsIcon);
        containerIcons.appendChild(trashIcon);
        
        containerImg.appendChild(containerIcons);

        containerImg.appendChild(newImg);
        newFigure.appendChild(containerImg)
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
    
    document.getElementById("addSuccess").setAttribute("class", "no-display");
    refreshFormUpload();
}

function refreshFormUpload() {
    let iconInfoUpload = document.getElementById("iconInfoUpload")
    iconInfoUpload.setAttribute("class", "fa-sharp fa-regular fa-image icon-img");
    let imgUpload = document.getElementById("buttonAddPhoto");
    imgUpload.setAttribute("class", "button-add-file");
    imgUpload.value = '';
    let textInfoUpload = document.getElementById("textInfoUpload");
    textInfoUpload.setAttribute("class", "visible");
    //reinit image
    let imgUploaded = document.getElementById("imgUploaded");
    imgUploaded.setAttribute("src", "");

    document.getElementById('cat').value = "";
    document.getElementById('titleWorkToAdd').value = "";
    errorFileSize.setAttribute("class", "no-display");
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
    let button = document.getElementById("addButtonModal2");
    console.info('TATITUR')

    //& => il va check jusqu'au bout peut importe si c'est ok
    //&& => il s'arrrete des que c'est pas bon
    if (!fileTooBig && img.value != "" && img.value != null && cat.value != "" && cat.value != null && title.value != "" && title.value != null) {
        button.disabled = false;
    }
    else {
        console.info('DURDURDUR')
        button.disabled = true;
    }
}

function sendNewWork() {
    let img = document.getElementById("imgUpload");
    console.info(img)
    let cat = document.getElementById("cat");
    let title = document.getElementById("titleWorkToAdd");

    var formData = new FormData();
    
    formData.append("image", img.files[0]);
    formData.append("title", title.value);
    formData.append("category", cat.value);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            Authorization : "Bearer " + localStorage.getItem("user"),
            'Accept': 'application/json'
        },
        body: formData
    }).then(function (response) {
        if (response.ok) {
            let parAddSuccess = document.getElementById("addSuccess");
            parAddSuccess.setAttribute("class", "add-success");
            //RAFRAICHIR LA GALLERIE MODALE + ²
            refreshWorks();
            
            //REVENIR EN ARRIERE
            goLeft();
        }
    })
}

function refreshWorks(){
    fetch('http://localhost:5678/api/works')
            .then(function (response) {
                if (response.ok) {
                    console.log("toto");
                    return response.json();
                }
            })
            .then(function (resultWork) {
                console.info("dfjslqjklsnhfjklqsnfjk")
                showWork(resultWork);
                addWorkModal(resultWork);
            })
}
