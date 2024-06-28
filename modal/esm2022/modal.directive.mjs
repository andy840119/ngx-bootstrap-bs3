// todo: should we support enforce focus in?
// todo: in original bs there are was a way to prevent modal from showing
// todo: original modal had resize events
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewContainerRef, Optional, Inject } from '@angular/core';
import { document, window, isBs3, Utils } from 'ngx-bootstrap/utils';
import { ModalBackdropComponent } from './modal-backdrop.component';
import { CLASS_NAME, DISMISS_REASONS, modalConfigDefaults, ModalOptions, MODAL_CONFIG_DEFAULT_OVERRIDE } from './modal-options.class';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import * as i0 from "@angular/core";
import * as i1 from "ngx-bootstrap/component-loader";
import * as i2 from "./modal-options.class";
const TRANSITION_DURATION = 300;
const BACKDROP_TRANSITION_DURATION = 150;
/** Mark any code with directive to show it's content in modal */
export class ModalDirective {
    /** allows to set modal configuration via element property */
    set config(conf) {
        this._config = this.getConfig(conf);
    }
    get config() {
        return this._config;
    }
    get isShown() {
        return this._isShown;
    }
    constructor(_element, _viewContainerRef, _renderer, clf, modalDefaultOption) {
        this._element = _element;
        this._renderer = _renderer;
        /** This event fires immediately when the `show` instance method is called. */
        this.onShow = new EventEmitter();
        /** This event is fired when the modal has been made visible to the user
         * (will wait for CSS transitions to complete)
         */
        this.onShown = new EventEmitter();
        /** This event is fired immediately when
         * the hide instance method has been called.
         */
        this.onHide = new EventEmitter();
        /** This event is fired when the modal has finished being
         * hidden from the user (will wait for CSS transitions to complete).
         */
        this.onHidden = new EventEmitter();
        this._isShown = false;
        this.isBodyOverflowing = false;
        this.originalBodyPadding = 0;
        this.scrollbarWidth = 0;
        this.timerHideModal = 0;
        this.timerRmBackDrop = 0;
        this.isNested = false;
        this.clickStartedInContent = false;
        this._focusEl = null;
        this._backdrop = clf.createLoader(_element, _viewContainerRef, _renderer);
        this._config = modalDefaultOption || modalConfigDefaults;
    }
    onClickStarted(event) {
        this.clickStartedInContent = event.target !== this._element.nativeElement;
    }
    onClickStop(event) {
        const clickedInBackdrop = event.target === this._element.nativeElement && !this.clickStartedInContent;
        if (this.config.ignoreBackdropClick ||
            this.config.backdrop === 'static' ||
            !clickedInBackdrop) {
            this.clickStartedInContent = false;
            return;
        }
        this.dismissReason = DISMISS_REASONS.BACKRDOP;
        this.hide(event);
    }
    // todo: consider preventing default and stopping propagation
    onEsc(event) {
        if (!this._isShown) {
            return;
        }
        if (event.keyCode === 27 || event.key === 'Escape') {
            event.preventDefault();
        }
        if (this.config.keyboard) {
            this.dismissReason = DISMISS_REASONS.ESC;
            this.hide();
        }
    }
    ngOnDestroy() {
        if (this._isShown) {
            this._isShown = false;
            this.hideModal();
            this._backdrop.dispose();
        }
    }
    ngOnInit() {
        this._config = this._config || this.getConfig();
        setTimeout(() => {
            if (this._config.show) {
                this.show();
            }
        }, 0);
    }
    /* Public methods */
    /** Allows to manually toggle modal visibility */
    toggle() {
        return this._isShown ? this.hide() : this.show();
    }
    /** Allows to manually open modal */
    show() {
        this.dismissReason = void 0;
        this.onShow.emit(this);
        if (this._isShown) {
            return;
        }
        clearTimeout(this.timerHideModal);
        clearTimeout(this.timerRmBackDrop);
        this._isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        if (document && document.body) {
            if (document.body.classList.contains(CLASS_NAME.OPEN)) {
                this.isNested = true;
            }
            else {
                this._renderer.addClass(document.body, CLASS_NAME.OPEN);
                this._renderer.setStyle(document.body, 'overflow-y', 'hidden');
            }
        }
        this.showBackdrop(() => {
            this.showElement();
        });
    }
    /** Check if we can close the modal */
    hide(event) {
        if (!this._isShown) {
            return;
        }
        if (event) {
            event.preventDefault();
        }
        if (this.config.closeInterceptor) {
            this.config.closeInterceptor().then(() => this._hide(), () => undefined);
            return;
        }
        this._hide();
    }
    /** Private methods @internal */
    /**
     *  Manually close modal
     *  @internal
     */
    _hide() {
        this.onHide.emit(this);
        window.clearTimeout(this.timerHideModal);
        window.clearTimeout(this.timerRmBackDrop);
        this._isShown = false;
        this._renderer.removeClass(this._element.nativeElement, CLASS_NAME.IN);
        if (!isBs3()) {
            this._renderer.removeClass(this._element.nativeElement, CLASS_NAME.SHOW);
        }
        // this._addClassIn = false;
        if (this._config.animated) {
            this.timerHideModal = window.setTimeout(() => this.hideModal(), TRANSITION_DURATION);
        }
        else {
            this.hideModal();
        }
        if (this._focusEl) {
            this._focusEl.focus();
        }
    }
    getConfig(config) {
        return Object.assign({}, this._config, config);
    }
    /**
     *  Show dialog
     *  @internal
     */
    showElement() {
        // todo: replace this with component loader usage
        if (!this._element.nativeElement.parentNode ||
            this._element.nativeElement.parentNode.nodeType !== Node.ELEMENT_NODE) {
            // don't move modals dom position
            if (document && document.body) {
                document.body.appendChild(this._element.nativeElement);
            }
        }
        this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'false');
        this._renderer.setAttribute(this._element.nativeElement, 'aria-modal', 'true');
        this._renderer.setStyle(this._element.nativeElement, 'display', 'block');
        this._renderer.setProperty(this._element.nativeElement, 'scrollTop', 0);
        if (this._config.animated) {
            Utils.reflow(this._element.nativeElement);
        }
        // this._addClassIn = true;
        this._renderer.addClass(this._element.nativeElement, CLASS_NAME.IN);
        if (!isBs3()) {
            this._renderer.addClass(this._element.nativeElement, CLASS_NAME.SHOW);
        }
        const transitionComplete = () => {
            if (this._config.focus) {
                this._element.nativeElement.focus();
            }
            this.onShown.emit(this);
        };
        if (this._config.animated) {
            setTimeout(transitionComplete, TRANSITION_DURATION);
        }
        else {
            transitionComplete();
        }
    }
    /** @internal */
    hideModal() {
        this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'true');
        this._renderer.setStyle(this._element.nativeElement, 'display', 'none');
        this.showBackdrop(() => {
            if (!this.isNested) {
                if (document && document.body) {
                    this._renderer.removeClass(document.body, CLASS_NAME.OPEN);
                    this._renderer.setStyle(document.body, 'overflow-y', '');
                }
                this.resetScrollbar();
            }
            this.resetAdjustments();
            this.focusOtherModal();
            this.onHidden.emit(this);
        });
    }
    // todo: original show was calling a callback when done, but we can use
    // promise
    /** @internal */
    showBackdrop(callback) {
        if (this._isShown &&
            this.config.backdrop &&
            (!this.backdrop || !this.backdrop.instance.isShown)) {
            this.removeBackdrop();
            this._backdrop
                .attach(ModalBackdropComponent)
                .to('body')
                .show({ isAnimated: this._config.animated });
            this.backdrop = this._backdrop._componentRef;
            if (!callback) {
                return;
            }
            if (!this._config.animated) {
                callback();
                return;
            }
            setTimeout(callback, BACKDROP_TRANSITION_DURATION);
        }
        else if (!this._isShown && this.backdrop) {
            this.backdrop.instance.isShown = false;
            const callbackRemove = () => {
                this.removeBackdrop();
                if (callback) {
                    callback();
                }
            };
            if (this.backdrop.instance.isAnimated) {
                this.timerRmBackDrop = window.setTimeout(callbackRemove, BACKDROP_TRANSITION_DURATION);
            }
            else {
                callbackRemove();
            }
        }
        else if (callback) {
            callback();
        }
    }
    /** @internal */
    removeBackdrop() {
        this._backdrop.hide();
    }
    /** Events tricks */
    // no need for it
    // protected setEscapeEvent():void {
    //   if (this._isShown && this._config.keyboard) {
    //     $(this._element).on(Event.KEYDOWN_DISMISS, (event) => {
    //       if (event.which === 27) {
    //         this.hide()
    //       }
    //     })
    //
    //   } else if (!this._isShown) {
    //     $(this._element).off(Event.KEYDOWN_DISMISS)
    //   }
    // }
    // protected setResizeEvent():void {
    // console.log(this.renderer.listenGlobal('', Event.RESIZE));
    // if (this._isShown) {
    //   $(window).on(Event.RESIZE, $.proxy(this._handleUpdate, this))
    // } else {
    //   $(window).off(Event.RESIZE)
    // }
    // }
    focusOtherModal() {
        if (this._element.nativeElement.parentElement == null) {
            return;
        }
        const otherOpenedModals = this._element.nativeElement.parentElement.querySelectorAll('.in[bsModal]');
        if (!otherOpenedModals.length) {
            return;
        }
        otherOpenedModals[otherOpenedModals.length - 1].focus();
    }
    /** @internal */
    resetAdjustments() {
        this._renderer.setStyle(this._element.nativeElement, 'paddingLeft', '');
        this._renderer.setStyle(this._element.nativeElement, 'paddingRight', '');
    }
    /** Scroll bar tricks */
    /** @internal */
    checkScrollbar() {
        this.isBodyOverflowing = document.body.clientWidth < window.innerWidth;
        this.scrollbarWidth = this.getScrollbarWidth();
    }
    setScrollbar() {
        if (!document) {
            return;
        }
        this.originalBodyPadding = parseInt(window
            .getComputedStyle(document.body)
            .getPropertyValue('padding-right') || 0, 10);
        if (this.isBodyOverflowing) {
            document.body.style.paddingRight = `${this.originalBodyPadding +
                this.scrollbarWidth}px`;
        }
    }
    resetScrollbar() {
        document.body.style.paddingRight = `${this.originalBodyPadding}px`;
    }
    // thx d.walsh
    getScrollbarWidth() {
        const scrollDiv = this._renderer.createElement('div');
        this._renderer.addClass(scrollDiv, CLASS_NAME.SCROLLBAR_MEASURER);
        this._renderer.appendChild(document.body, scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this._renderer.removeChild(document.body, scrollDiv);
        return scrollbarWidth;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: ModalDirective, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i1.ComponentLoaderFactory }, { token: MODAL_CONFIG_DEFAULT_OVERRIDE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.4", type: ModalDirective, selector: "[bsModal]", inputs: { config: "config", closeInterceptor: "closeInterceptor" }, outputs: { onShow: "onShow", onShown: "onShown", onHide: "onHide", onHidden: "onHidden" }, host: { listeners: { "mousedown": "onClickStarted($event)", "mouseup": "onClickStop($event)", "keydown.esc": "onEsc($event)" } }, exportAs: ["bs-modal"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: ModalDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[bsModal]',
                    exportAs: 'bs-modal'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i1.ComponentLoaderFactory }, { type: i2.ModalOptions, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MODAL_CONFIG_DEFAULT_OVERRIDE]
                }] }]; }, propDecorators: { config: [{
                type: Input
            }], closeInterceptor: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onShown: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onHidden: [{
                type: Output
            }], onClickStarted: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }], onClickStop: [{
                type: HostListener,
                args: ['mouseup', ['$event']]
            }], onEsc: [{
                type: HostListener,
                args: ['keydown.esc', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0Q0FBNEM7QUFDNUMseUVBQXlFO0FBQ3pFLHlDQUF5QztBQUV6QyxPQUFPLEVBQ1MsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFDbkQsTUFBTSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUN6RSxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUNMLFVBQVUsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLDZCQUE2QixFQUM5RixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBbUIsc0JBQXNCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7OztBQUd6RixNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQztBQUNoQyxNQUFNLDRCQUE0QixHQUFHLEdBQUcsQ0FBQztBQUV6QyxpRUFBaUU7QUFLakUsTUFBTSxPQUFPLGNBQWM7SUFDekIsNkRBQTZEO0lBQzdELElBQ0ksTUFBTSxDQUFDLElBQWtCO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUE4QkQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFvQkQsWUFDVSxR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QWxFeEMsY0FBYzs7MkZBQWQsY0FBYztrQkFKMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCOzswQkFtRUksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyw2QkFBNkI7NENBL0QvQyxNQUFNO3NCQURULEtBQUs7Z0JBVUcsZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUlOLE1BQU07c0JBREwsTUFBTTtnQkFNUCxPQUFPO3NCQUROLE1BQU07Z0JBTVAsTUFBTTtzQkFETCxNQUFNO2dCQU1QLFFBQVE7c0JBRFAsTUFBTTtnQkE4Q1AsY0FBYztzQkFEYixZQUFZO3VCQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFNckMsV0FBVztzQkFEVixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFrQm5DLEtBQUs7c0JBREosWUFBWTt1QkFBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0b2RvOiBzaG91bGQgd2Ugc3VwcG9ydCBlbmZvcmNlIGZvY3VzIGluP1xuLy8gdG9kbzogaW4gb3JpZ2luYWwgYnMgdGhlcmUgYXJlIHdhcyBhIHdheSB0byBwcmV2ZW50IG1vZGFsIGZyb20gc2hvd2luZ1xuLy8gdG9kbzogb3JpZ2luYWwgbW9kYWwgaGFkIHJlc2l6ZSBldmVudHNcblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCxcbiAgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3Q29udGFpbmVyUmVmLCBPcHRpb25hbCwgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBkb2N1bWVudCwgd2luZG93LCBpc0JzMywgVXRpbHMgfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcbmltcG9ydCB7IE1vZGFsQmFja2Ryb3BDb21wb25lbnQgfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBDTEFTU19OQU1FLCBESVNNSVNTX1JFQVNPTlMsIG1vZGFsQ29uZmlnRGVmYXVsdHMsIE1vZGFsT3B0aW9ucywgTU9EQUxfQ09ORklHX0RFRkFVTFRfT1ZFUlJJREVcbn0gZnJvbSAnLi9tb2RhbC1vcHRpb25zLmNsYXNzJztcbmltcG9ydCB7IENvbXBvbmVudExvYWRlciwgQ29tcG9uZW50TG9hZGVyRmFjdG9yeSB9IGZyb20gJ25neC1ib290c3RyYXAvY29tcG9uZW50LWxvYWRlcic7XG5pbXBvcnQgeyBDbG9zZUludGVyY2VwdG9yRm4gfSBmcm9tICcuL21vZGVscyc7XG5cbmNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDA7XG5jb25zdCBCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwO1xuXG4vKiogTWFyayBhbnkgY29kZSB3aXRoIGRpcmVjdGl2ZSB0byBzaG93IGl0J3MgY29udGVudCBpbiBtb2RhbCAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2JzTW9kYWxdJyxcbiAgZXhwb3J0QXM6ICdicy1tb2RhbCdcbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBhbGxvd3MgdG8gc2V0IG1vZGFsIGNvbmZpZ3VyYXRpb24gdmlhIGVsZW1lbnQgcHJvcGVydHkgKi9cbiAgQElucHV0KClcbiAgc2V0IGNvbmZpZyhjb25mOiBNb2RhbE9wdGlvbnMpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmdldENvbmZpZyhjb25mKTtcbiAgfVxuXG4gIGdldCBjb25maWcoKTogTW9kYWxPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgLyoqIGFsbG93cyB0byBwcm92aWRlIGEgY2FsbGJhY2sgdG8gaW50ZXJjZXB0IHRoZSBjbG9zdXJlIG9mIHRoZSBtb2RhbCAqL1xuICBASW5wdXQoKSBjbG9zZUludGVyY2VwdG9yPzogQ2xvc2VJbnRlcmNlcHRvckZuO1xuXG4gIC8qKiBUaGlzIGV2ZW50IGZpcmVzIGltbWVkaWF0ZWx5IHdoZW4gdGhlIGBzaG93YCBpbnN0YW5jZSBtZXRob2QgaXMgY2FsbGVkLiAqL1xuICBAT3V0cHV0KClcbiAgb25TaG93OiBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT4oKTtcbiAgLyoqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgbW9kYWwgaGFzIGJlZW4gbWFkZSB2aXNpYmxlIHRvIHRoZSB1c2VyXG4gICAqICh3aWxsIHdhaXQgZm9yIENTUyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSlcbiAgICovXG4gIEBPdXRwdXQoKVxuICBvblNob3duOiBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT4oKTtcbiAgLyoqIFRoaXMgZXZlbnQgaXMgZmlyZWQgaW1tZWRpYXRlbHkgd2hlblxuICAgKiB0aGUgaGlkZSBpbnN0YW5jZSBtZXRob2QgaGFzIGJlZW4gY2FsbGVkLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG9uSGlkZTogRXZlbnRFbWl0dGVyPE1vZGFsRGlyZWN0aXZlPiA9IG5ldyBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+KCk7XG4gIC8qKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIG1vZGFsIGhhcyBmaW5pc2hlZCBiZWluZ1xuICAgKiBoaWRkZW4gZnJvbSB0aGUgdXNlciAod2lsbCB3YWl0IGZvciBDU1MgdHJhbnNpdGlvbnMgdG8gY29tcGxldGUpLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG9uSGlkZGVuOiBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT4oKTtcblxuICAvKiogVGhpcyBmaWVsZCBjb250YWlucyBsYXN0IGRpc21pc3MgcmVhc29uLlxuICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGBiYWNrZHJvcC1jbGlja2AsIGBlc2NgIGFuZCBgaWQ6IG51bWJlcmBcbiAgICogKGlmIG1vZGFsIHdhcyBjbG9zZWQgYnkgZGlyZWN0IGNhbGwgb2YgYC5oaWRlKClgKS5cbiAgICovXG4gIGRpc21pc3NSZWFzb24/OiBzdHJpbmc7XG5cbiAgZ2V0IGlzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2hvd247XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbmZpZzogTW9kYWxPcHRpb25zO1xuICBwcm90ZWN0ZWQgX2lzU2hvd24gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgaXNCb2R5T3ZlcmZsb3dpbmcgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIG9yaWdpbmFsQm9keVBhZGRpbmcgPSAwO1xuICBwcm90ZWN0ZWQgc2Nyb2xsYmFyV2lkdGggPSAwO1xuXG4gIHByb3RlY3RlZCB0aW1lckhpZGVNb2RhbCA9IDA7XG4gIHByb3RlY3RlZCB0aW1lclJtQmFja0Ryb3AgPSAwO1xuXG4gIC8vIHJlZmVyZW5jZSB0byBiYWNrZHJvcCBjb21wb25lbnRcbiAgcHJvdGVjdGVkIGJhY2tkcm9wPzogQ29tcG9uZW50UmVmPE1vZGFsQmFja2Ryb3BDb21wb25lbnQ+O1xuICBwcml2YXRlIF9iYWNrZHJvcDogQ29tcG9uZW50TG9hZGVyPE1vZGFsQmFja2Ryb3BDb21wb25lbnQ+O1xuXG4gIHByaXZhdGUgaXNOZXN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjbGlja1N0YXJ0ZWRJbkNvbnRlbnQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZm9jdXNFbDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBjbGY6IENvbXBvbmVudExvYWRlckZhY3RvcnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNT0RBTF9DT05GSUdfREVGQVVMVF9PVkVSUklERSkgbW9kYWxEZWZhdWx0T3B0aW9uOiBNb2RhbE9wdGlvbnMpIHtcbiAgICB0aGlzLl9iYWNrZHJvcCA9IGNsZi5jcmVhdGVMb2FkZXI8TW9kYWxCYWNrZHJvcENvbXBvbmVudD4oXG4gICAgICBfZWxlbWVudCxcbiAgICAgIF92aWV3Q29udGFpbmVyUmVmLFxuICAgICAgX3JlbmRlcmVyXG4gICAgKTtcbiAgICB0aGlzLl9jb25maWcgPSBtb2RhbERlZmF1bHRPcHRpb24gfHwgbW9kYWxDb25maWdEZWZhdWx0cztcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2tTdGFydGVkKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jbGlja1N0YXJ0ZWRJbkNvbnRlbnQgPSBldmVudC50YXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbJyRldmVudCddKVxuICBvbkNsaWNrU3RvcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGNsaWNrZWRJbkJhY2tkcm9wID0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiYgIXRoaXMuY2xpY2tTdGFydGVkSW5Db250ZW50O1xuICAgIGlmIChcbiAgICAgIHRoaXMuY29uZmlnLmlnbm9yZUJhY2tkcm9wQ2xpY2sgfHxcbiAgICAgIHRoaXMuY29uZmlnLmJhY2tkcm9wID09PSAnc3RhdGljJyB8fFxuICAgICAgIWNsaWNrZWRJbkJhY2tkcm9wXG4gICAgKSB7XG4gICAgICB0aGlzLmNsaWNrU3RhcnRlZEluQ29udGVudCA9IGZhbHNlO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGlzbWlzc1JlYXNvbiA9IERJU01JU1NfUkVBU09OUy5CQUNLUkRPUDtcbiAgICB0aGlzLmhpZGUoZXZlbnQpO1xuICB9XG5cbiAgLy8gdG9kbzogY29uc2lkZXIgcHJldmVudGluZyBkZWZhdWx0IGFuZCBzdG9wcGluZyBwcm9wYWdhdGlvblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVzYycsIFsnJGV2ZW50J10pXG4gIG9uRXNjKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Nob3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5rZXlib2FyZCkge1xuICAgICAgdGhpcy5kaXNtaXNzUmVhc29uID0gRElTTUlTU19SRUFTT05TLkVTQztcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9pc1Nob3duKSB7XG4gICAgICB0aGlzLl9pc1Nob3duID0gZmFsc2U7XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpO1xuICAgICAgdGhpcy5fYmFja2Ryb3AuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2NvbmZpZyB8fCB0aGlzLmdldENvbmZpZygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5zaG93KSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH0sIDApO1xuICB9XG5cbiAgLyogUHVibGljIG1ldGhvZHMgKi9cblxuICAvKiogQWxsb3dzIHRvIG1hbnVhbGx5IHRvZ2dsZSBtb2RhbCB2aXNpYmlsaXR5ICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5faXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQWxsb3dzIHRvIG1hbnVhbGx5IG9wZW4gbW9kYWwgKi9cbiAgc2hvdygpOiB2b2lkIHtcbiAgICB0aGlzLmRpc21pc3NSZWFzb24gPSB2b2lkIDA7XG4gICAgdGhpcy5vblNob3cuZW1pdCh0aGlzKTtcbiAgICBpZiAodGhpcy5faXNTaG93bikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lckhpZGVNb2RhbCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJSbUJhY2tEcm9wKTtcblxuICAgIHRoaXMuX2lzU2hvd24gPSB0cnVlO1xuXG4gICAgdGhpcy5jaGVja1Njcm9sbGJhcigpO1xuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKCk7XG5cbiAgICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuYm9keSkge1xuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUUuT1BFTikpIHtcbiAgICAgICAgdGhpcy5pc05lc3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhkb2N1bWVudC5ib2R5LCBDTEFTU19OQU1FLk9QRU4pO1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnb3ZlcmZsb3cteScsICdoaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNob3dCYWNrZHJvcCgoKSA9PiB7XG4gICAgICB0aGlzLnNob3dFbGVtZW50KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2hlY2sgaWYgd2UgY2FuIGNsb3NlIHRoZSBtb2RhbCAqL1xuICBoaWRlKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNsb3NlSW50ZXJjZXB0b3IpIHtcbiAgICAgIHRoaXMuY29uZmlnLmNsb3NlSW50ZXJjZXB0b3IoKS50aGVuKFxuICAgICAgICAoKSA9PiB0aGlzLl9oaWRlKCksXG4gICAgICAgICgpID0+IHVuZGVmaW5lZCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9oaWRlKCk7XG4gIH1cblxuICAvKiogUHJpdmF0ZSBtZXRob2RzIEBpbnRlcm5hbCAqL1xuXG4gIC8qKlxuICAgKiAgTWFudWFsbHkgY2xvc2UgbW9kYWxcbiAgICogIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9oaWRlKCk6IHZvaWQge1xuICAgIHRoaXMub25IaWRlLmVtaXQodGhpcyk7XG5cbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZXJIaWRlTW9kYWwpO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lclJtQmFja0Ryb3ApO1xuXG4gICAgdGhpcy5faXNTaG93biA9IGZhbHNlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgQ0xBU1NfTkFNRS5JTik7XG4gICAgaWYgKCFpc0JzMygpKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIENMQVNTX05BTUUuU0hPVyk7XG4gICAgfVxuICAgIC8vIHRoaXMuX2FkZENsYXNzSW4gPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9jb25maWcuYW5pbWF0ZWQpIHtcbiAgICAgIHRoaXMudGltZXJIaWRlTW9kYWwgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgKCkgPT4gdGhpcy5oaWRlTW9kYWwoKSxcbiAgICAgICAgVFJBTlNJVElPTl9EVVJBVElPTlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlTW9kYWwoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZm9jdXNFbCkge1xuICAgICAgKHRoaXMuX2ZvY3VzRWwgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldENvbmZpZyhjb25maWc/OiBNb2RhbE9wdGlvbnMpOiBNb2RhbE9wdGlvbnMge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9jb25maWcsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogIFNob3cgZGlhbG9nXG4gICAqICBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBzaG93RWxlbWVudCgpOiB2b2lkIHtcbiAgICAvLyB0b2RvOiByZXBsYWNlIHRoaXMgd2l0aCBjb21wb25lbnQgbG9hZGVyIHVzYWdlXG4gICAgaWYgKFxuICAgICAgIXRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlIHx8XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREVcbiAgICApIHtcbiAgICAgIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICdhcmlhLWhpZGRlbicsXG4gICAgICAnZmFsc2UnXG4gICAgKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAnYXJpYS1tb2RhbCcsXG4gICAgICAndHJ1ZSdcbiAgICApO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2Rpc3BsYXknLFxuICAgICAgJ2Jsb2NrJ1xuICAgICk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkoXG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAnc2Nyb2xsVG9wJyxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hbmltYXRlZCkge1xuICAgICAgVXRpbHMucmVmbG93KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5fYWRkQ2xhc3NJbiA9IHRydWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBDTEFTU19OQU1FLklOKTtcbiAgICBpZiAoIWlzQnMzKCkpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgQ0xBU1NfTkFNRS5TSE9XKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2l0aW9uQ29tcGxldGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29uZmlnLmZvY3VzKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgICAgdGhpcy5vblNob3duLmVtaXQodGhpcyk7XG4gICAgfTtcblxuICAgIGlmICh0aGlzLl9jb25maWcuYW5pbWF0ZWQpIHtcbiAgICAgIHNldFRpbWVvdXQodHJhbnNpdGlvbkNvbXBsZXRlLCBUUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcm90ZWN0ZWQgaGlkZU1vZGFsKCk6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICdhcmlhLWhpZGRlbicsXG4gICAgICAndHJ1ZSdcbiAgICApO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2Rpc3BsYXknLFxuICAgICAgJ25vbmUnXG4gICAgKTtcbiAgICB0aGlzLnNob3dCYWNrZHJvcCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNOZXN0ZWQpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyhkb2N1bWVudC5ib2R5LCBDTEFTU19OQU1FLk9QRU4pO1xuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGRvY3VtZW50LmJvZHksICdvdmVyZmxvdy15JywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRTY3JvbGxiYXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVzZXRBZGp1c3RtZW50cygpO1xuICAgICAgdGhpcy5mb2N1c090aGVyTW9kYWwoKTtcbiAgICAgIHRoaXMub25IaWRkZW4uZW1pdCh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHRvZG86IG9yaWdpbmFsIHNob3cgd2FzIGNhbGxpbmcgYSBjYWxsYmFjayB3aGVuIGRvbmUsIGJ1dCB3ZSBjYW4gdXNlXG4gIC8vIHByb21pc2VcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcm90ZWN0ZWQgc2hvd0JhY2tkcm9wKGNhbGxiYWNrPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIHRoaXMuX2lzU2hvd24gJiZcbiAgICAgIHRoaXMuY29uZmlnLmJhY2tkcm9wICYmXG4gICAgICAoIXRoaXMuYmFja2Ryb3AgfHwgIXRoaXMuYmFja2Ryb3AuaW5zdGFuY2UuaXNTaG93bilcbiAgICApIHtcbiAgICAgIHRoaXMucmVtb3ZlQmFja2Ryb3AoKTtcbiAgICAgIHRoaXMuX2JhY2tkcm9wXG4gICAgICAgIC5hdHRhY2goTW9kYWxCYWNrZHJvcENvbXBvbmVudClcbiAgICAgICAgLnRvKCdib2R5JylcbiAgICAgICAgLnNob3coeyBpc0FuaW1hdGVkOiB0aGlzLl9jb25maWcuYW5pbWF0ZWQgfSk7XG4gICAgICB0aGlzLmJhY2tkcm9wID0gdGhpcy5fYmFja2Ryb3AuX2NvbXBvbmVudFJlZjtcblxuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmFuaW1hdGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc1Nob3duICYmIHRoaXMuYmFja2Ryb3ApIHtcbiAgICAgIHRoaXMuYmFja2Ryb3AuaW5zdGFuY2UuaXNTaG93biA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBjYWxsYmFja1JlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5iYWNrZHJvcC5pbnN0YW5jZS5pc0FuaW1hdGVkKSB7XG4gICAgICAgIHRoaXMudGltZXJSbUJhY2tEcm9wID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICAgY2FsbGJhY2tSZW1vdmUsXG4gICAgICAgICAgQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIHJlbW92ZUJhY2tkcm9wKCk6IHZvaWQge1xuICAgIHRoaXMuX2JhY2tkcm9wLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBFdmVudHMgdHJpY2tzICovXG5cbiAgLy8gbm8gbmVlZCBmb3IgaXRcbiAgLy8gcHJvdGVjdGVkIHNldEVzY2FwZUV2ZW50KCk6dm9pZCB7XG4gIC8vICAgaWYgKHRoaXMuX2lzU2hvd24gJiYgdGhpcy5fY29uZmlnLmtleWJvYXJkKSB7XG4gIC8vICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LktFWURPV05fRElTTUlTUywgKGV2ZW50KSA9PiB7XG4gIC8vICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMjcpIHtcbiAgLy8gICAgICAgICB0aGlzLmhpZGUoKVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9KVxuICAvL1xuICAvLyAgIH0gZWxzZSBpZiAoIXRoaXMuX2lzU2hvd24pIHtcbiAgLy8gICAgICQodGhpcy5fZWxlbWVudCkub2ZmKEV2ZW50LktFWURPV05fRElTTUlTUylcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBwcm90ZWN0ZWQgc2V0UmVzaXplRXZlbnQoKTp2b2lkIHtcbiAgLy8gY29uc29sZS5sb2codGhpcy5yZW5kZXJlci5saXN0ZW5HbG9iYWwoJycsIEV2ZW50LlJFU0laRSkpO1xuICAvLyBpZiAodGhpcy5faXNTaG93bikge1xuICAvLyAgICQod2luZG93KS5vbihFdmVudC5SRVNJWkUsICQucHJveHkodGhpcy5faGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgLy8gfSBlbHNlIHtcbiAgLy8gICAkKHdpbmRvdykub2ZmKEV2ZW50LlJFU0laRSlcbiAgLy8gfVxuICAvLyB9XG5cbiAgcHJvdGVjdGVkIGZvY3VzT3RoZXJNb2RhbCgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvdGhlck9wZW5lZE1vZGFscyA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbltic01vZGFsXScpO1xuICAgIGlmICghb3RoZXJPcGVuZWRNb2RhbHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG90aGVyT3BlbmVkTW9kYWxzW290aGVyT3BlbmVkTW9kYWxzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCByZXNldEFkanVzdG1lbnRzKCk6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ3BhZGRpbmdMZWZ0JyxcbiAgICAgICcnXG4gICAgKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICdwYWRkaW5nUmlnaHQnLFxuICAgICAgJydcbiAgICApO1xuICB9XG5cbiAgLyoqIFNjcm9sbCBiYXIgdHJpY2tzICovXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIGNoZWNrU2Nyb2xsYmFyKCk6IHZvaWQge1xuICAgIHRoaXMuaXNCb2R5T3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMuZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRTY3JvbGxiYXIoKTogdm9pZCB7XG4gICAgaWYgKCFkb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkZGluZyA9IHBhcnNlSW50KFxuICAgICAgd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCxcbiAgICAgIDEwXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmlzQm9keU92ZXJmbG93aW5nKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3RoaXMub3JpZ2luYWxCb2R5UGFkZGluZyArXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGh9cHhgO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCByZXNldFNjcm9sbGJhcigpOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3RoaXMub3JpZ2luYWxCb2R5UGFkZGluZ31weGA7XG4gIH1cblxuICAvLyB0aHggZC53YWxzaFxuICBwcm90ZWN0ZWQgZ2V0U2Nyb2xsYmFyV2lkdGgoKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JvbGxEaXYgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhzY3JvbGxEaXYsIENMQVNTX05BTUUuU0NST0xMQkFSX01FQVNVUkVSKTtcbiAgICB0aGlzLl9yZW5kZXJlci5hcHBlbmRDaGlsZChkb2N1bWVudC5ib2R5LCBzY3JvbGxEaXYpO1xuICAgIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LmJvZHksIHNjcm9sbERpdik7XG5cbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gIH1cbn1cbiJdfQ==