import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-preview-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class PreviewIndexComponent {
    isStylesReady = false;
    viewName: string;
    themeName: string;
    themeSize: string;
    widgetName: string;
    typographyClass: string;

    constructor(private router: Router) {
        const VIEW_POSITION = 1;
        const THEME_POSITION = 2;
        const urlParts = this.router.url.split('/');
        this.viewName = urlParts[VIEW_POSITION];
        this.themeName = urlParts[THEME_POSITION];
        this.typographyClass = 'dx-theme-' + this.themeName + '-typography';
    }

    receiveMessage(e: any): void {
        if(e.data.css) {
            this.addHeadStyles(e.data.css);
            this.themeSize = e.data.themeSize;
        }

        if(e.data.widget) {
            this.widgetName = e.data.widget;
        }
    }

    addHeadStyles(css: string): void {
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        const DYNAMIC_STYLES_ID = 'dynamic-styles';

        const dynamicStylesElement = document.getElementById(DYNAMIC_STYLES_ID);

        if(dynamicStylesElement) {
            dynamicStylesElement.parentNode.removeChild(dynamicStylesElement);
        }

        style.type = 'text/css';
        style.id = DYNAMIC_STYLES_ID;

        css = css
            .replace(/icons\/dxicons/gi, 'content/css/icons/dxicons')
            .replace(/fonts\/Roboto/gi, 'content/css/fonts/Roboto');

        style.appendChild(document.createTextNode(css));
        head.appendChild(style);

        this.isStylesReady = true;
    }

    ngAfterViewInit(): void {
        const messageListener = this.receiveMessage.bind(this);
        window.removeEventListener('message', messageListener);
        window.addEventListener('message', messageListener, false);
        window.parent.postMessage({ hideLoading: true }, window.parent.location.href);
    }
}
