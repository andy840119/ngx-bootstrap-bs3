import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { isBs3 } from 'ngx-bootstrap/utils';
import * as i0 from "@angular/core";
export class BarComponent {
    get isBs3() {
        return isBs3();
    }
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        /** maximum total value of progress element */
        this.max = 100;
        /** current value of progress bar */
        this.value = 0;
        /** if `true` changing value of progress bar will be animated */
        this.animate = false;
        /** If `true`, striped classes are applied */
        this.striped = false;
        /** provide one of the four supported contextual classes: `success`, `info`, `warning`, `danger` */
        this.type = 'info';
        this.percent = 100;
    }
    ngOnChanges(changes) {
        if (changes["value"] || changes["max"]) {
            this.percent = 100 * (Number(changes["value"]?.currentValue || this.value)
                / Number((changes["max"]?.currentValue || this.max) || 100));
        }
        if (changes["type"]) {
            this.applyTypeClasses();
        }
    }
    applyTypeClasses() {
        if (this._prevType) {
            const barTypeClass = `progress-bar-${this._prevType}`;
            const bgClass = `bg-${this._prevType}`;
            this.renderer.removeClass(this.el.nativeElement, barTypeClass);
            this.renderer.removeClass(this.el.nativeElement, bgClass);
            this._prevType = void 0;
        }
        if (this.type) {
            const barTypeClass = `progress-bar-${this.type}`;
            const bgClass = `bg-${this.type}`;
            this.renderer.addClass(this.el.nativeElement, barTypeClass);
            this.renderer.addClass(this.el.nativeElement, bgClass);
            this._prevType = this.type;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BarComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: BarComponent, isStandalone: true, selector: "bar", inputs: { max: "max", value: "value", animate: "animate", striped: "striped", type: "type" }, host: { attributes: { "role": "progressbar", "aria-valuemin": "0" }, properties: { "class.progress-bar": "true", "class.progress-bar-animated": "!isBs3 && animate", "class.progress-bar-striped": "striped", "class.active": "isBs3 && animate", "attr.aria-valuenow": "value", "attr.aria-valuetext": "percent ? percent.toFixed(0) + \"%\" : \"\"", "attr.aria-valuemax": "max", "style.height.%": "\"100\"", "style.width.%": "percent" } }, usesOnChanges: true, ngImport: i0, template: "<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'bar', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        role: 'progressbar',
                        'aria-valuemin': '0',
                        '[class.progress-bar]': 'true',
                        '[class.progress-bar-animated]': '!isBs3 && animate',
                        '[class.progress-bar-striped]': 'striped',
                        '[class.active]': 'isBs3 && animate',
                        '[attr.aria-valuenow]': 'value',
                        '[attr.aria-valuetext]': 'percent ? percent.toFixed(0) + "%" : ""',
                        '[attr.aria-valuemax]': 'max',
                        '[style.height.%]': '"100"',
                        '[style.width.%]': 'percent'
                    }, standalone: true, template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { max: [{
                type: Input
            }], value: [{
                type: Input
            }], animate: [{
                type: Input
            }], striped: [{
                type: Input
            }], type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm9ncmVzc2Jhci9iYXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vc3JjL3Byb2dyZXNzYmFyL2Jhci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUVMLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBdUI1QyxNQUFNLE9BQU8sWUFBWTtJQWtCdkIsSUFBSSxLQUFLO1FBQ1AsT0FBTyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBSUQsWUFDVSxFQUFjLEVBQ2QsUUFBbUI7UUFEbkIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUF6QjdCLDhDQUE4QztRQUNyQyxRQUFHLEdBQUcsR0FBRyxDQUFDO1FBRW5CLG9DQUFvQztRQUMzQixVQUFLLEdBQUksQ0FBQyxDQUFDO1FBRXBCLGdFQUFnRTtRQUN2RCxZQUFPLEdBQUksS0FBSyxDQUFDO1FBRTFCLDZDQUE2QztRQUNwQyxZQUFPLEdBQUksS0FBSyxDQUFDO1FBRTFCLG1HQUFtRztRQUMxRixTQUFJLEdBQXFCLE1BQU0sQ0FBQztRQUV6QyxZQUFPLEdBQUcsR0FBRyxDQUFDO0lBV1gsQ0FBQztJQUVKLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7a0JBQ3RFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxZQUFZLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN0RCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDOzhHQXhEVSxZQUFZO2tHQUFaLFlBQVksbW1CQ2pDekIsNkJBQ0E7OzJGRGdDYSxZQUFZO2tCQXBCeEIsU0FBUzsrQkFDSSxLQUFLLG1CQUVFLHVCQUF1QixDQUFDLE1BQU0sUUFFekM7d0JBQ0YsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLGVBQWUsRUFBRSxHQUFHO3dCQUNwQixzQkFBc0IsRUFBRSxNQUFNO3dCQUM5QiwrQkFBK0IsRUFBRSxtQkFBbUI7d0JBQ3BELDhCQUE4QixFQUFFLFNBQVM7d0JBQ3pDLGdCQUFnQixFQUFFLGtCQUFrQjt3QkFDcEMsc0JBQXNCLEVBQUUsT0FBTzt3QkFDL0IsdUJBQXVCLEVBQUUseUNBQXlDO3dCQUNsRSxzQkFBc0IsRUFBRSxLQUFLO3dCQUM3QixrQkFBa0IsRUFBRSxPQUFPO3dCQUMzQixpQkFBaUIsRUFBRSxTQUFTO3FCQUMvQixjQUNXLElBQUk7dUdBSVQsR0FBRztzQkFBWCxLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFHRyxPQUFPO3NCQUFmLEtBQUs7Z0JBR0csT0FBTztzQkFBZixLQUFLO2dCQUdHLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgaXNCczMgfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcbmltcG9ydCB7IFByb2dyZXNzYmFyVHlwZSB9IGZyb20gJy4vcHJvZ3Jlc3NiYXItdHlwZS5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2JhcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2Jhci5jb21wb25lbnQuaHRtbCcsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1ob3N0LW1ldGFkYXRhLXByb3BlcnR5XG4gICAgaG9zdDoge1xuICAgICAgICByb2xlOiAncHJvZ3Jlc3NiYXInLFxuICAgICAgICAnYXJpYS12YWx1ZW1pbic6ICcwJyxcbiAgICAgICAgJ1tjbGFzcy5wcm9ncmVzcy1iYXJdJzogJ3RydWUnLFxuICAgICAgICAnW2NsYXNzLnByb2dyZXNzLWJhci1hbmltYXRlZF0nOiAnIWlzQnMzICYmIGFuaW1hdGUnLFxuICAgICAgICAnW2NsYXNzLnByb2dyZXNzLWJhci1zdHJpcGVkXSc6ICdzdHJpcGVkJyxcbiAgICAgICAgJ1tjbGFzcy5hY3RpdmVdJzogJ2lzQnMzICYmIGFuaW1hdGUnLFxuICAgICAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAndmFsdWUnLFxuICAgICAgICAnW2F0dHIuYXJpYS12YWx1ZXRleHRdJzogJ3BlcmNlbnQgPyBwZXJjZW50LnRvRml4ZWQoMCkgKyBcIiVcIiA6IFwiXCInLFxuICAgICAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAgICAgJ1tzdHlsZS5oZWlnaHQuJV0nOiAnXCIxMDBcIicsXG4gICAgICAgICdbc3R5bGUud2lkdGguJV0nOiAncGVyY2VudCdcbiAgICB9LFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgLyoqIG1heGltdW0gdG90YWwgdmFsdWUgb2YgcHJvZ3Jlc3MgZWxlbWVudCAqL1xuICBASW5wdXQoKSBtYXggPSAxMDA7XG5cbiAgLyoqIGN1cnJlbnQgdmFsdWUgb2YgcHJvZ3Jlc3MgYmFyICovXG4gIEBJbnB1dCgpIHZhbHVlPyA9IDA7XG5cbiAgLyoqIGlmIGB0cnVlYCBjaGFuZ2luZyB2YWx1ZSBvZiBwcm9ncmVzcyBiYXIgd2lsbCBiZSBhbmltYXRlZCAqL1xuICBASW5wdXQoKSBhbmltYXRlPyA9IGZhbHNlO1xuXG4gIC8qKiBJZiBgdHJ1ZWAsIHN0cmlwZWQgY2xhc3NlcyBhcmUgYXBwbGllZCAqL1xuICBASW5wdXQoKSBzdHJpcGVkPyA9IGZhbHNlO1xuXG4gIC8qKiBwcm92aWRlIG9uZSBvZiB0aGUgZm91ciBzdXBwb3J0ZWQgY29udGV4dHVhbCBjbGFzc2VzOiBgc3VjY2Vzc2AsIGBpbmZvYCwgYHdhcm5pbmdgLCBgZGFuZ2VyYCAqL1xuICBASW5wdXQoKSB0eXBlPzogUHJvZ3Jlc3NiYXJUeXBlID0gJ2luZm8nO1xuXG4gIHBlcmNlbnQgPSAxMDA7XG5cbiAgZ2V0IGlzQnMzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0JzMygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJldlR5cGU/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1tcInZhbHVlXCJdIHx8IGNoYW5nZXNbXCJtYXhcIl0pIHtcbiAgICAgIHRoaXMucGVyY2VudCA9IDEwMCAqIChOdW1iZXIoY2hhbmdlc1tcInZhbHVlXCJdPy5jdXJyZW50VmFsdWUgfHwgdGhpcy52YWx1ZSlcbiAgICAgICAgLyBOdW1iZXIoKGNoYW5nZXNbXCJtYXhcIl0/LmN1cnJlbnRWYWx1ZSB8fCB0aGlzLm1heCkgfHwgMTAwKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbXCJ0eXBlXCJdKSB7XG4gICAgICB0aGlzLmFwcGx5VHlwZUNsYXNzZXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFwcGx5VHlwZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3ByZXZUeXBlKSB7XG4gICAgICBjb25zdCBiYXJUeXBlQ2xhc3MgPSBgcHJvZ3Jlc3MtYmFyLSR7dGhpcy5fcHJldlR5cGV9YDtcbiAgICAgIGNvbnN0IGJnQ2xhc3MgPSBgYmctJHt0aGlzLl9wcmV2VHlwZX1gO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGJhclR5cGVDbGFzcyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgYmdDbGFzcyk7XG4gICAgICB0aGlzLl9wcmV2VHlwZSA9IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlKSB7XG4gICAgICBjb25zdCBiYXJUeXBlQ2xhc3MgPSBgcHJvZ3Jlc3MtYmFyLSR7dGhpcy50eXBlfWA7XG4gICAgICBjb25zdCBiZ0NsYXNzID0gYGJnLSR7dGhpcy50eXBlfWA7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgYmFyVHlwZUNsYXNzKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBiZ0NsYXNzKTtcbiAgICAgIHRoaXMuX3ByZXZUeXBlID0gdGhpcy50eXBlO1xuICAgIH1cbiAgfVxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19