const allUsers = JSON.parse(localStorage.getItem('amalFarm'))
const signInInfo = JSON.parse(localStorage.getItem('time'))

console.log(allUsers);
console.log(signInInfo);

if (allUsers && signInInfo) {
    const currentUser = allUsers.find(u => u.mail === signInInfo.mail)

    if (currentUser) {
        yourName.innerHTML = `Welcome Back, ${currentUser.first_name}`
    } if (currentUser){
        customerName.innerHTML = `${currentUser.first_name} ${currentUser.last_name}`
    } if (currentUser){
        customerEmail.innerHTML = `${currentUser.mail} `
    }

    if (signInInfo) {
        show.innerHTML = `Login Time: ${signInInfo.logInTime}`
    }
}