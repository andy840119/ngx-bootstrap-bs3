import { AnimationBuilder } from '@angular/animations';
import { AfterViewChecked, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CollapseDirective implements AfterViewChecked {
    private _el;
    private _renderer;
    /** This event fires as soon as content collapses */
    collapsed: EventEmitter<CollapseDirective>;
    /** This event fires when collapsing is started */
    collapses: EventEmitter<CollapseDirective>;
    /** This event fires as soon as content becomes visible */
    expanded: EventEmitter<CollapseDirective>;
    /** This event fires when expansion is started */
    expands: EventEmitter<CollapseDirective>;
    isExpanded: boolean;
    collapseNewValue: boolean;
    isCollapsed: boolean;
    isCollapse: boolean;
    isCollapsing: boolean;
    set display(value: string);
    /** turn on/off animation */
    isAnimated: boolean;
    /** A flag indicating visibility of content (shown or hidden) */
    set collapse(value: boolean);
    get collapse(): boolean;
    private _display;
    private _isAnimationDone?;
    private _player?;
    private _stylesLoaded;
    private _COLLAPSE_ACTION_NAME;
    private _EXPAND_ACTION_NAME;
    private readonly _factoryCollapseAnimation;
    private readonly _factoryExpandAnimation;
    constructor(_el: ElementRef, _renderer: Renderer2, _builder: AnimationBuilder);
    ngAfterViewChecked(): void;
    /** allows to manually toggle content visibility */
    toggle(): void;
    /** allows to manually hide content */
    hide(): void;
    /** allows to manually show collapsed content */
    show(): void;
    animationRun(isAnimated: boolean, action: string): (callback: () => void) => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollapseDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CollapseDirective, "[collapse]", ["bs-collapse"], { "display": { "alias": "display"; "required": false; }; "isAnimated": { "alias": "isAnimated"; "required": false; }; "collapse": { "alias": "collapse"; "required": false; }; }, { "collapsed": "collapsed"; "collapses": "collapses"; "expanded": "expanded"; "expands": "expands"; }, never, never, true, never>;
}
