/*
 *  acabed - webeditor for blinkenlights xml files
 *  Copyright (C) 2010 Raffael Mancini <raffael.mancini@hcl-club.lu>
 *                     Franz Pletz <fpletz@fnordicwalking.de>
 *
 *  This file is part of acabed.
 *
 *  acabed is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  acabed is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function init_start() {

}

function init() {
    // Don't use firebug console if not installed
    if (typeof console === 'undefined') {
        console = {
            log: function () {},
            info: function () {},
            group: function () {},
            error: function () {},
            warn: function () {},
            groupEnd: function () {}
        };
    }

    if (typeof FileReader === 'undefined') {
        alert("FileReader not supported! Opera ROCKT!!!!!!!!");
    }

    // omgwtf, iphone or ipad!
    if (navigator.userAgent.contains('iPhone OS')) {
        var mask = new Mask(document.body, {
            id: 'overlay',
            hideOnClick: true,
            destroyOnHide: true,
        });

        // scaling for the poor
        var apimgw = window.innerWidth < 960 ? window.innerWidth : 960;
        var apimgh = window.innerHeight < 960 ? window.innerHeight : 960;
        if(apimgw < 960)
            apimgh = apimgw;
        else if(apimgh < 960)
            apimgw = apimgh;

        var apimg = new Element('img', {
            src: '/assets/images/ipad1984.png',
            class: 'applefail',
            styles: {
                width: apimgw,
                height: apimgh,
                position: 'fixed',
                left: window.innerWidth / 2 - apimgw / 2,
                top: window.innerHeight / 2 - apimgh / 2,
            },
         });
        $('overlay').grab(apimg);

        mask.show();
    }

    MessageWidget.create();

    Dajaxice.animations.login_widget('Dajax.process');
    Dajaxice.animations.load_editor('Dajax.process');
    //Dajaxice.animations.load_start('Dajax.process');
};

window.addEvent('domready', init);

