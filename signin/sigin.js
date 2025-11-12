
const signin = () =>{
    if (email.value.trim()==='' || password.value.trim()===''){
        showError.style.display = 'block'
    } else {
        showError.style.display = 'none'
        const myCustomer = JSON.parse(localStorage.getItem('amalFarm'))
        const allUsers = myCustomer.find(use => use.mail === email.value.trim() && use.pass === password.value.trim())
        if (allUsers){
            alert('login successfully')
            window.location.href = "../index.html"
        } else {
            showError2.style.display = 'block'
        }
    }
}

