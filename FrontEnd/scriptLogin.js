window.onload = function () {
  let formLogIn = document.getElementById("formLogIn");
  formLogIn.addEventListener("submit", (event) => {
    // enlever rafraichissement automatique de la page
    event.preventDefault();
    let userMail = document.getElementById("mail")
    let userMdp = document.getElementById("mdp")
    console.log(userMail.value)
    console.log(userMdp.value)

    let user = {
      email: userMail.value,
      password: userMdp.value
    }

    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    })
      .then(function (response) {
        return response.json()
      }
      )
      .then(function (resultatPost) {
        console.log(resultatPost)

        if(resultatPost.userId != null) { 
        localStorage.setItem("user", resultatPost.token);
        console.info(localStorage.getItem("user"))
        window.location.href = "C:/Users/Lore-/Desktop/PRO/OPENCLASSROOMS/PROJET%206/FrontEnd/index.html";
        }
        else{
          let errorMessage = document.getElementById("error");
          errorMessage.setAttribute("class", "errorOn");
        }



        
      })

  })
};
