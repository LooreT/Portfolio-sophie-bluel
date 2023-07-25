window.onload = function() {
    let buttonSubmit = document.getElementById("formLogIn");
    buttonSubmit.addEventListener("submit", () => {
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
          .then(function(response) {
            return response.json()}   
            )
        .then(function (resultatPost) {
            console.log(resultatPost)




            window.location.href = "C:/Users/Lore-/Desktop/PRO/OPENCLASSROOMS/P6_Portfolio-architecte-sophie-bluel-master/FrontEnd/index.html";
        })

    })
};
