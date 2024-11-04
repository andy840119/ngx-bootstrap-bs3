import { Injectable, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
export class ModalOptions {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: ModalOptions, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: ModalOptions, providedIn: 'platform' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: ModalOptions, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'platform' }]
        }] });
export const modalConfigDefaults = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    animated: true,
    initialState: {},
    closeInterceptor: void 0
};
export const MODAL_CONFIG_DEFAULT_OVERRIDE = new InjectionToken('override-default-config');
export const CLASS_NAME = {
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    IN: 'in',
    SHOW: 'show' // bs4
};
export const SELECTOR = {
    DIALOG: '.modal-dialog',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.navbar-fixed-top, .navbar-fixed-bottom, .is-fixed'
};
export const TRANSITION_DURATIONS = {
    MODAL: 300,
    BACKDROP: 150
};
export const DISMISS_REASONS = {
    BACKRDOP: 'backdrop-click',
    ESC: 'esc',
    BACK: 'browser-back-navigation-clicked'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtb3B0aW9ucy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2RhbC9tb2RhbC1vcHRpb25zLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWtCLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJM0UsTUFBTSxPQUFPLFlBQVk7OEdBQVosWUFBWTtrSEFBWixZQUFZLGNBREEsVUFBVTs7MkZBQ3RCLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDOztBQXVEcEMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWlCO0lBQy9DLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLElBQUk7SUFDZCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsbUJBQW1CLEVBQUUsS0FBSztJQUMxQixLQUFLLEVBQUUsRUFBRTtJQUNULFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLEVBQUU7SUFDaEIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO0NBQ3pCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FDeEMsSUFBSSxjQUFjLENBQWUseUJBQXlCLENBQUMsQ0FBQztBQUU5RCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWM7SUFDbkMsa0JBQWtCLEVBQUUseUJBQXlCO0lBQzdDLFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLE1BQU07SUFDWixFQUFFLEVBQUUsSUFBSTtJQUNSLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTTtDQUNwQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFhO0lBQ2hDLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLFdBQVcsRUFBRSx1QkFBdUI7SUFDcEMsWUFBWSxFQUFFLHdCQUF3QjtJQUN0QyxhQUFhLEVBQUUsb0RBQW9EO0NBQ3BFLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBd0I7SUFDdkQsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsR0FBRztDQUNkLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQW1CO0lBQzdDLFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsR0FBRyxFQUFFLEtBQUs7SUFDVixJQUFJLEVBQUUsaUNBQWlDO0NBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBTdGF0aWNQcm92aWRlciwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsYXNzTmFtZSwgQ2xvc2VJbnRlcmNlcHRvckZuLCBEaXNtaXNzUmVhc29ucywgU2VsZWN0b3IsIFRyYW5zaXRpb25EdXJhdGlvbnMgfSBmcm9tICcuL21vZGVscyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncGxhdGZvcm0nfSlcbmV4cG9ydCBjbGFzcyBNb2RhbE9wdGlvbnM8VCA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB7XG4gIC8qKlxuICAgKiAgQWxsb3cgdXNlciB0byBJRCBmb3IgdGhlIG1vZGFsLiBPdGhlcndpc2UsIGEgdW5pcXVlIG51bWJlciB3aWxsIGJlIGdpdmVuXG4gICAqL1xuICBpZD86IG51bWJlciB8IHN0cmluZztcbiAgLyoqXG4gICAqICBJbmNsdWRlcyBhIG1vZGFsLWJhY2tkcm9wIGVsZW1lbnQuIEFsdGVybmF0aXZlbHksXG4gICAqICBzcGVjaWZ5IHN0YXRpYyBmb3IgYSBiYWNrZHJvcCB3aGljaCBkb2Vzbid0IGNsb3NlIHRoZSBtb2RhbCBvbiBjbGljay5cbiAgICovXG4gIGJhY2tkcm9wPzogYm9vbGVhbiB8ICdzdGF0aWMnO1xuICAvKipcbiAgICogQ2xvc2VzIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICovXG4gIGtleWJvYXJkPzogYm9vbGVhbjtcblxuICBmb2N1cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93cyB0aGUgbW9kYWwgd2hlbiBpbml0aWFsaXplZC5cbiAgICovXG4gIHNob3c/OiBib29sZWFuO1xuICAvKipcbiAgICogSWdub3JlIHRoZSBiYWNrZHJvcCBjbGlja1xuICAgKi9cbiAgaWdub3JlQmFja2Ryb3BDbGljaz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBDc3MgY2xhc3MgZm9yIG9wZW5lZCBtb2RhbFxuICAgKi9cbiAgY2xhc3M/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUb2dnbGUgYW5pbWF0aW9uXG4gICAqL1xuICBhbmltYXRlZD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBNb2RhbCBkYXRhXG4gICAqL1xuICBpbml0aWFsU3RhdGU/OiBQYXJ0aWFsPFQ+O1xuICAvKipcbiAgICogRnVuY3Rpb24gdG8gaW50ZXJjZXB0IHRoZSBjbG9zdXJlXG4gICAqL1xuICBjbG9zZUludGVyY2VwdG9yPzogQ2xvc2VJbnRlcmNlcHRvckZuO1xuICAvKipcbiAgICogTW9kYWwgcHJvdmlkZXJzXG4gICAqL1xuICBwcm92aWRlcnM/OiBTdGF0aWNQcm92aWRlcltdO1xuICAvKipcbiAgICogYXJpYS1sYWJlbGxlZGJ5IGF0dHJpYnV0ZSB2YWx1ZSB0byBzZXQgb24gdGhlIG1vZGFsIHdpbmRvd1xuICAgKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSB2YWx1ZSB0byBzZXQgb24gdGhlIG1vZGFsIHdpbmRvd1xuICAgKi9cbiAgYXJpYURlc2NyaWJlZGJ5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgbW9kYWxDb25maWdEZWZhdWx0czogTW9kYWxPcHRpb25zID0ge1xuICBiYWNrZHJvcDogdHJ1ZSxcbiAga2V5Ym9hcmQ6IHRydWUsXG4gIGZvY3VzOiB0cnVlLFxuICBzaG93OiBmYWxzZSxcbiAgaWdub3JlQmFja2Ryb3BDbGljazogZmFsc2UsXG4gIGNsYXNzOiAnJyxcbiAgYW5pbWF0ZWQ6IHRydWUsXG4gIGluaXRpYWxTdGF0ZToge30sXG4gIGNsb3NlSW50ZXJjZXB0b3I6IHZvaWQgMFxufTtcblxuZXhwb3J0IGNvbnN0IE1PREFMX0NPTkZJR19ERUZBVUxUX09WRVJSSURFOiBJbmplY3Rpb25Ub2tlbjxNb2RhbE9wdGlvbnM+ID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1vZGFsT3B0aW9ucz4oJ292ZXJyaWRlLWRlZmF1bHQtY29uZmlnJyk7XG5cbmV4cG9ydCBjb25zdCBDTEFTU19OQU1FOiBDbGFzc05hbWUgPSB7XG4gIFNDUk9MTEJBUl9NRUFTVVJFUjogJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJyxcbiAgQkFDS0RST1A6ICdtb2RhbC1iYWNrZHJvcCcsXG4gIE9QRU46ICdtb2RhbC1vcGVuJyxcbiAgRkFERTogJ2ZhZGUnLFxuICBJTjogJ2luJywgLy8gYnMzXG4gIFNIT1c6ICdzaG93JyAvLyBiczRcbn07XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RPUjogU2VsZWN0b3IgPSB7XG4gIERJQUxPRzogJy5tb2RhbC1kaWFsb2cnLFxuICBEQVRBX1RPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxcbiAgREFUQV9ESVNNSVNTOiAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxcbiAgRklYRURfQ09OVEVOVDogJy5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkJ1xufTtcblxuZXhwb3J0IGNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT05TOiBUcmFuc2l0aW9uRHVyYXRpb25zID0ge1xuICBNT0RBTDogMzAwLFxuICBCQUNLRFJPUDogMTUwXG59O1xuXG5leHBvcnQgY29uc3QgRElTTUlTU19SRUFTT05TOiBEaXNtaXNzUmVhc29ucyA9IHtcbiAgQkFDS1JET1A6ICdiYWNrZHJvcC1jbGljaycsXG4gIEVTQzogJ2VzYycsXG4gIEJBQ0s6ICdicm93c2VyLWJhY2stbmF2aWdhdGlvbi1jbGlja2VkJ1xufTtcbiJdfQ==