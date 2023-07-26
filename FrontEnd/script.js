
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

    if (isConnected) {
        buttonModif.setAttribute("class", "visible");
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
    })
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


function closeModal() {
    let elementModal = document.getElementById("backgroundModal");
    elementModal.setAttribute("class", "no-display");
    let content1 = document.getElementById("content1");
    content1.setAttribute("class", "content-visible");
    let content2 = document.getElementById("content2");
    content2.setAttribute("class", "no-display");
    let arrowLeft = document.getElementById("arrowLeft");
    arrowLeft.setAttribute("class", "no-display");

}

