function do_login() {
    Dajaxice.animations.login('Dajax.process', {
        username: document.getElementsByName('username')[0].value,
        password: document.getElementsByName('password')[0].value
    })
}
