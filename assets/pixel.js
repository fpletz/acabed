function init () {
    Dajaxice.acab.login_widget('Dajax.process');
    $('id_color').addEvent('change', function () {
        $('color').setStyle('background-color', '#'+target.value);
    });
    
    $('donorpic').addEvent('click', function (e) {
        e.stop();
        console.log('click!');
        $('id_picture').fireEvent('click', e);
        $('id_picture').click();
    });
}

window.addEvent('load', init);