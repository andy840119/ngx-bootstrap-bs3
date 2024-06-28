import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsDropdownConfig } from './bs-dropdown.config';
import { BsDropdownContainerComponent } from './bs-dropdown-container.component';
import { BsDropdownState } from './bs-dropdown.state';
import { isBs3 } from 'ngx-bootstrap/utils';
import { AnimationBuilder } from '@angular/animations';
import { dropdownAnimation } from './dropdown-animations';
import * as i0 from "@angular/core";
import * as i1 from "ngx-bootstrap/component-loader";
import * as i2 from "./bs-dropdown.state";
import * as i3 from "./bs-dropdown.config";
import * as i4 from "@angular/animations";
export class BsDropdownDirective {
    /**
     * Indicates that dropdown will be closed on item or document click,
     * and after pressing ESC
     */
    set autoClose(value) {
        this._state.autoClose = value;
    }
    get autoClose() {
        return this._state.autoClose;
    }
    /**
     * Indicates that dropdown will be animated
     */
    set isAnimated(value) {
        this._state.isAnimated = value;
    }
    get isAnimated() {
        return this._state.isAnimated;
    }
    /**
     * This attribute indicates that the dropdown shouldn't close on inside click when autoClose is set to true
     */
    set insideClick(value) {
        this._state.insideClick = value;
    }
    get insideClick() {
        return this._state.insideClick;
    }
    /**
     * Disables dropdown toggle and hides dropdown menu if opened
     */
    set isDisabled(value) {
        this._isDisabled = value;
        this._state.isDisabledChange.emit(value);
        if (value) {
            this.hide();
        }
    }
    get isDisabled() {
        return this._isDisabled;
    }
    /**
     * Returns whether or not the popover is currently being shown
     */
    get isOpen() {
        if (this._showInline) {
            return this._isInlineOpen;
        }
        return this._dropdown.isShown;
    }
    set isOpen(value) {
        if (value) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    get isBs4() {
        return !isBs3();
    }
    get _showInline() {
        return !this.container;
    }
    constructor(_elementRef, _renderer, _viewContainerRef, _cis, _state, _config, _builder) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._viewContainerRef = _viewContainerRef;
        this._cis = _cis;
        this._state = _state;
        this._config = _config;
        /**
         * This attribute indicates that the dropdown should be opened upwards
         */
        this.dropup = false;
        // todo: move to component loader
        this._isInlineOpen = false;
        this._isDisabled = false;
        this._subscriptions = [];
        this._isInited = false;
        // set initial dropdown state from config
        this._state.autoClose = this._config.autoClose;
        this._state.insideClick = this._config.insideClick;
        this._state.isAnimated = this._config.isAnimated;
        this._state.stopOnClickPropagation = this._config.stopOnClickPropagation;
        this._factoryDropDownAnimation = _builder.build(dropdownAnimation);
        // create dropdown component loader
        this._dropdown = this._cis
            .createLoader(this._elementRef, this._viewContainerRef, this._renderer)
            .provide({ provide: BsDropdownState, useValue: this._state });
        this.onShown = this._dropdown.onShown;
        this.onHidden = this._dropdown.onHidden;
        this.isOpenChange = this._state.isOpenChange;
    }
    ngOnInit() {
        // fix: seems there are an issue with `routerLinkActive`
        // which result in duplicated call ngOnInit without call to ngOnDestroy
        // read more: https://github.com/valor-software/ngx-bootstrap/issues/1885
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        // attach DOM listeners
        this._dropdown.listen({
            // because of dropdown inline mode
            outsideClick: false,
            triggers: this.triggers,
            show: () => this.show()
        });
        // toggle visibility on toggle element click
        this._subscriptions.push(this._state.toggleClick.subscribe((value) => this.toggle(value)));
        // hide dropdown if set disabled while opened
        this._subscriptions.push(this._state.isDisabledChange
            .pipe(filter((value) => value))
            .subscribe(( /*value: boolean*/) => this.hide()));
    }
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show() {
        if (this.isOpen || this.isDisabled) {
            return;
        }
        if (this._showInline) {
            if (!this._inlinedMenu) {
                this._state.dropdownMenu.then((dropdownMenu) => {
                    this._dropdown.attachInline(dropdownMenu.viewContainer, dropdownMenu.templateRef);
                    this._inlinedMenu = this._dropdown._inlineViewRef;
                    this.addBs4Polyfills();
                    if (this._inlinedMenu) {
                        this._renderer.addClass(this._inlinedMenu.rootNodes[0].parentNode, 'open');
                    }
                    this.playAnimation();
                })
                    // swallow errors
                    .catch();
            }
            this.addBs4Polyfills();
            this._isInlineOpen = true;
            this.onShown.emit(true);
            this._state.isOpenChange.emit(true);
            this.playAnimation();
            return;
        }
        this._state.dropdownMenu.then(dropdownMenu => {
            // check direction in which dropdown should be opened
            const _dropup = this.dropup ||
                (typeof this.dropup !== 'undefined' && this.dropup);
            this._state.direction = _dropup ? 'up' : 'down';
            const _placement = this.placement || (_dropup ? 'top start' : 'bottom start');
            // show dropdown
            this._dropdown
                .attach(BsDropdownContainerComponent)
                .to(this.container)
                .position({ attachment: _placement })
                .show({
                content: dropdownMenu.templateRef,
                placement: _placement
            });
            this._state.isOpenChange.emit(true);
        })
            // swallow error
            .catch();
    }
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide() {
        if (!this.isOpen) {
            return;
        }
        if (this._showInline) {
            this.removeShowClass();
            this.removeDropupStyles();
            this._isInlineOpen = false;
            this.onHidden.emit(true);
        }
        else {
            this._dropdown.hide();
        }
        this._state.isOpenChange.emit(false);
    }
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover. With parameter <code>true</code> allows toggling, with parameter <code>false</code>
     * only hides opened dropdown. Parameter usage will be removed in ngx-bootstrap v3
     */
    toggle(value) {
        if (this.isOpen || !value) {
            return this.hide();
        }
        return this.show();
    }
    /** @internal */
    _contains(event) {
        // todo: valorkin fix typings
        return this._elementRef.nativeElement.contains(event.target) ||
            (this._dropdown.instance && this._dropdown.instance._contains(event.target));
    }
    navigationClick(event) {
        const ref = this._elementRef.nativeElement.querySelector('.dropdown-menu');
        if (!ref) {
            return;
        }
        const firstActive = this._elementRef.nativeElement.ownerDocument.activeElement;
        const allRef = ref.querySelectorAll('.dropdown-item');
        switch (event.keyCode) {
            case 38:
                if (this._state.counts > 0) {
                    allRef[--this._state.counts].focus();
                }
                break;
            case 40:
                if (this._state.counts + 1 < allRef.length) {
                    if (firstActive.classList !== allRef[this._state.counts].classList) {
                        allRef[this._state.counts].focus();
                    }
                    else {
                        allRef[++this._state.counts].focus();
                    }
                }
                break;
            default:
        }
        event.preventDefault();
    }
    ngOnDestroy() {
        // clean up subscriptions and destroy dropdown
        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
        this._dropdown.dispose();
    }
    addBs4Polyfills() {
        if (!isBs3()) {
            this.addShowClass();
            this.checkRightAlignment();
            this.addDropupStyles();
        }
    }
    playAnimation() {
        if (this._state.isAnimated && this._inlinedMenu) {
            setTimeout(() => {
                if (this._inlinedMenu) {
                    this._factoryDropDownAnimation.create(this._inlinedMenu.rootNodes[0]).play();
                }
            });
        }
    }
    addShowClass() {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.addClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    }
    removeShowClass() {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.removeClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    }
    checkRightAlignment() {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            const isRightAligned = this._inlinedMenu.rootNodes[0].classList.contains('dropdown-menu-right') || this._inlinedMenu.rootNodes[0].classList.contains('dropdown-menu-end');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'left', isRightAligned ? 'auto' : '0');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'right', isRightAligned ? '0' : 'auto');
        }
    }
    addDropupStyles() {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            // a little hack to not break support of bootstrap 4 beta
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'top', this.dropup ? 'auto' : '100%');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'transform', this.dropup ? 'translateY(-101%)' : 'translateY(0)');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'bottom', 'auto');
        }
    }
    removeDropupStyles() {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.removeStyle(this._inlinedMenu.rootNodes[0], 'top');
            this._renderer.removeStyle(this._inlinedMenu.rootNodes[0], 'transform');
            this._renderer.removeStyle(this._inlinedMenu.rootNodes[0], 'bottom');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: BsDropdownDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ViewContainerRef }, { token: i1.ComponentLoaderFactory }, { token: i2.BsDropdownState }, { token: i3.BsDropdownConfig }, { token: i4.AnimationBuilder }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.4", type: BsDropdownDirective, selector: "[bsDropdown], [dropdown]", inputs: { placement: "placement", triggers: "triggers", container: "container", dropup: "dropup", autoClose: "autoClose", isAnimated: "isAnimated", insideClick: "insideClick", isDisabled: "isDisabled", isOpen: "isOpen" }, outputs: { isOpenChange: "isOpenChange", onShown: "onShown", onHidden: "onHidden" }, host: { listeners: { "keydown.arrowDown": "navigationClick($event)", "keydown.arrowUp": "navigationClick($event)" }, properties: { "class.dropup": "dropup", "class.open": "isOpen", "class.show": "isOpen && isBs4" } }, providers: [BsDropdownState], exportAs: ["bs-dropdown"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: BsDropdownDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[bsDropdown], [dropdown]',
                    exportAs: 'bs-dropdown',
                    providers: [BsDropdownState],
                    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
                    host: {
                        '[class.dropup]': 'dropup',
                        '[class.open]': 'isOpen',
                        '[class.show]': 'isOpen && isBs4'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ViewContainerRef }, { type: i1.ComponentLoaderFactory }, { type: i2.BsDropdownState }, { type: i3.BsDropdownConfig }, { type: i4.AnimationBuilder }]; }, propDecorators: { placement: [{
                type: Input
            }], triggers: [{
                type: Input
            }], container: [{
                type: Input
            }], dropup: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], isAnimated: [{
                type: Input
            }], insideClick: [{
                type: Input
            }], isDisabled: [{
                type: Input
            }], isOpen: [{
                type: Input
            }], isOpenChange: [{
                type: Output
            }], onShown: [{
                type: Output
            }], onHidden: [{
                type: Output
            }], navigationClick: [{
                type: HostListener,
                args: ['keydown.arrowDown', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.arrowUp', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnMtZHJvcGRvd24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Ryb3Bkb3duL2JzLWRyb3Bkb3duLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFFVixZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN4QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFtQixzQkFBc0IsRUFBa0IsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV6RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFdEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7O0FBYTFELE1BQU0sT0FBTyxtQkFBbUI7SUFvQjlCOzs7T0FHRztJQUNILElBQ0ksU0FBUyxDQUFDLEtBQWM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7T0FFRztJQUNILElBQ0ksVUFBVSxDQUFDLEtBQWM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQ0ksV0FBVyxDQUFDLEtBQWM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQ0ksVUFBVSxDQUFDLEtBQWM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFDSSxNQUFNO1FBQ1IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMzQjtRQUVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWM7UUFDdkIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBaUJELElBQUksS0FBSztRQUNQLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBSUQsSUFBWSxXQUFXO1FBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFXRCxZQUNVLFdBQXVCLEVBQ3ZCLFNBQW9CLEVBQ3BCLGlCQUFtQyxFQUNuQyxJQUE0QixFQUM1QixNQUF1QixFQUN2QixPQUF5QixFQUNqQyxRQUEwQjtRQU5sQixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsU0FBSSxHQUFKLElBQUksQ0FBd0I7UUFDNUIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUF0SG5DOztXQUVHO1FBQ00sV0FBTSxHQUFHLEtBQUssQ0FBQztRQW9HeEIsaUNBQWlDO1FBQ3pCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR3RCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLG1CQUFjLEdBQW1CLEVBQUUsQ0FBQztRQUNwQyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBWXhCLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUM7UUFFekUsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVuRSxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSTthQUN2QixZQUFZLENBQ1gsSUFBSSxDQUFDLFdBQVcsRUFDaEIsSUFBSSxDQUFDLGlCQUFpQixFQUN0QixJQUFJLENBQUMsU0FBUyxDQUNmO2FBQ0EsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFFL0MsQ0FBQztJQUVELFFBQVE7UUFDTix3REFBd0Q7UUFDeEQsdUVBQXVFO1FBQ3ZFLHlFQUF5RTtRQUN6RSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3BCLGtDQUFrQztZQUNsQyxZQUFZLEVBQUUsS0FBSztZQUNuQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFjLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDMUUsQ0FBQztRQUVGLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0I7YUFDekIsSUFBSSxDQUNILE1BQU0sQ0FBQyxDQUFDLEtBQWMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQ2xDO2FBQ0EsU0FBUyxDQUFDLEVBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUNsRCxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQyxPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDM0IsQ0FBQyxZQUFxRCxFQUFFLEVBQUU7b0JBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUN6QixZQUFZLENBQUMsYUFBYSxFQUMxQixZQUFZLENBQUMsV0FBVyxDQUN6QixDQUFDO29CQUNGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7b0JBRWxELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO3dCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7cUJBQzVFO29CQUVELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDdkIsQ0FBQyxDQUNGO29CQUNELGlCQUFpQjtxQkFDZCxLQUFLLEVBQUUsQ0FBQzthQUNaO1lBQ0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFckIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzNDLHFEQUFxRDtZQUNyRCxNQUFNLE9BQU8sR0FDWCxJQUFJLENBQUMsTUFBTTtnQkFDWCxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU5RSxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFNBQVM7aUJBQ1gsTUFBTSxDQUFDLDRCQUE0QixDQUFDO2lCQUNwQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDbEIsUUFBUSxDQUFDLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBQyxDQUFDO2lCQUNsQyxJQUFJLENBQUM7Z0JBQ0osT0FBTyxFQUFFLFlBQVksQ0FBQyxXQUFXO2dCQUNqQyxTQUFTLEVBQUUsVUFBVTthQUN0QixDQUFDLENBQUM7WUFFTCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDO1lBQ0YsZ0JBQWdCO2FBQ2IsS0FBSyxFQUFFLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBZTtRQUNwQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEI7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLFNBQVMsQ0FBQyxLQUFpQjtRQUN6Qiw2QkFBNkI7UUFDN0IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMxRCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBZ0MsQ0FBQyxDQUFDLENBQUM7SUFDM0csQ0FBQztJQUlELGVBQWUsQ0FBQyxLQUFVO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixPQUFPO1NBQ1I7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO1FBQy9FLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNyQixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzFCLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3RDO2dCQUNELE1BQU07WUFDUixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsSUFBSSxXQUFXLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRTt3QkFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3BDO3lCQUFNO3dCQUNMLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3RDO2lCQUNGO2dCQUNELE1BQU07WUFDUixRQUFRO1NBQ1Q7UUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7UUFDVCw4Q0FBOEM7UUFDOUMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVPLGVBQWU7UUFDckIsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ1osSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFTyxhQUFhO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMvQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUM5RTtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRU8sWUFBWTtRQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUN0RSxxQkFBcUIsQ0FDdEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNwRCxtQkFBbUIsQ0FDcEIsQ0FBQztZQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFDOUIsTUFBTSxFQUNOLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzlCLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQzlCLE9BQU8sRUFDUCxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUM5QixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkQseURBQXlEO1lBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFDOUIsS0FBSyxFQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUM5QixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUM5QixXQUFXLEVBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FDcEQsQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFDOUIsUUFBUSxFQUNSLE1BQU0sQ0FDUCxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0RTtJQUNILENBQUM7OEdBN1pVLG1CQUFtQjtrR0FBbkIsbUJBQW1CLGdrQkFSbkIsQ0FBQyxlQUFlLENBQUM7OzJGQVFqQixtQkFBbUI7a0JBWC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDNUIscUVBQXFFO29CQUNyRSxJQUFJLEVBQUU7d0JBQ0osZ0JBQWdCLEVBQUUsUUFBUTt3QkFDMUIsY0FBYyxFQUFFLFFBQVE7d0JBQ3hCLGNBQWMsRUFBRSxpQkFBaUI7cUJBQ2xDO2lCQUNGO3lSQUtVLFNBQVM7c0JBQWpCLEtBQUs7Z0JBS0csUUFBUTtzQkFBaEIsS0FBSztnQkFJRyxTQUFTO3NCQUFqQixLQUFLO2dCQUtHLE1BQU07c0JBQWQsS0FBSztnQkFPRixTQUFTO3NCQURaLEtBQUs7Z0JBYUYsVUFBVTtzQkFEYixLQUFLO2dCQWFGLFdBQVc7c0JBRGQsS0FBSztnQkFhRixVQUFVO3NCQURiLEtBQUs7Z0JBaUJGLE1BQU07c0JBRFQsS0FBSztnQkFvQkksWUFBWTtzQkFBckIsTUFBTTtnQkFLRyxPQUFPO3NCQUFoQixNQUFNO2dCQUtHLFFBQVE7c0JBQWpCLE1BQU07Z0JBZ01QLGVBQWU7c0JBRmQsWUFBWTt1QkFBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7c0JBQzVDLFlBQVk7dUJBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDb250YWluZXJSZWZcbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb21wb25lbnRMb2FkZXIsIENvbXBvbmVudExvYWRlckZhY3RvcnksIEJzQ29tcG9uZW50UmVmIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9jb21wb25lbnQtbG9hZGVyJztcblxuaW1wb3J0IHsgQnNEcm9wZG93bkNvbmZpZyB9IGZyb20gJy4vYnMtZHJvcGRvd24uY29uZmlnJztcbmltcG9ydCB7IEJzRHJvcGRvd25Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2JzLWRyb3Bkb3duLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQnNEcm9wZG93blN0YXRlIH0gZnJvbSAnLi9icy1kcm9wZG93bi5zdGF0ZSc7XG5pbXBvcnQgeyBCc0Ryb3Bkb3duTWVudURpcmVjdGl2ZSB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgaXNCczMgfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIsIEFuaW1hdGlvbkZhY3RvcnkgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IGRyb3Bkb3duQW5pbWF0aW9uIH0gZnJvbSAnLi9kcm9wZG93bi1hbmltYXRpb25zJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2JzRHJvcGRvd25dLCBbZHJvcGRvd25dJyxcbiAgZXhwb3J0QXM6ICdicy1kcm9wZG93bicsXG4gIHByb3ZpZGVyczogW0JzRHJvcGRvd25TdGF0ZV0sXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wdXBdJzogJ2Ryb3B1cCcsXG4gICAgJ1tjbGFzcy5vcGVuXSc6ICdpc09wZW4nLFxuICAgICdbY2xhc3Muc2hvd10nOiAnaXNPcGVuICYmIGlzQnM0J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIEJzRHJvcGRvd25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBQbGFjZW1lbnQgb2YgYSBwb3BvdmVyLiBBY2NlcHRzOiBcInRvcFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIiwgXCJyaWdodFwiXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIuIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2ZcbiAgICogZXZlbnQgbmFtZXMuXG4gICAqL1xuICBASW5wdXQoKSB0cmlnZ2Vycz86IHN0cmluZztcbiAgLyoqXG4gICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgcG9wb3ZlciBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAqL1xuICBASW5wdXQoKSBjb250YWluZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgYXR0cmlidXRlIGluZGljYXRlcyB0aGF0IHRoZSBkcm9wZG93biBzaG91bGQgYmUgb3BlbmVkIHVwd2FyZHNcbiAgICovXG4gIEBJbnB1dCgpIGRyb3B1cCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBkcm9wZG93biB3aWxsIGJlIGNsb3NlZCBvbiBpdGVtIG9yIGRvY3VtZW50IGNsaWNrLFxuICAgKiBhbmQgYWZ0ZXIgcHJlc3NpbmcgRVNDXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgYXV0b0Nsb3NlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RhdGUuYXV0b0Nsb3NlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgYXV0b0Nsb3NlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5hdXRvQ2xvc2U7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgZHJvcGRvd24gd2lsbCBiZSBhbmltYXRlZFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGlzQW5pbWF0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdGF0ZS5pc0FuaW1hdGVkID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaXNBbmltYXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUuaXNBbmltYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBpbmRpY2F0ZXMgdGhhdCB0aGUgZHJvcGRvd24gc2hvdWxkbid0IGNsb3NlIG9uIGluc2lkZSBjbGljayB3aGVuIGF1dG9DbG9zZSBpcyBzZXQgdG8gdHJ1ZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGluc2lkZUNsaWNrKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RhdGUuaW5zaWRlQ2xpY2sgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBpbnNpZGVDbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUuaW5zaWRlQ2xpY2s7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgZHJvcGRvd24gdG9nZ2xlIGFuZCBoaWRlcyBkcm9wZG93biBtZW51IGlmIG9wZW5lZFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGlzRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pc0Rpc2FibGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc3RhdGUuaXNEaXNhYmxlZENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IGJlaW5nIHNob3duXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zaG93SW5saW5lKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNJbmxpbmVPcGVuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9kcm9wZG93bi5pc1Nob3duO1xuICB9XG5cbiAgc2V0IGlzT3Blbih2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIGlzT3BlbiBjaGFuZ2VcbiAgICovXG4gIEBPdXRwdXQoKSBpc09wZW5DaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgcG9wb3ZlciBpcyBzaG93blxuICAgKi9cbiAgQE91dHB1dCgpIG9uU2hvd246IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgcG9wb3ZlciBpcyBoaWRkZW5cbiAgICovXG4gIEBPdXRwdXQoKSBvbkhpZGRlbjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xuXG4gIGdldCBpc0JzNCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIWlzQnMzKCk7XG4gIH1cblxuICBwcml2YXRlIF9kcm9wZG93bjogQ29tcG9uZW50TG9hZGVyPEJzRHJvcGRvd25Db250YWluZXJDb21wb25lbnQ+O1xuXG4gIHByaXZhdGUgZ2V0IF9zaG93SW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5jb250YWluZXI7XG4gIH1cblxuICAvLyB0b2RvOiBtb3ZlIHRvIGNvbXBvbmVudCBsb2FkZXJcbiAgcHJpdmF0ZSBfaXNJbmxpbmVPcGVuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfaW5saW5lZE1lbnU/OiBFbWJlZGRlZFZpZXdSZWY8QnNEcm9wZG93bk1lbnVEaXJlY3RpdmU+O1xuICBwcml2YXRlIF9pc0Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX2lzSW5pdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2ZhY3RvcnlEcm9wRG93bkFuaW1hdGlvbjogQW5pbWF0aW9uRmFjdG9yeTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9jaXM6IENvbXBvbmVudExvYWRlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBfc3RhdGU6IEJzRHJvcGRvd25TdGF0ZSxcbiAgICBwcml2YXRlIF9jb25maWc6IEJzRHJvcGRvd25Db25maWcsXG4gICAgX2J1aWxkZXI6IEFuaW1hdGlvbkJ1aWxkZXJcbiAgKSB7XG4gICAgLy8gc2V0IGluaXRpYWwgZHJvcGRvd24gc3RhdGUgZnJvbSBjb25maWdcbiAgICB0aGlzLl9zdGF0ZS5hdXRvQ2xvc2UgPSB0aGlzLl9jb25maWcuYXV0b0Nsb3NlO1xuICAgIHRoaXMuX3N0YXRlLmluc2lkZUNsaWNrID0gdGhpcy5fY29uZmlnLmluc2lkZUNsaWNrO1xuICAgIHRoaXMuX3N0YXRlLmlzQW5pbWF0ZWQgPSB0aGlzLl9jb25maWcuaXNBbmltYXRlZDtcbiAgICB0aGlzLl9zdGF0ZS5zdG9wT25DbGlja1Byb3BhZ2F0aW9uID0gdGhpcy5fY29uZmlnLnN0b3BPbkNsaWNrUHJvcGFnYXRpb247XG5cbiAgICB0aGlzLl9mYWN0b3J5RHJvcERvd25BbmltYXRpb24gPSBfYnVpbGRlci5idWlsZChkcm9wZG93bkFuaW1hdGlvbik7XG5cbiAgICAvLyBjcmVhdGUgZHJvcGRvd24gY29tcG9uZW50IGxvYWRlclxuICAgIHRoaXMuX2Ryb3Bkb3duID0gdGhpcy5fY2lzXG4gICAgICAuY3JlYXRlTG9hZGVyPEJzRHJvcGRvd25Db250YWluZXJDb21wb25lbnQ+KFxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLFxuICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICAgICB0aGlzLl9yZW5kZXJlclxuICAgICAgKVxuICAgICAgLnByb3ZpZGUoe3Byb3ZpZGU6IEJzRHJvcGRvd25TdGF0ZSwgdXNlVmFsdWU6IHRoaXMuX3N0YXRlfSk7XG5cbiAgICB0aGlzLm9uU2hvd24gPSB0aGlzLl9kcm9wZG93bi5vblNob3duO1xuICAgIHRoaXMub25IaWRkZW4gPSB0aGlzLl9kcm9wZG93bi5vbkhpZGRlbjtcbiAgICB0aGlzLmlzT3BlbkNoYW5nZSA9IHRoaXMuX3N0YXRlLmlzT3BlbkNoYW5nZTtcblxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gZml4OiBzZWVtcyB0aGVyZSBhcmUgYW4gaXNzdWUgd2l0aCBgcm91dGVyTGlua0FjdGl2ZWBcbiAgICAvLyB3aGljaCByZXN1bHQgaW4gZHVwbGljYXRlZCBjYWxsIG5nT25Jbml0IHdpdGhvdXQgY2FsbCB0byBuZ09uRGVzdHJveVxuICAgIC8vIHJlYWQgbW9yZTogaHR0cHM6Ly9naXRodWIuY29tL3ZhbG9yLXNvZnR3YXJlL25neC1ib290c3RyYXAvaXNzdWVzLzE4ODVcbiAgICBpZiAodGhpcy5faXNJbml0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faXNJbml0ZWQgPSB0cnVlO1xuXG4gICAgLy8gYXR0YWNoIERPTSBsaXN0ZW5lcnNcbiAgICB0aGlzLl9kcm9wZG93bi5saXN0ZW4oe1xuICAgICAgLy8gYmVjYXVzZSBvZiBkcm9wZG93biBpbmxpbmUgbW9kZVxuICAgICAgb3V0c2lkZUNsaWNrOiBmYWxzZSxcbiAgICAgIHRyaWdnZXJzOiB0aGlzLnRyaWdnZXJzLFxuICAgICAgc2hvdzogKCkgPT4gdGhpcy5zaG93KClcbiAgICB9KTtcblxuICAgIC8vIHRvZ2dsZSB2aXNpYmlsaXR5IG9uIHRvZ2dsZSBlbGVtZW50IGNsaWNrXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5fc3RhdGUudG9nZ2xlQ2xpY2suc3Vic2NyaWJlKCh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy50b2dnbGUodmFsdWUpKVxuICAgICk7XG5cbiAgICAvLyBoaWRlIGRyb3Bkb3duIGlmIHNldCBkaXNhYmxlZCB3aGlsZSBvcGVuZWRcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLl9zdGF0ZS5pc0Rpc2FibGVkQ2hhbmdlXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIGZpbHRlcigodmFsdWU6IGJvb2xlYW4pID0+IHZhbHVlKVxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoKC8qdmFsdWU6IGJvb2xlYW4qLykgPT4gdGhpcy5oaWRlKCkpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhbiBlbGVtZW504oCZcyBwb3BvdmVyLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDigJxtYW51YWzigJ0gdHJpZ2dlcmluZyBvZlxuICAgKiB0aGUgcG9wb3Zlci5cbiAgICovXG4gIHNob3coKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNPcGVuIHx8IHRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zaG93SW5saW5lKSB7XG4gICAgICBpZiAoIXRoaXMuX2lubGluZWRNZW51KSB7XG4gICAgICAgIHRoaXMuX3N0YXRlLmRyb3Bkb3duTWVudS50aGVuKFxuICAgICAgICAgIChkcm9wZG93bk1lbnU6IEJzQ29tcG9uZW50UmVmPEJzRHJvcGRvd25NZW51RGlyZWN0aXZlPikgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZHJvcGRvd24uYXR0YWNoSW5saW5lKFxuICAgICAgICAgICAgICBkcm9wZG93bk1lbnUudmlld0NvbnRhaW5lcixcbiAgICAgICAgICAgICAgZHJvcGRvd25NZW51LnRlbXBsYXRlUmVmXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5faW5saW5lZE1lbnUgPSB0aGlzLl9kcm9wZG93bi5faW5saW5lVmlld1JlZjtcblxuICAgICAgICAgICAgdGhpcy5hZGRCczRQb2x5ZmlsbHMoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbmxpbmVkTWVudSkge1xuICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9pbmxpbmVkTWVudS5yb290Tm9kZXNbMF0ucGFyZW50Tm9kZSwgJ29wZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIC8vIHN3YWxsb3cgZXJyb3JzXG4gICAgICAgICAgLmNhdGNoKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmFkZEJzNFBvbHlmaWxscygpO1xuXG4gICAgICB0aGlzLl9pc0lubGluZU9wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5vblNob3duLmVtaXQodHJ1ZSk7XG4gICAgICB0aGlzLl9zdGF0ZS5pc09wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcblxuICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc3RhdGUuZHJvcGRvd25NZW51LnRoZW4oZHJvcGRvd25NZW51ID0+IHtcbiAgICAgIC8vIGNoZWNrIGRpcmVjdGlvbiBpbiB3aGljaCBkcm9wZG93biBzaG91bGQgYmUgb3BlbmVkXG4gICAgICBjb25zdCBfZHJvcHVwID1cbiAgICAgICAgdGhpcy5kcm9wdXAgfHxcbiAgICAgICAgKHR5cGVvZiB0aGlzLmRyb3B1cCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5kcm9wdXApO1xuICAgICAgdGhpcy5fc3RhdGUuZGlyZWN0aW9uID0gX2Ryb3B1cCA/ICd1cCcgOiAnZG93bic7XG4gICAgICBjb25zdCBfcGxhY2VtZW50ID0gdGhpcy5wbGFjZW1lbnQgfHwgKF9kcm9wdXAgPyAndG9wIHN0YXJ0JyA6ICdib3R0b20gc3RhcnQnKTtcblxuICAgICAgLy8gc2hvdyBkcm9wZG93blxuICAgICAgdGhpcy5fZHJvcGRvd25cbiAgICAgICAgLmF0dGFjaChCc0Ryb3Bkb3duQ29udGFpbmVyQ29tcG9uZW50KVxuICAgICAgICAudG8odGhpcy5jb250YWluZXIpXG4gICAgICAgIC5wb3NpdGlvbih7YXR0YWNobWVudDogX3BsYWNlbWVudH0pXG4gICAgICAgIC5zaG93KHtcbiAgICAgICAgICBjb250ZW50OiBkcm9wZG93bk1lbnUudGVtcGxhdGVSZWYsXG4gICAgICAgICAgcGxhY2VtZW50OiBfcGxhY2VtZW50XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9zdGF0ZS5pc09wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICB9KVxuICAgIC8vIHN3YWxsb3cgZXJyb3JcbiAgICAgIC5jYXRjaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbiBlbGVtZW504oCZcyBwb3BvdmVyLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDigJxtYW51YWzigJ0gdHJpZ2dlcmluZyBvZlxuICAgKiB0aGUgcG9wb3Zlci5cbiAgICovXG4gIGhpZGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zaG93SW5saW5lKSB7XG4gICAgICB0aGlzLnJlbW92ZVNob3dDbGFzcygpO1xuICAgICAgdGhpcy5yZW1vdmVEcm9wdXBTdHlsZXMoKTtcbiAgICAgIHRoaXMuX2lzSW5saW5lT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5vbkhpZGRlbi5lbWl0KHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kcm9wZG93bi5oaWRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhdGUuaXNPcGVuQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYW4gZWxlbWVudOKAmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICogdGhlIHBvcG92ZXIuIFdpdGggcGFyYW1ldGVyIDxjb2RlPnRydWU8L2NvZGU+IGFsbG93cyB0b2dnbGluZywgd2l0aCBwYXJhbWV0ZXIgPGNvZGU+ZmFsc2U8L2NvZGU+XG4gICAqIG9ubHkgaGlkZXMgb3BlbmVkIGRyb3Bkb3duLiBQYXJhbWV0ZXIgdXNhZ2Ugd2lsbCBiZSByZW1vdmVkIGluIG5neC1ib290c3RyYXAgdjNcbiAgICovXG4gIHRvZ2dsZSh2YWx1ZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc09wZW4gfHwgIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udGFpbnMoZXZlbnQ6IE1vdXNlRXZlbnQpOiBib29sZWFuIHtcbiAgICAvLyB0b2RvOiB2YWxvcmtpbiBmaXggdHlwaW5nc1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSB8fFxuICAgICAgKHRoaXMuX2Ryb3Bkb3duLmluc3RhbmNlICYmIHRoaXMuX2Ryb3Bkb3duLmluc3RhbmNlLl9jb250YWlucyhldmVudC50YXJnZXQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudCkpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd0Rvd24nLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93VXAnLCBbJyRldmVudCddKVxuICBuYXZpZ2F0aW9uQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHJlZiA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpO1xuXG4gICAgaWYgKCFyZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdEFjdGl2ZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgYWxsUmVmID0gcmVmLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1pdGVtJyk7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIDM4OlxuICAgICAgICBpZiAodGhpcy5fc3RhdGUuY291bnRzID4gMCkge1xuICAgICAgICAgIGFsbFJlZlstLXRoaXMuX3N0YXRlLmNvdW50c10uZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDA6XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZS5jb3VudHMgKyAxIDwgYWxsUmVmLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChmaXJzdEFjdGl2ZS5jbGFzc0xpc3QgIT09IGFsbFJlZlt0aGlzLl9zdGF0ZS5jb3VudHNdLmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgYWxsUmVmW3RoaXMuX3N0YXRlLmNvdW50c10uZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxsUmVmWysrdGhpcy5fc3RhdGUuY291bnRzXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAvLyBjbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBkZXN0cm95IGRyb3Bkb3duXG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuX2Ryb3Bkb3duLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQnM0UG9seWZpbGxzKCk6IHZvaWQge1xuICAgIGlmICghaXNCczMoKSkge1xuICAgICAgdGhpcy5hZGRTaG93Q2xhc3MoKTtcbiAgICAgIHRoaXMuY2hlY2tSaWdodEFsaWdubWVudCgpO1xuICAgICAgdGhpcy5hZGREcm9wdXBTdHlsZXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBsYXlBbmltYXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3N0YXRlLmlzQW5pbWF0ZWQgJiYgdGhpcy5faW5saW5lZE1lbnUpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faW5saW5lZE1lbnUpIHtcbiAgICAgICAgICB0aGlzLl9mYWN0b3J5RHJvcERvd25BbmltYXRpb24uY3JlYXRlKHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSkucGxheSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFNob3dDbGFzcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faW5saW5lZE1lbnUgJiYgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9pbmxpbmVkTWVudS5yb290Tm9kZXNbMF0sICdzaG93Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVTaG93Q2xhc3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lubGluZWRNZW51ICYmIHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdLCAnc2hvdycpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tSaWdodEFsaWdubWVudCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faW5saW5lZE1lbnUgJiYgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdKSB7XG4gICAgICBjb25zdCBpc1JpZ2h0QWxpZ25lZCA9IHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXS5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICdkcm9wZG93bi1tZW51LXJpZ2h0J1xuICAgICAgKSB8fCB0aGlzLl9pbmxpbmVkTWVudS5yb290Tm9kZXNbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAnZHJvcGRvd24tbWVudS1lbmQnXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdLFxuICAgICAgICAnbGVmdCcsXG4gICAgICAgIGlzUmlnaHRBbGlnbmVkID8gJ2F1dG8nIDogJzAnXG4gICAgICApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgIHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSxcbiAgICAgICAgJ3JpZ2h0JyxcbiAgICAgICAgaXNSaWdodEFsaWduZWQgPyAnMCcgOiAnYXV0bydcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGREcm9wdXBTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2lubGluZWRNZW51ICYmIHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSkge1xuICAgICAgLy8gYSBsaXR0bGUgaGFjayB0byBub3QgYnJlYWsgc3VwcG9ydCBvZiBib290c3RyYXAgNCBiZXRhXG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdLFxuICAgICAgICAndG9wJyxcbiAgICAgICAgdGhpcy5kcm9wdXAgPyAnYXV0bycgOiAnMTAwJSdcbiAgICAgICk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdLFxuICAgICAgICAndHJhbnNmb3JtJyxcbiAgICAgICAgdGhpcy5kcm9wdXAgPyAndHJhbnNsYXRlWSgtMTAxJSknIDogJ3RyYW5zbGF0ZVkoMCknXG4gICAgICApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgIHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSxcbiAgICAgICAgJ2JvdHRvbScsXG4gICAgICAgICdhdXRvJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZURyb3B1cFN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faW5saW5lZE1lbnUgJiYgdGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLl9pbmxpbmVkTWVudS5yb290Tm9kZXNbMF0sICd0b3AnKTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuX2lubGluZWRNZW51LnJvb3ROb2Rlc1swXSwgJ3RyYW5zZm9ybScpO1xuICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5faW5saW5lZE1lbnUucm9vdE5vZGVzWzBdLCAnYm90dG9tJyk7XG4gICAgfVxuICB9XG59XG4iXX0=