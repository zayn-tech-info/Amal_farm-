// let allUsers = []
// if (localStorage.facebuukUsers) {
//     const fetched = JSON.parse(localStorage.getItem('amalFarm'))
//     allUsers = fetched
// } else {
//     allUsers = []
// }

// localStorage.facebuukUsers?allUsers=JSON.parse(localStorage.getItem('facebuukUsers')):allUsers=[]

let newUsers = JSON.parse(localStorage.getItem('amalFarm')) || []


const signUp = () => {
    if (firstName.value.trim() === '' || lastName.value.trim() === '' || email.value.trim() === '' || password.value.trim() === '' || confirmPassword.value.trim() === '') {
        showError.style.display = 'block'
        showError2.style.display = 'none'
    } else {
        showError.style.display = 'none'
        const userObj = {
            first_name: firstName.value,
            last_name: lastName.value,
            mail: email.value,
            pass: password.value,
            password: confirmPassword.value
        }
        let emailRegexString = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const confirmEmail = emailRegexString.test(userObj.mail)
        if (confirmEmail) {
            const found = newUsers.find(user => user.mail === userObj.mail)
            if (found) {
                alert('account already exists')
            } else {
                if (password.value.trim() === confirmPassword.value.trim()) {
                    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    const validPassword = passwordRegex.test(userObj.pass)
                    if (validPassword){
                        
                        newUsers.push(userObj)
                        localStorage.setItem('amalFarm', JSON.stringify(newUsers))
                        alert('Registration successful')
                        window.location.href = "../signin/signin.html"
                    } else{
                        showError4.style.display = 'block'
                        showError3.style.display = 'none'
                    }signin
                }else{
                    showError3.style.display = 'block'
                    showError4.style.display = 'none'
                }
            }
        }else {
            showError2.style.display = 'block'
        }


        firstName.value = ''
        lastName.value = ''
        email.value = ''
        password.value = ''
    }
}