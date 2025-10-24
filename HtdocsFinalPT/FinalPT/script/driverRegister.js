$(document).ready(()=>{

$("#register").click(()=>{
    
    const username = $("#username").val()
    const password = $("#password").val()
    const confirmPass = $("#confirmPassword").val()
    const firstName = $("#firstname").val()
    const lastName = $("#lastname").val()
    const number = $("#number").val()
    const city = $("#city").val()
    const brgy = $("#brgy").val()



    if(username === null || username === "" ||
       password === null || password === "" ||
       confirmPass === null || confirmPass === "" ||
       firstName === null || firstName === "" ||
       lastName === null || lastName === "" ||
       number === null || number === "" ||
       city === null || city === "" ||
       brgy === null || brgy ===""
    ){
     alert("Please Complete the form")   
    }
    else{

        if(confirmPass != password){
        return alert("Password is not matched")   
        }

        if(number.length !== 11){
            return alert("Number should be 11 digits")   
        }

        $.ajax({
            url: "../../admin/driverRegister.php",
            method: "POST",
            data: {
                username,
                password,
                firstName,
                lastName,
                number,
                city,
                brgy
            },
            success: (response)=>{
                try {
                    let res = JSON.parse(response);
                    alert(res.message);
                } catch(e) {
                    console.error("Invalid JSON:", response);
                    alert("Server error: check console");
                }
            },
            error: ()=>{
                alert("Error connecting to server");
            }
        });

    }

})




})