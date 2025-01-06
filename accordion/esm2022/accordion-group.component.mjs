import { Component, HostBinding, Inject, Input, Output, EventEmitter } from '@angular/core';
import { isBs3 } from 'ngx-bootstrap/utils';
import { AccordionComponent } from './accordion.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgClass, NgIf } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "ngx-bootstrap/collapse";
import * as i2 from "./accordion.component";
/**
 * ### Accordion heading
 * Instead of using `heading` attribute on the `accordion-group`, you can use
 * an `accordion-heading` attribute on `any` element inside of a group that
 * will be used as group's header template.
 */
export class AccordionPanelComponent {
    // Questionable, maybe .panel-open should be on child div.panel element?
    /** Is accordion group open or closed. This property supports two-way binding */
    get isOpen() {
        return this._isOpen;
    }
    set isOpen(value) {
        if (value !== this.isOpen) {
            if (value) {
                this.accordion.closeOtherPanels(this);
            }
            this._isOpen = value;
            Promise.resolve(null)
                .then(() => {
                this.isOpenChange.emit(value);
            });
        }
    }
    get isBs3() {
        return isBs3();
    }
    constructor(accordion) {
        /** turn on/off animation */
        this.isAnimated = false;
        /** Provides an ability to use Bootstrap's contextual panel classes
         * (`panel-primary`, `panel-success`, `panel-info`, etc...).
         * List of all available classes [available here]
         * (https://getbootstrap.com/docs/3.3/components/#panels-alternatives)
         */
        this.panelClass = 'panel-default';
        /** if <code>true</code> — disables accordion group */
        this.isDisabled = false;
        /** Emits when the opened state changes */
        this.isOpenChange = new EventEmitter();
        this._isOpen = false;
        this.accordion = accordion;
    }
    ngOnInit() {
        this.accordion.addGroup(this);
    }
    ngOnDestroy() {
        this.accordion.removeGroup(this);
    }
    toggleOpen() {
        if (!this.isDisabled) {
            this.isOpen = !this.isOpen;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: AccordionPanelComponent, deps: [{ token: AccordionComponent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: AccordionPanelComponent, isStandalone: true, selector: "accordion-group, accordion-panel", inputs: { heading: "heading", panelClass: "panelClass", isDisabled: "isDisabled", isOpen: "isOpen" }, outputs: { isOpenChange: "isOpenChange" }, host: { properties: { "class.panel-open": "this.isOpen" }, styleAttribute: "display: block", classAttribute: "panel" }, ngImport: i0, template: "<div class=\"panel card\" [ngClass]=\"panelClass\">\n  <div\n    class=\"panel-heading card-header\"\n    role=\"tab\"\n    (click)=\"toggleOpen()\"\n    [ngClass]=\"isDisabled ? 'panel-disabled' : 'panel-enabled'\"\n  >\n    <div class=\"panel-title\">\n      <div role=\"button\" class=\"accordion-toggle\" [attr.aria-expanded]=\"isOpen\">\n        <button class=\"btn btn-link\" *ngIf=\"heading\" [ngClass]=\"{ 'text-muted': isDisabled }\" type=\"button\">\n          {{ heading }}\n        </button>\n        <ng-content select=\"[accordion-heading]\"></ng-content>\n      </div>\n    </div>\n  </div>\n  <div class=\"panel-collapse collapse\" role=\"tabpanel\" [collapse]=\"!isOpen\" [isAnimated]=\"isAnimated\">\n    <div class=\"panel-body card-block card-body\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [":host .card-header.panel-enabled{cursor:pointer}:host .card-header.panel-disabled .btn.btn-link{cursor:default;text-decoration:none}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: CollapseModule }, { kind: "directive", type: i1.CollapseDirective, selector: "[collapse]", inputs: ["display", "isAnimated", "collapse"], outputs: ["collapsed", "collapses", "expanded", "expands"], exportAs: ["bs-collapse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: AccordionPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'accordion-group, accordion-panel', host: {
                        class: 'panel',
                        style: 'display: block'
                    }, standalone: true, imports: [NgClass, NgIf, CollapseModule], template: "<div class=\"panel card\" [ngClass]=\"panelClass\">\n  <div\n    class=\"panel-heading card-header\"\n    role=\"tab\"\n    (click)=\"toggleOpen()\"\n    [ngClass]=\"isDisabled ? 'panel-disabled' : 'panel-enabled'\"\n  >\n    <div class=\"panel-title\">\n      <div role=\"button\" class=\"accordion-toggle\" [attr.aria-expanded]=\"isOpen\">\n        <button class=\"btn btn-link\" *ngIf=\"heading\" [ngClass]=\"{ 'text-muted': isDisabled }\" type=\"button\">\n          {{ heading }}\n        </button>\n        <ng-content select=\"[accordion-heading]\"></ng-content>\n      </div>\n    </div>\n  </div>\n  <div class=\"panel-collapse collapse\" role=\"tabpanel\" [collapse]=\"!isOpen\" [isAnimated]=\"isAnimated\">\n    <div class=\"panel-body card-block card-body\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [":host .card-header.panel-enabled{cursor:pointer}:host .card-header.panel-disabled .btn.btn-link{cursor:default;text-decoration:none}\n"] }]
        }], ctorParameters: () => [{ type: i2.AccordionComponent, decorators: [{
                    type: Inject,
                    args: [AccordionComponent]
                }] }], propDecorators: { heading: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], isDisabled: [{
                type: Input
            }], isOpenChange: [{
                type: Output
            }], isOpen: [{
                type: HostBinding,
                args: ['class.panel-open']
            }, {
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLWdyb3VwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLWdyb3VwLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxZQUFZLEVBQy9FLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUVoRDs7Ozs7R0FLRztBQWFILE1BQU0sT0FBTyx1QkFBdUI7SUFnQmxDLHdFQUF3RTtJQUN4RSxnRkFBZ0Y7SUFDaEYsSUFFSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFjO1FBQ3ZCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMxQixJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2lCQUNwQixJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFLRCxZQUF3QyxTQUE2QjtRQTNDckUsNEJBQTRCO1FBQzVCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHbkI7Ozs7V0FJRztRQUNNLGVBQVUsR0FBRyxlQUFlLENBQUM7UUFDdEMsc0RBQXNEO1FBQzdDLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDNUIsMENBQTBDO1FBQ2hDLGlCQUFZLEdBQTBCLElBQUksWUFBWSxFQUFFLENBQUM7UUEyQnpELFlBQU8sR0FBRyxLQUFLLENBQUM7UUFJeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixDQUFDO0lBQ0gsQ0FBQzs4R0E1RFUsdUJBQXVCLGtCQTRDZCxrQkFBa0I7a0dBNUMzQix1QkFBdUIscVdDMUJwQyxxMEJBc0JBLGdNREVjLE9BQU8sb0ZBQUUsSUFBSSw0RkFBRSxjQUFjOzsyRkFFOUIsdUJBQXVCO2tCQVpuQyxTQUFTOytCQUNJLGtDQUFrQyxRQUd0Qzt3QkFDRixLQUFLLEVBQUUsT0FBTzt3QkFDZCxLQUFLLEVBQUUsZ0JBQWdCO3FCQUMxQixjQUVXLElBQUksV0FDUCxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDOzswQkE4QzdCLE1BQU07MkJBQUMsa0JBQWtCO3lDQXhDN0IsT0FBTztzQkFBZixLQUFLO2dCQU1HLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFSSxZQUFZO3NCQUFyQixNQUFNO2dCQU1ILE1BQU07c0JBRlQsV0FBVzt1QkFBQyxrQkFBa0I7O3NCQUM5QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBIb3N0QmluZGluZywgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNCczMgfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcbmltcG9ydCB7IEFjY29yZGlvbkNvbXBvbmVudCB9IGZyb20gJy4vYWNjb3JkaW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb2xsYXBzZU1vZHVsZSB9IGZyb20gJ25neC1ib290c3RyYXAvY29sbGFwc2UnO1xuaW1wb3J0IHsgTmdDbGFzcywgTmdJZiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogIyMjIEFjY29yZGlvbiBoZWFkaW5nXG4gKiBJbnN0ZWFkIG9mIHVzaW5nIGBoZWFkaW5nYCBhdHRyaWJ1dGUgb24gdGhlIGBhY2NvcmRpb24tZ3JvdXBgLCB5b3UgY2FuIHVzZVxuICogYW4gYGFjY29yZGlvbi1oZWFkaW5nYCBhdHRyaWJ1dGUgb24gYGFueWAgZWxlbWVudCBpbnNpZGUgb2YgYSBncm91cCB0aGF0XG4gKiB3aWxsIGJlIHVzZWQgYXMgZ3JvdXAncyBoZWFkZXIgdGVtcGxhdGUuXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWNjb3JkaW9uLWdyb3VwLCBhY2NvcmRpb24tcGFuZWwnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hY2NvcmRpb24tZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwYW5lbCcsXG4gICAgICAgIHN0eWxlOiAnZGlzcGxheTogYmxvY2snXG4gICAgfSxcbiAgICBzdHlsZVVybHM6IFsnLi9hY2NvcmRpb24uc2NzcyddLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG4gICAgaW1wb3J0czogW05nQ2xhc3MsIE5nSWYsIENvbGxhcHNlTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb25QYW5lbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIHR1cm4gb24vb2ZmIGFuaW1hdGlvbiAqL1xuICBpc0FuaW1hdGVkID0gZmFsc2U7XG4gIC8qKiBDbGlja2FibGUgdGV4dCBpbiBhY2NvcmRpb24ncyBncm91cCBoZWFkZXIsIGNoZWNrIGBhY2NvcmRpb24gaGVhZGluZ2AgYmVsb3cgZm9yIHVzaW5nIGh0bWwgaW4gaGVhZGVyICovXG4gIEBJbnB1dCgpIGhlYWRpbmchOiBzdHJpbmc7XG4gIC8qKiBQcm92aWRlcyBhbiBhYmlsaXR5IHRvIHVzZSBCb290c3RyYXAncyBjb250ZXh0dWFsIHBhbmVsIGNsYXNzZXNcbiAgICogKGBwYW5lbC1wcmltYXJ5YCwgYHBhbmVsLXN1Y2Nlc3NgLCBgcGFuZWwtaW5mb2AsIGV0Yy4uLikuXG4gICAqIExpc3Qgb2YgYWxsIGF2YWlsYWJsZSBjbGFzc2VzIFthdmFpbGFibGUgaGVyZV1cbiAgICogKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuMy9jb21wb25lbnRzLyNwYW5lbHMtYWx0ZXJuYXRpdmVzKVxuICAgKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzcyA9ICdwYW5lbC1kZWZhdWx0JztcbiAgLyoqIGlmIDxjb2RlPnRydWU8L2NvZGU+IOKAlCBkaXNhYmxlcyBhY2NvcmRpb24gZ3JvdXAgKi9cbiAgQElucHV0KCkgaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAvKiogRW1pdHMgd2hlbiB0aGUgb3BlbmVkIHN0YXRlIGNoYW5nZXMgKi9cbiAgQE91dHB1dCgpIGlzT3BlbkNoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8vIFF1ZXN0aW9uYWJsZSwgbWF5YmUgLnBhbmVsLW9wZW4gc2hvdWxkIGJlIG9uIGNoaWxkIGRpdi5wYW5lbCBlbGVtZW50P1xuICAvKiogSXMgYWNjb3JkaW9uIGdyb3VwIG9wZW4gb3IgY2xvc2VkLiBUaGlzIHByb3BlcnR5IHN1cHBvcnRzIHR3by13YXkgYmluZGluZyAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBhbmVsLW9wZW4nKVxuICBASW5wdXQoKVxuICBnZXQgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc09wZW47XG4gIH1cblxuICBzZXQgaXNPcGVuKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlzT3Blbikge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uLmNsb3NlT3RoZXJQYW5lbHModGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9pc09wZW4gPSB2YWx1ZTtcbiAgICAgIFByb21pc2UucmVzb2x2ZShudWxsKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmlzT3BlbkNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0JzMygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNCczMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaXNPcGVuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBhY2NvcmRpb246IEFjY29yZGlvbkNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEFjY29yZGlvbkNvbXBvbmVudCkgYWNjb3JkaW9uOiBBY2NvcmRpb25Db21wb25lbnQpIHtcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbjtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYWNjb3JkaW9uLmFkZEdyb3VwKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5hY2NvcmRpb24ucmVtb3ZlR3JvdXAodGhpcyk7XG4gIH1cblxuICB0b2dnbGVPcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3BlbjtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJwYW5lbCBjYXJkXCIgW25nQ2xhc3NdPVwicGFuZWxDbGFzc1wiPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJwYW5lbC1oZWFkaW5nIGNhcmQtaGVhZGVyXCJcbiAgICByb2xlPVwidGFiXCJcbiAgICAoY2xpY2spPVwidG9nZ2xlT3BlbigpXCJcbiAgICBbbmdDbGFzc109XCJpc0Rpc2FibGVkID8gJ3BhbmVsLWRpc2FibGVkJyA6ICdwYW5lbC1lbmFibGVkJ1wiXG4gID5cbiAgICA8ZGl2IGNsYXNzPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgIDxkaXYgcm9sZT1cImJ1dHRvblwiIGNsYXNzPVwiYWNjb3JkaW9uLXRvZ2dsZVwiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXNPcGVuXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxpbmtcIiAqbmdJZj1cImhlYWRpbmdcIiBbbmdDbGFzc109XCJ7ICd0ZXh0LW11dGVkJzogaXNEaXNhYmxlZCB9XCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIHt7IGhlYWRpbmcgfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIlthY2NvcmRpb24taGVhZGluZ11cIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZVwiIHJvbGU9XCJ0YWJwYW5lbFwiIFtjb2xsYXBzZV09XCIhaXNPcGVuXCIgW2lzQW5pbWF0ZWRdPVwiaXNBbmltYXRlZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5IGNhcmQtYmxvY2sgY2FyZC1ib2R5XCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=