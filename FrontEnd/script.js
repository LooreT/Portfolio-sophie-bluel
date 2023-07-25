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

                    // EVENT 
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