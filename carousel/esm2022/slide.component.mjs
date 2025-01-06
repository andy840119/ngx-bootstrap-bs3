import { Component, HostBinding, Input } from '@angular/core';
import { CarouselComponent } from './carousel.component';
import * as i0 from "@angular/core";
import * as i1 from "./carousel.component";
export class SlideComponent {
    constructor(carousel) {
        /** Is current slide active */
        this.active = false;
        this.itemWidth = '100%';
        this.order = 0;
        this.isAnimated = false;
        /** Wraps element by appropriate CSS classes */
        this.addClass = true;
        this.multilist = false;
        this.carousel = carousel;
    }
    /** Fires changes in container collection after adding a new slide instance */
    ngOnInit() {
        this.carousel.addSlide(this);
        this.itemWidth = `${100 / this.carousel.itemsPerSlide}%`;
        this.multilist = this.carousel?.itemsPerSlide > 1;
    }
    /** Fires changes in container collection after removing of this slide instance */
    ngOnDestroy() {
        this.carousel.removeSlide(this);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SlideComponent, deps: [{ token: i1.CarouselComponent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: SlideComponent, isStandalone: true, selector: "slide", inputs: { active: "active" }, host: { properties: { "attr.aria-hidden": "!active", "class.multilist-margin": "multilist", "class.active": "this.active", "style.width": "this.itemWidth", "style.order": "this.order", "class.carousel-animation": "this.isAnimated", "class.item": "this.addClass", "class.carousel-item": "this.addClass" } }, ngImport: i0, template: `
    <div [class.active]="active" class="item">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [":host.carousel-animation{transition:opacity .6s ease,visibility .6s ease;float:left}:host.carousel-animation.active{opacity:1;visibility:visible}:host.carousel-animation:not(.active){display:block;position:absolute;opacity:0;visibility:hidden}:host.multilist-margin{margin-right:auto}:host.carousel-item{perspective:1000px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SlideComponent, decorators: [{
            type: Component,
            args: [{ selector: 'slide', template: `
    <div [class.active]="active" class="item">
      <ng-content></ng-content>
    </div>
  `, host: {
                        '[attr.aria-hidden]': '!active',
                        '[class.multilist-margin]': 'multilist'
                    }, standalone: true, styles: [":host.carousel-animation{transition:opacity .6s ease,visibility .6s ease;float:left}:host.carousel-animation.active{opacity:1;visibility:visible}:host.carousel-animation:not(.active){display:block;position:absolute;opacity:0;visibility:hidden}:host.multilist-margin{margin-right:auto}:host.carousel-item{perspective:1000px}\n"] }]
        }], ctorParameters: () => [{ type: i1.CarouselComponent }], propDecorators: { active: [{
                type: HostBinding,
                args: ['class.active']
            }, {
                type: Input
            }], itemWidth: [{
                type: HostBinding,
                args: ['style.width']
            }], order: [{
                type: HostBinding,
                args: ['style.order']
            }], isAnimated: [{
                type: HostBinding,
                args: ['class.carousel-animation']
            }], addClass: [{
                type: HostBinding,
                args: ['class.item']
            }, {
                type: HostBinding,
                args: ['class.carousel-item']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Nhcm91c2VsL3NsaWRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFFWCxLQUFLLEVBRU4sTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQXNDekQsTUFBTSxPQUFPLGNBQWM7SUFrQnpCLFlBQVksUUFBMkI7UUFqQnZDLDhCQUE4QjtRQUc5QixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRWEsY0FBUyxHQUFHLE1BQU0sQ0FBQztRQUNuQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ0csZUFBVSxHQUFHLEtBQUssQ0FBQztRQUU1RCwrQ0FBK0M7UUFHL0MsYUFBUSxHQUFHLElBQUksQ0FBQztRQUloQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWhCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQztRQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsa0ZBQWtGO0lBQ2xGLFdBQVc7UUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzhHQWhDVSxjQUFjO2tHQUFkLGNBQWMsa1pBbENiOzs7O0dBSVg7OzJGQThCVSxjQUFjO2tCQXBDMUIsU0FBUzsrQkFDSSxPQUFPLFlBQ1A7Ozs7R0FJWCxRQUVPO3dCQUNGLG9CQUFvQixFQUFFLFNBQVM7d0JBQy9CLDBCQUEwQixFQUFFLFdBQVc7cUJBQzFDLGNBdUJXLElBQUk7c0ZBTWxCLE1BQU07c0JBRkwsV0FBVzt1QkFBQyxjQUFjOztzQkFDMUIsS0FBSztnQkFHc0IsU0FBUztzQkFBcEMsV0FBVzt1QkFBQyxhQUFhO2dCQUNFLEtBQUs7c0JBQWhDLFdBQVc7dUJBQUMsYUFBYTtnQkFDZSxVQUFVO3NCQUFsRCxXQUFXO3VCQUFDLDBCQUEwQjtnQkFLdkMsUUFBUTtzQkFGUCxXQUFXO3VCQUFDLFlBQVk7O3NCQUN4QixXQUFXO3VCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgSW5wdXQsXG4gIE9uSW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2Fyb3VzZWxDb21wb25lbnQgfSBmcm9tICcuL2Nhcm91c2VsLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2xpZGUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBbY2xhc3MuYWN0aXZlXT1cImFjdGl2ZVwiIGNsYXNzPVwiaXRlbVwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1thdHRyLmFyaWEtaGlkZGVuXSc6ICchYWN0aXZlJyxcbiAgICAgICAgJ1tjbGFzcy5tdWx0aWxpc3QtbWFyZ2luXSc6ICdtdWx0aWxpc3QnXG4gICAgfSxcbiAgICBzdHlsZXM6IFtgXG4gICAgOmhvc3QuY2Fyb3VzZWwtYW5pbWF0aW9uIHtcbiAgICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNnMgZWFzZSwgdmlzaWJpbGl0eSAwLjZzIGVhc2U7XG4gICAgICAgZmxvYXQ6IGxlZnQ7XG4gICAgfVxuICAgIDpob3N0LmNhcm91c2VsLWFuaW1hdGlvbi5hY3RpdmUge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgfVxuICAgIDpob3N0LmNhcm91c2VsLWFuaW1hdGlvbjpub3QoLmFjdGl2ZSkge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBvcGFjaXR5OiAwO1xuICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIH1cbiAgICA6aG9zdC5tdWx0aWxpc3QtbWFyZ2luIHtcbiAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICB9XG4gICAgOmhvc3QuY2Fyb3VzZWwtaXRlbSB7XG4gICAgICBwZXJzcGVjdGl2ZTogMTAwMHB4O1xuICAgIH1cbiAgYF0sXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBTbGlkZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIElzIGN1cnJlbnQgc2xpZGUgYWN0aXZlICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MuYWN0aXZlJylcbiAgQElucHV0KClcbiAgYWN0aXZlID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIGl0ZW1XaWR0aCA9ICcxMDAlJztcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5vcmRlcicpIG9yZGVyID0gMDtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5jYXJvdXNlbC1hbmltYXRpb24nKSBpc0FuaW1hdGVkID0gZmFsc2U7XG5cbiAgLyoqIFdyYXBzIGVsZW1lbnQgYnkgYXBwcm9wcmlhdGUgQ1NTIGNsYXNzZXMgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pdGVtJylcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5jYXJvdXNlbC1pdGVtJylcbiAgYWRkQ2xhc3MgPSB0cnVlO1xuXG4gIC8qKiBMaW5rIHRvIFBhcmVudChjb250YWluZXItY29sbGVjdGlvbikgY29tcG9uZW50ICovXG4gIHByb3RlY3RlZCBjYXJvdXNlbDogQ2Fyb3VzZWxDb21wb25lbnQ7XG4gIG11bHRpbGlzdCA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihjYXJvdXNlbDogQ2Fyb3VzZWxDb21wb25lbnQpIHtcbiAgICB0aGlzLmNhcm91c2VsID0gY2Fyb3VzZWw7XG4gIH1cblxuICAvKiogRmlyZXMgY2hhbmdlcyBpbiBjb250YWluZXIgY29sbGVjdGlvbiBhZnRlciBhZGRpbmcgYSBuZXcgc2xpZGUgaW5zdGFuY2UgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jYXJvdXNlbC5hZGRTbGlkZSh0aGlzKTtcbiAgICB0aGlzLml0ZW1XaWR0aCA9IGAkezEwMCAvIHRoaXMuY2Fyb3VzZWwuaXRlbXNQZXJTbGlkZX0lYDtcbiAgICB0aGlzLm11bHRpbGlzdCA9IHRoaXMuY2Fyb3VzZWw/Lml0ZW1zUGVyU2xpZGUgPiAxO1xuICB9XG5cbiAgLyoqIEZpcmVzIGNoYW5nZXMgaW4gY29udGFpbmVyIGNvbGxlY3Rpb24gYWZ0ZXIgcmVtb3Zpbmcgb2YgdGhpcyBzbGlkZSBpbnN0YW5jZSAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNhcm91c2VsLnJlbW92ZVNsaWRlKHRoaXMpO1xuICB9XG59XG4iXX0=