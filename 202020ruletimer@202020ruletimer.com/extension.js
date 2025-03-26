import GObject from 'gi://GObject';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Eye Care Reminder'));
        this.add_child(new St.Icon({
            icon_name: 'face-angry-symbolic',
            style_class: 'system-status-icon',
        }));
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1200, () => {
            this._showNotification();
            return GLib.SOURCE_CONTINUE;
        });
        let item = new PopupMenu.PopupMenuItem(_('Show Notification'));
        item.connect('activate', () => {
            this._showNotification();
        });
        this.menu.addMenuItem(item);
    }
    
    _showNotification() {
        Main.notify('Rest your eyes', 'The code can wait!', { 
            gicon: new Gio.ThemedIcon({ name: 'face-angry-symbolic' }), 
            bannerMarkup: true,
            resident: true
        });
    }
    
    destroy() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }
        super.destroy();
    }
});

export default class EyeCareReminderExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator, 1, 'left');
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
