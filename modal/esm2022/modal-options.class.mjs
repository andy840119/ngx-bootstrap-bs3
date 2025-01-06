import { Injectable, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
export class ModalOptions {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ModalOptions, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ModalOptions, providedIn: 'platform' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ModalOptions, decorators: [{
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
    IN: 'in', // bs3
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtb3B0aW9ucy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2RhbC9tb2RhbC1vcHRpb25zLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWtCLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJM0UsTUFBTSxPQUFPLFlBQVk7OEdBQVosWUFBWTtrSEFBWixZQUFZLGNBREEsVUFBVTs7MkZBQ3RCLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDOztBQXVEcEMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWlCO0lBQy9DLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLElBQUk7SUFDZCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsbUJBQW1CLEVBQUUsS0FBSztJQUMxQixLQUFLLEVBQUUsRUFBRTtJQUNULFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLEVBQUU7SUFDaEIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO0NBQ3pCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FDeEMsSUFBSSxjQUFjLENBQWUseUJBQXlCLENBQUMsQ0FBQztBQUU5RCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWM7SUFDbkMsa0JBQWtCLEVBQUUseUJBQXlCO0lBQzdDLFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLE1BQU07SUFDWixFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU07SUFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNO0NBQ3BCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQWE7SUFDaEMsTUFBTSxFQUFFLGVBQWU7SUFDdkIsV0FBVyxFQUFFLHVCQUF1QjtJQUNwQyxZQUFZLEVBQUUsd0JBQXdCO0lBQ3RDLGFBQWEsRUFBRSxvREFBb0Q7Q0FDcEUsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUF3QjtJQUN2RCxLQUFLLEVBQUUsR0FBRztJQUNWLFFBQVEsRUFBRSxHQUFHO0NBQ2QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBbUI7SUFDN0MsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixHQUFHLEVBQUUsS0FBSztJQUNWLElBQUksRUFBRSxpQ0FBaUM7Q0FDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFN0YXRpY1Byb3ZpZGVyLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2xhc3NOYW1lLCBDbG9zZUludGVyY2VwdG9yRm4sIERpc21pc3NSZWFzb25zLCBTZWxlY3RvciwgVHJhbnNpdGlvbkR1cmF0aW9ucyB9IGZyb20gJy4vbW9kZWxzJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdwbGF0Zm9ybSd9KVxuZXhwb3J0IGNsYXNzIE1vZGFsT3B0aW9uczxUID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgLyoqXG4gICAqICBBbGxvdyB1c2VyIHRvIElEIGZvciB0aGUgbW9kYWwuIE90aGVyd2lzZSwgYSB1bmlxdWUgbnVtYmVyIHdpbGwgYmUgZ2l2ZW5cbiAgICovXG4gIGlkPzogbnVtYmVyIHwgc3RyaW5nO1xuICAvKipcbiAgICogIEluY2x1ZGVzIGEgbW9kYWwtYmFja2Ryb3AgZWxlbWVudC4gQWx0ZXJuYXRpdmVseSxcbiAgICogIHNwZWNpZnkgc3RhdGljIGZvciBhIGJhY2tkcm9wIHdoaWNoIGRvZXNuJ3QgY2xvc2UgdGhlIG1vZGFsIG9uIGNsaWNrLlxuICAgKi9cbiAgYmFja2Ryb3A/OiBib29sZWFuIHwgJ3N0YXRpYyc7XG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG1vZGFsIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICAgKi9cbiAga2V5Ym9hcmQ/OiBib29sZWFuO1xuXG4gIGZvY3VzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3dzIHRoZSBtb2RhbCB3aGVuIGluaXRpYWxpemVkLlxuICAgKi9cbiAgc2hvdz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJZ25vcmUgdGhlIGJhY2tkcm9wIGNsaWNrXG4gICAqL1xuICBpZ25vcmVCYWNrZHJvcENsaWNrPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIENzcyBjbGFzcyBmb3Igb3BlbmVkIG1vZGFsXG4gICAqL1xuICBjbGFzcz86IHN0cmluZztcbiAgLyoqXG4gICAqIFRvZ2dsZSBhbmltYXRpb25cbiAgICovXG4gIGFuaW1hdGVkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIE1vZGFsIGRhdGFcbiAgICovXG4gIGluaXRpYWxTdGF0ZT86IFBhcnRpYWw8VD47XG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBpbnRlcmNlcHQgdGhlIGNsb3N1cmVcbiAgICovXG4gIGNsb3NlSW50ZXJjZXB0b3I/OiBDbG9zZUludGVyY2VwdG9yRm47XG4gIC8qKlxuICAgKiBNb2RhbCBwcm92aWRlcnNcbiAgICovXG4gIHByb3ZpZGVycz86IFN0YXRpY1Byb3ZpZGVyW107XG4gIC8qKlxuICAgKiBhcmlhLWxhYmVsbGVkYnkgYXR0cmlidXRlIHZhbHVlIHRvIHNldCBvbiB0aGUgbW9kYWwgd2luZG93XG4gICAqL1xuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZztcbiAgLyoqXG4gICAqIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIHZhbHVlIHRvIHNldCBvbiB0aGUgbW9kYWwgd2luZG93XG4gICAqL1xuICBhcmlhRGVzY3JpYmVkYnk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBtb2RhbENvbmZpZ0RlZmF1bHRzOiBNb2RhbE9wdGlvbnMgPSB7XG4gIGJhY2tkcm9wOiB0cnVlLFxuICBrZXlib2FyZDogdHJ1ZSxcbiAgZm9jdXM6IHRydWUsXG4gIHNob3c6IGZhbHNlLFxuICBpZ25vcmVCYWNrZHJvcENsaWNrOiBmYWxzZSxcbiAgY2xhc3M6ICcnLFxuICBhbmltYXRlZDogdHJ1ZSxcbiAgaW5pdGlhbFN0YXRlOiB7fSxcbiAgY2xvc2VJbnRlcmNlcHRvcjogdm9pZCAwXG59O1xuXG5leHBvcnQgY29uc3QgTU9EQUxfQ09ORklHX0RFRkFVTFRfT1ZFUlJJREU6IEluamVjdGlvblRva2VuPE1vZGFsT3B0aW9ucz4gPVxuICBuZXcgSW5qZWN0aW9uVG9rZW48TW9kYWxPcHRpb25zPignb3ZlcnJpZGUtZGVmYXVsdC1jb25maWcnKTtcblxuZXhwb3J0IGNvbnN0IENMQVNTX05BTUU6IENsYXNzTmFtZSA9IHtcbiAgU0NST0xMQkFSX01FQVNVUkVSOiAnbW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmUnLFxuICBCQUNLRFJPUDogJ21vZGFsLWJhY2tkcm9wJyxcbiAgT1BFTjogJ21vZGFsLW9wZW4nLFxuICBGQURFOiAnZmFkZScsXG4gIElOOiAnaW4nLCAvLyBiczNcbiAgU0hPVzogJ3Nob3cnIC8vIGJzNFxufTtcblxuZXhwb3J0IGNvbnN0IFNFTEVDVE9SOiBTZWxlY3RvciA9IHtcbiAgRElBTE9HOiAnLm1vZGFsLWRpYWxvZycsXG4gIERBVEFfVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLFxuICBEQVRBX0RJU01JU1M6ICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLFxuICBGSVhFRF9DT05URU5UOiAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQnXG59O1xuXG5leHBvcnQgY29uc3QgVFJBTlNJVElPTl9EVVJBVElPTlM6IFRyYW5zaXRpb25EdXJhdGlvbnMgPSB7XG4gIE1PREFMOiAzMDAsXG4gIEJBQ0tEUk9QOiAxNTBcbn07XG5cbmV4cG9ydCBjb25zdCBESVNNSVNTX1JFQVNPTlM6IERpc21pc3NSZWFzb25zID0ge1xuICBCQUNLUkRPUDogJ2JhY2tkcm9wLWNsaWNrJyxcbiAgRVNDOiAnZXNjJyxcbiAgQkFDSzogJ2Jyb3dzZXItYmFjay1uYXZpZ2F0aW9uLWNsaWNrZWQnXG59O1xuIl19