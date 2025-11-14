
const signin = () => {
    if (email.value.trim() === '' || password.value.trim() === '') {
        showError.style.display = 'block'
    } else {
        showError.style.display = 'none'
        const signInDetails = {
            mail: email.value,
            pass: password.value,
            logInTime: new Date().toLocaleTimeString()
        }
        console.log(signInDetails);


        const myCustomer = JSON.parse(localStorage.getItem('amalFarm'))
        const allUsers = myCustomer.find(use => use.mail === email.value.trim() && use.pass === password.value.trim())
        if (allUsers) {
            localStorage.setItem('time', JSON.stringify(signInDetails))
            alert('login successfully')
            signInBtn.innerHTML = `<div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                        </div>
                                            </div>`

            window.location.href = "../dashboard/index.html"
        } else {
            showError2.style.display = 'block'
        }
    }
}

