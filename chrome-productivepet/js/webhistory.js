"use strict";

class WebHistory {

    constructor() {
        this.current = {};
    }

    update(tab) {
        var tabUrl = WebHistory.domain(tab);

        if (!this.current.url) {
            this.current.url = tabUrl;
            this.current.start = Date.now();
        }
        else if (this.current.url != tabUrl) {
            this.current.end = Date.now();
            Storage.update('webhistory', this.current);

            this.current = {}; // THIS LINE IS IMPORTANT... without it, newData != newData inside Storage
            this.current.url = tabUrl;
            this.current.start = Date.now();

            Watcher.notify(tab);
        }
        else if (this.current.url == tabUrl) {
            return
        }

        Storage.get('webicons', function(icons) {
            if (!Object.keys(icons).includes(tabUrl)) {
                let d = {}
                d[tabUrl] = tab.favIconUrl;
                Storage.update('webicons', d);
            }
        })
   }

    idle() {
        if (!!this.current.url) {
            this.current.end = Date.now();
            Storage.update('webhistory', this.current);
            this.current = {};
        }
    }

    static domain(tab) {
        return tab.url.startsWith('chrome') ? tab.title : this.extractDomain(tab.url);
    }

    static extractDomain(url) {
        return (new URL(url)).hostname;
    }
    
}