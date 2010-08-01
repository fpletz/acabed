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

var Dialog = new Class({
    Extends: Widget,

    options: {
        'class': 'dialog',
        title: 'new dialog',
        buttons: [],
    },

    initialize: function(id, content, options) {
        this.parent(id, options);
        this.content = content;

        var widget_content = new Widget('dialog-content');
        widget_content.el.grab(content.el);

        this.container = new WidgetContainer('dialog-container', {
            widgets: [
                new Widget('dialog-title', {
                    text: this.options.title,
                }),
                widget_content,
                new WidgetContainer('dialog-buttons', {
                    widgets: this.options.buttons,
                }),
            ],
        });
    }
});

var ModalDialog = new Class({
    Extends: Dialog,

    options: {
    },

    initialize: function(id, content, options) {
        this.parent(id, content, options);
        this.overlay_id = 'overlay-' + id;

        this.mask = document.body.get('mask', {
            id: this.overlay_id,
            'class': 'overlay',
            hideOnClick: true,
            destroyOnHide: true,
        });

        var overlay = $(this.overlay_id);
        var container = this.container.el;

        overlay.grab(container);

        container.addEvent('click', function(event) {
            event.stop();
        });
    },

    show: function() {
        this.mask.show();

        var overlay_size = $(this.overlay_id).getSize();
        var container = this.container.el;
        var container_size = container.getSize();

        container.setStyle('left', (overlay_size.x / 2 - container_size.x / 2) + 'px');
        container.setStyle('top', (overlay_size.y / 2 - container_size.y / 2) + 'px');
    },

    hide: function() {
        this.mask.hide();
    },
});

ModalDialog.destroy = function() {
    document.body.get('mask').destroy();
}

