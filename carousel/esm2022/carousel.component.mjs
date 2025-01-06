/***
 * pause (not yet supported) (?string='hover') - event group name which pauses
 * the cycling of the carousel, if hover pauses on mouseenter and resumes on
 * mouseleave keyboard (not yet supported) (?boolean=true) - if false
 * carousel will not react to keyboard events
 * note: swiping not yet supported
 */
/****
 * Problems:
 * 1) if we set an active slide via model changes, .active class remains on a
 * current slide.
 * 2) if we have only one slide, we shouldn't show prev/next nav buttons
 * 3) if first or last slide is active and noWrap is true, there should be
 * "disabled" class on the nav buttons.
 * 4) default interval should be equal 5000
 */
import { Component, EventEmitter, Input, NgZone, Output, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, NgStyle } from '@angular/common';
import { isBs3, LinkedList, getBsVer } from 'ngx-bootstrap/utils';
import { CarouselConfig } from './carousel.config';
import { findLastIndex, chunkByNumber, isNumber } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "./carousel.config";
export var Direction;
(function (Direction) {
    Direction[Direction["UNKNOWN"] = 0] = "UNKNOWN";
    Direction[Direction["NEXT"] = 1] = "NEXT";
    Direction[Direction["PREV"] = 2] = "PREV";
})(Direction || (Direction = {}));
let _currentId = 1;
/**
 * Base element to create carousel
 */
export class CarouselComponent {
    /** Index of currently displayed slide(started for 0) */
    set activeSlide(index) {
        if (this.multilist) {
            return;
        }
        if (isNumber(index)) {
            this.customActiveSlide = index;
        }
        if (this._slides.length && index !== this._currentActiveSlide) {
            this._select(index);
        }
    }
    get activeSlide() {
        return this._currentActiveSlide || 0;
    }
    /**
     * Delay of item cycling in milliseconds. If false, carousel won't cycle
     * automatically.
     */
    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
        this.restartTimer();
    }
    get slides() {
        return this._slides.toArray();
    }
    get isFirstSlideVisible() {
        const indexes = this.getVisibleIndexes();
        if (!indexes || (indexes instanceof Array && !indexes.length)) {
            return false;
        }
        return indexes.includes(0);
    }
    get isLastSlideVisible() {
        const indexes = this.getVisibleIndexes();
        if (!indexes || (indexes instanceof Array && !indexes.length)) {
            return false;
        }
        return indexes.includes(this._slides.length - 1);
    }
    get isBs4() {
        return !isBs3();
    }
    get _bsVer() {
        return getBsVer();
    }
    constructor(config, ngZone, platformId) {
        this.ngZone = ngZone;
        this.platformId = platformId;
        /* If `true` — carousel will not cycle continuously and will have hard stops (prevent looping) */
        this.noWrap = false;
        /*  If `true` — will disable pausing on carousel mouse hover */
        this.noPause = false;
        /*  If `true` — carousel-indicators are visible  */
        this.showIndicators = true;
        /*  If `true` - autoplay will be stopped on focus */
        this.pauseOnFocus = false;
        /* If `true` - carousel indicators indicate slides chunks
           works ONLY if singleSlideOffset = FALSE */
        this.indicatorsByChunk = false;
        /* If value more then 1 — carousel works in multilist mode */
        this.itemsPerSlide = 1;
        /* If `true` — carousel shifts by one element. By default carousel shifts by number
           of visible elements (itemsPerSlide field) */
        this.singleSlideOffset = false;
        /** Turn on/off animation. Animation doesn't work for multilist carousel */
        this.isAnimated = false;
        /** Will be emitted when active slide has been changed. Part of two-way-bindable [(activeSlide)] property */
        this.activeSlideChange = new EventEmitter(false);
        /** Will be emitted when active slides has been changed in multilist mode */
        this.slideRangeChange = new EventEmitter();
        /* Index to start display slides from it */
        this.startFromIndex = 0;
        this._interval = 5000;
        this._slides = new LinkedList();
        this._currentVisibleSlidesIndex = 0;
        this.isPlaying = false;
        this.destroyed = false;
        this.currentId = 0;
        this.getActive = (slide) => slide.active;
        this.makeSlidesConsistent = (slides) => {
            slides.forEach((slide, index) => slide.item.order = index);
        };
        Object.assign(this, config);
        this.currentId = _currentId++;
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.singleSlideOffset) {
                this.indicatorsByChunk = false;
            }
            if (this.multilist) {
                this._chunkedSlides = chunkByNumber(this.mapSlidesAndIndexes(), this.itemsPerSlide);
                this.selectInitialSlides();
            }
            if (this.customActiveSlide && !this.multilist) {
                this._select(this.customActiveSlide);
            }
        }, 0);
    }
    ngOnDestroy() {
        this.destroyed = true;
    }
    /**
     * Adds new slide. If this slide is first in collection - set it as active
     * and starts auto changing
     * @param slide
     */
    addSlide(slide) {
        this._slides.add(slide);
        if (this.multilist && this._slides.length <= this.itemsPerSlide) {
            slide.active = true;
        }
        if (!this.multilist && this.isAnimated) {
            slide.isAnimated = true;
        }
        if (!this.multilist && this._slides.length === 1) {
            this._currentActiveSlide = undefined;
            if (!this.customActiveSlide) {
                this.activeSlide = 0;
            }
            this.play();
        }
        if (this.multilist && this._slides.length > this.itemsPerSlide) {
            this.play();
        }
    }
    /**
     * Removes specified slide. If this slide is active - will roll to another
     * slide
     * @param slide
     */
    removeSlide(slide) {
        const remIndex = this._slides.indexOf(slide);
        if (this._currentActiveSlide === remIndex) {
            // removing of active slide
            let nextSlideIndex;
            if (this._slides.length > 1) {
                // if this slide last - will roll to first slide, if noWrap flag is
                // FALSE or to previous, if noWrap is TRUE in case, if this slide in
                // middle of collection, index of next slide is same to removed
                nextSlideIndex = !this.isLast(remIndex)
                    ? remIndex
                    : this.noWrap ? remIndex - 1 : 0;
            }
            this._slides.remove(remIndex);
            // prevents exception with changing some value after checking
            setTimeout(() => {
                this._select(nextSlideIndex);
            }, 0);
        }
        else {
            this._slides.remove(remIndex);
            const currentSlideIndex = this.getCurrentSlideIndex();
            setTimeout(() => {
                // after removing, need to actualize index of current active slide
                this._currentActiveSlide = currentSlideIndex;
                this.activeSlideChange.emit(this._currentActiveSlide);
            }, 0);
        }
    }
    nextSlideFromInterval(force = false) {
        this.move(Direction.NEXT, force);
    }
    /**
     * Rolling to next slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    nextSlide(force = false) {
        if (this.isPlaying) {
            this.restartTimer();
        }
        this.move(Direction.NEXT, force);
    }
    /**
     * Rolling to previous slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    previousSlide(force = false) {
        if (this.isPlaying) {
            this.restartTimer();
        }
        this.move(Direction.PREV, force);
    }
    getFirstVisibleIndex() {
        return this.slides.findIndex(this.getActive);
    }
    getLastVisibleIndex() {
        return findLastIndex(this.slides, this.getActive);
    }
    move(direction, force = false) {
        const firstVisibleIndex = this.getFirstVisibleIndex();
        const lastVisibleIndex = this.getLastVisibleIndex();
        if (this.noWrap) {
            if (direction === Direction.NEXT &&
                this.isLast(lastVisibleIndex) ||
                direction === Direction.PREV &&
                    firstVisibleIndex === 0) {
                return;
            }
        }
        if (!this.multilist) {
            this.activeSlide = this.findNextSlideIndex(direction, force) || 0;
        }
        else {
            this.moveMultilist(direction);
        }
    }
    /**
     * Swith slides by enter, space and arrows keys
     * @internal
     */
    keydownPress(event) {
        if (event.keyCode === 13 || event.key === 'Enter' || event.keyCode === 32 || event.key === 'Space') {
            this.nextSlide();
            event.preventDefault();
            return;
        }
        if (event.keyCode === 37 || event.key === 'LeftArrow') {
            this.previousSlide();
            return;
        }
        if (event.keyCode === 39 || event.key === 'RightArrow') {
            this.nextSlide();
            return;
        }
    }
    /**
     * Play on mouse leave
     * @internal
     */
    onMouseLeave() {
        if (!this.pauseOnFocus) {
            this.play();
        }
    }
    /**
     * Play on mouse up
     * @internal
     */
    onMouseUp() {
        if (!this.pauseOnFocus) {
            this.play();
        }
    }
    /**
     * When slides on focus autoplay is stopped(optional)
     * @internal
     */
    pauseFocusIn() {
        if (this.pauseOnFocus) {
            this.isPlaying = false;
            this.resetTimer();
        }
    }
    /**
     * When slides out of focus autoplay is started
     * @internal
     */
    pauseFocusOut() {
        this.play();
    }
    /**
     * Rolling to specified slide
     * @param index: {number} index of slide, which must be shown
     */
    selectSlide(index) {
        if (this.isPlaying) {
            this.restartTimer();
        }
        if (!this.multilist) {
            this.activeSlide = this.indicatorsByChunk ? index * this.itemsPerSlide : index;
        }
        else {
            this.selectSlideRange(this.indicatorsByChunk ? index * this.itemsPerSlide : index);
        }
    }
    /**
     * Starts a auto changing of slides
     */
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.restartTimer();
        }
    }
    /**
     * Stops a auto changing of slides
     */
    pause() {
        if (!this.noPause) {
            this.isPlaying = false;
            this.resetTimer();
        }
    }
    /**
     * Finds and returns index of currently displayed slide
     */
    getCurrentSlideIndex() {
        return this._slides.findIndex(this.getActive);
    }
    /**
     * Defines, whether the specified index is last in collection
     * @param index
     */
    isLast(index) {
        return index + 1 >= this._slides.length;
    }
    /**
     * Defines, whether the specified index is first in collection
     * @param index
     */
    isFirst(index) {
        return index === 0;
    }
    indicatorsSlides() {
        return this.slides.filter((slide, index) => !this.indicatorsByChunk || index % this.itemsPerSlide === 0);
    }
    selectInitialSlides() {
        const startIndex = this.startFromIndex <= this._slides.length
            ? this.startFromIndex
            : 0;
        this.hideSlides();
        if (this.singleSlideOffset) {
            this._slidesWithIndexes = this.mapSlidesAndIndexes();
            if (this._slides.length - startIndex < this.itemsPerSlide) {
                const slidesToAppend = this._slidesWithIndexes.slice(0, startIndex);
                this._slidesWithIndexes = [
                    ...this._slidesWithIndexes,
                    ...slidesToAppend
                ]
                    .slice(slidesToAppend.length)
                    .slice(0, this.itemsPerSlide);
            }
            else {
                this._slidesWithIndexes = this._slidesWithIndexes.slice(startIndex, startIndex + this.itemsPerSlide);
            }
            this._slidesWithIndexes.forEach((slide) => slide.item.active = true);
            this.makeSlidesConsistent(this._slidesWithIndexes);
        }
        else {
            this.selectRangeByNestedIndex(startIndex);
        }
        this.slideRangeChange.emit(this.getVisibleIndexes());
    }
    /**
     * Defines next slide index, depending of direction
     * @param direction: Direction(UNKNOWN|PREV|NEXT)
     * @param force: {boolean} if TRUE - will ignore noWrap flag, else will
     *   return undefined if next slide require wrapping
     */
    findNextSlideIndex(direction, force) {
        let nextSlideIndex = 0;
        if (!force &&
            (this.isLast(this.activeSlide) &&
                direction !== Direction.PREV &&
                this.noWrap)) {
            return;
        }
        switch (direction) {
            case Direction.NEXT:
                // if this is last slide, not force, looping is disabled
                // and need to going forward - select current slide, as a next
                if (typeof this._currentActiveSlide === 'undefined') {
                    nextSlideIndex = 0;
                    break;
                }
                if (!this.isLast(this._currentActiveSlide)) {
                    nextSlideIndex = this._currentActiveSlide + 1;
                    break;
                }
                nextSlideIndex = !force && this.noWrap ? this._currentActiveSlide : 0;
                break;
            case Direction.PREV:
                // if this is first slide, not force, looping is disabled
                // and need to going backward - select current slide, as a next
                if (typeof this._currentActiveSlide === 'undefined') {
                    nextSlideIndex = 0;
                    break;
                }
                if (this._currentActiveSlide > 0) {
                    nextSlideIndex = this._currentActiveSlide - 1;
                    break;
                }
                if (!force && this.noWrap) {
                    nextSlideIndex = this._currentActiveSlide;
                    break;
                }
                nextSlideIndex = this._slides.length - 1;
                break;
            default:
                throw new Error('Unknown direction');
        }
        return nextSlideIndex;
    }
    mapSlidesAndIndexes() {
        return this.slides
            .slice()
            .map((slide, index) => {
            return {
                index,
                item: slide
            };
        });
    }
    selectSlideRange(index) {
        if (this.isIndexInRange(index)) {
            return;
        }
        this.hideSlides();
        if (!this.singleSlideOffset) {
            this.selectRangeByNestedIndex(index);
        }
        else {
            const startIndex = this.isIndexOnTheEdges(index)
                ? index
                : index - this.itemsPerSlide + 1;
            const endIndex = this.isIndexOnTheEdges(index)
                ? index + this.itemsPerSlide
                : index + 1;
            this._slidesWithIndexes = this.mapSlidesAndIndexes().slice(startIndex, endIndex);
            this.makeSlidesConsistent(this._slidesWithIndexes);
            this._slidesWithIndexes.forEach((slide) => slide.item.active = true);
        }
        this.slideRangeChange.emit(this.getVisibleIndexes());
    }
    selectRangeByNestedIndex(index) {
        if (!this._chunkedSlides) {
            return;
        }
        const selectedRange = this._chunkedSlides
            .map((slidesList, i) => {
            return {
                index: i,
                list: slidesList
            };
        })
            .find((slidesList) => {
            return slidesList.list.find(slide => slide.index === index) !== undefined;
        });
        if (!selectedRange) {
            return;
        }
        this._currentVisibleSlidesIndex = selectedRange.index;
        this._chunkedSlides[selectedRange.index].forEach((slide) => {
            slide.item.active = true;
        });
    }
    isIndexOnTheEdges(index) {
        return (index + 1 - this.itemsPerSlide <= 0 ||
            index + this.itemsPerSlide <= this._slides.length);
    }
    isIndexInRange(index) {
        if (this.singleSlideOffset && this._slidesWithIndexes) {
            const visibleIndexes = this._slidesWithIndexes.map((slide) => slide.index);
            return visibleIndexes.indexOf(index) >= 0;
        }
        return (index <= this.getLastVisibleIndex() &&
            index >= this.getFirstVisibleIndex());
    }
    hideSlides() {
        this.slides.forEach((slide) => slide.active = false);
    }
    isVisibleSlideListLast() {
        if (!this._chunkedSlides) {
            return false;
        }
        return this._currentVisibleSlidesIndex === this._chunkedSlides.length - 1;
    }
    isVisibleSlideListFirst() {
        return this._currentVisibleSlidesIndex === 0;
    }
    moveSliderByOneItem(direction) {
        let firstVisibleIndex;
        let lastVisibleIndex;
        let indexToHide;
        let indexToShow;
        if (this.noWrap) {
            firstVisibleIndex = this.getFirstVisibleIndex();
            lastVisibleIndex = this.getLastVisibleIndex();
            indexToHide = direction === Direction.NEXT
                ? firstVisibleIndex
                : lastVisibleIndex;
            indexToShow = direction !== Direction.NEXT
                ? firstVisibleIndex - 1
                : !this.isLast(lastVisibleIndex)
                    ? lastVisibleIndex + 1 : 0;
            const slideToHide = this._slides.get(indexToHide);
            if (slideToHide) {
                slideToHide.active = false;
            }
            const slideToShow = this._slides.get(indexToShow);
            if (slideToShow) {
                slideToShow.active = true;
            }
            const slidesToReorder = this.mapSlidesAndIndexes().filter((slide) => slide.item.active);
            this.makeSlidesConsistent(slidesToReorder);
            if (this.singleSlideOffset) {
                this._slidesWithIndexes = slidesToReorder;
            }
            this.slideRangeChange.emit(this.getVisibleIndexes());
            return;
        }
        if (!this._slidesWithIndexes || !this._slidesWithIndexes[0]) {
            return;
        }
        let index;
        firstVisibleIndex = this._slidesWithIndexes[0].index;
        lastVisibleIndex = this._slidesWithIndexes[this._slidesWithIndexes.length - 1].index;
        if (direction === Direction.NEXT) {
            this._slidesWithIndexes.shift();
            index = this.isLast(lastVisibleIndex)
                ? 0
                : lastVisibleIndex + 1;
            const item = this._slides.get(index);
            if (item) {
                this._slidesWithIndexes.push({ index, item });
            }
        }
        else {
            this._slidesWithIndexes.pop();
            index = this.isFirst(firstVisibleIndex)
                ? this._slides.length - 1
                : firstVisibleIndex - 1;
            const item = this._slides.get(index);
            if (item) {
                this._slidesWithIndexes = [{ index, item }, ...this._slidesWithIndexes];
            }
        }
        this.hideSlides();
        this._slidesWithIndexes.forEach(slide => slide.item.active = true);
        this.makeSlidesConsistent(this._slidesWithIndexes);
        this.slideRangeChange.emit(this._slidesWithIndexes.map((slide) => slide.index));
    }
    moveMultilist(direction) {
        if (this.singleSlideOffset) {
            this.moveSliderByOneItem(direction);
        }
        else {
            this.hideSlides();
            if (this.noWrap) {
                this._currentVisibleSlidesIndex = direction === Direction.NEXT
                    ? this._currentVisibleSlidesIndex + 1
                    : this._currentVisibleSlidesIndex - 1;
            }
            else if (direction === Direction.NEXT) {
                this._currentVisibleSlidesIndex = this.isVisibleSlideListLast()
                    ? 0
                    : this._currentVisibleSlidesIndex + 1;
            }
            else {
                if (this.isVisibleSlideListFirst()) {
                    this._currentVisibleSlidesIndex = this._chunkedSlides
                        ? this._chunkedSlides.length - 1
                        : 0;
                }
                else {
                    this._currentVisibleSlidesIndex = this._currentVisibleSlidesIndex - 1;
                }
            }
            if (this._chunkedSlides) {
                this._chunkedSlides[this._currentVisibleSlidesIndex].forEach((slide) => slide.item.active = true);
            }
            this.slideRangeChange.emit(this.getVisibleIndexes());
        }
    }
    getVisibleIndexes() {
        if (!this.singleSlideOffset && this._chunkedSlides) {
            return this._chunkedSlides[this._currentVisibleSlidesIndex]
                .map((slide) => slide.index);
        }
        if (this._slidesWithIndexes) {
            return this._slidesWithIndexes.map((slide) => slide.index);
        }
    }
    /**
     * Sets a slide, which specified through index, as active
     * @param index
     */
    _select(index) {
        if (isNaN(index)) {
            this.pause();
            return;
        }
        if (!this.multilist && typeof this._currentActiveSlide !== 'undefined') {
            const currentSlide = this._slides.get(this._currentActiveSlide);
            if (typeof currentSlide !== 'undefined') {
                currentSlide.active = false;
            }
        }
        const nextSlide = this._slides.get(index);
        if (typeof nextSlide !== 'undefined') {
            this._currentActiveSlide = index;
            nextSlide.active = true;
            this.activeSlide = index;
            this.activeSlideChange.emit(index);
        }
    }
    /**
     * Starts loop of auto changing of slides
     */
    restartTimer() {
        this.resetTimer();
        const interval = +this.interval;
        if (!isNaN(interval) && interval > 0 && isPlatformBrowser(this.platformId)) {
            this.currentInterval = this.ngZone.runOutsideAngular(() => {
                return window.setInterval(() => {
                    const nInterval = +this.interval;
                    this.ngZone.run(() => {
                        if (this.isPlaying &&
                            !isNaN(this.interval) &&
                            nInterval > 0 &&
                            this.slides.length) {
                            this.nextSlideFromInterval();
                        }
                        else {
                            this.pause();
                        }
                    });
                }, interval);
            });
        }
    }
    get multilist() {
        return this.itemsPerSlide > 1;
    }
    /**
     * Stops loop of auto changing of slides
     */
    resetTimer() {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = void 0;
        }
    }
    checkDisabledClass(buttonType) {
        if (buttonType === 'prev') {
            return (this.activeSlide === 0 && this.noWrap && !this.multilist) || (this.isFirstSlideVisible && this.noWrap && this.multilist);
        }
        return (this.isLast(this.activeSlide) && this.noWrap && !this.multilist) || (this.isLastSlideVisible && this.noWrap && this.multilist);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CarouselComponent, deps: [{ token: i1.CarouselConfig }, { token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: CarouselComponent, isStandalone: true, selector: "carousel", inputs: { noWrap: "noWrap", noPause: "noPause", showIndicators: "showIndicators", pauseOnFocus: "pauseOnFocus", indicatorsByChunk: "indicatorsByChunk", itemsPerSlide: "itemsPerSlide", singleSlideOffset: "singleSlideOffset", isAnimated: "isAnimated", activeSlide: "activeSlide", startFromIndex: "startFromIndex", interval: "interval" }, outputs: { activeSlideChange: "activeSlideChange", slideRangeChange: "slideRangeChange" }, ngImport: i0, template: "<div (mouseenter)=\"pause()\"\n     (mouseleave)=\"onMouseLeave()\"\n     (mouseup)=\"onMouseUp()\"\n     (keydown)=\"keydownPress($event)\"\n     (focusin)=\"pauseFocusIn()\"\n     (focusout)=\"pauseFocusOut()\"\n     [id]=\"'carousel' + currentId\"\n     class=\"carousel slide\" tabindex=\"0\">\n  <ng-container *ngIf=\"!_bsVer.isBs5 && showIndicators && slides.length > 1\">\n    <ol class=\"carousel-indicators\">\n      <li *ngFor=\"let slide of indicatorsSlides(); let i = index;\"\n          [class.active]=\"slide.active === true\"\n          (click)=\"selectSlide(i)\">\n      </li>\n    </ol>\n  </ng-container>\n  <ng-container *ngIf=\"_bsVer.isBs5 && showIndicators && slides.length > 1\">\n    <div class=\"carousel-indicators\">\n      <button\n        *ngFor=\"let slide of indicatorsSlides(); let i = index;\"\n        [class.active]=\"slide.active === true\"\n        (click)=\"selectSlide(i)\"\n        type=\"button\"\n        [attr.data-bs-target]=\"'#carousel' + currentId\"\n        [attr.data-bs-slide-to]=\"i\" aria-current=\"true\"\n      >\n      </button>\n    </div>\n  </ng-container>\n  <div class=\"carousel-inner\" [ngStyle]=\"{'display': multilist ? 'flex' : 'block'}\">\n    <ng-content></ng-content>\n  </div>\n  <a class=\"left carousel-control carousel-control-prev\"\n     href=\"javascript:void(0);\"\n     [class.disabled]=\"checkDisabledClass('prev')\"\n     [attr.data-bs-target]=\"'#carousel' + currentId\"\n     *ngIf=\"slides.length > 1\"\n     (click)=\"previousSlide()\"\n     tabindex=\"0\" role=\"button\">\n    <span class=\"icon-prev carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only visually-hidden\">Previous</span>\n  </a>\n  <a class=\"right carousel-control carousel-control-next\"\n     href=\"javascript:void(0);\"\n     *ngIf=\"slides.length > 1\"\n     (click)=\"nextSlide()\"\n     [class.disabled]=\"checkDisabledClass('next')\"\n     [attr.data-bs-target]=\"'#carousel' + currentId\"\n     tabindex=\"0\" role=\"button\">\n    <span class=\"icon-next carousel-control-next-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only visually-hidden\">Next</span>\n  </a>\n</div>\n", dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: CarouselComponent, decorators: [{
            type: Component,
            args: [{ selector: 'carousel', standalone: true, imports: [NgIf, NgFor, NgStyle], template: "<div (mouseenter)=\"pause()\"\n     (mouseleave)=\"onMouseLeave()\"\n     (mouseup)=\"onMouseUp()\"\n     (keydown)=\"keydownPress($event)\"\n     (focusin)=\"pauseFocusIn()\"\n     (focusout)=\"pauseFocusOut()\"\n     [id]=\"'carousel' + currentId\"\n     class=\"carousel slide\" tabindex=\"0\">\n  <ng-container *ngIf=\"!_bsVer.isBs5 && showIndicators && slides.length > 1\">\n    <ol class=\"carousel-indicators\">\n      <li *ngFor=\"let slide of indicatorsSlides(); let i = index;\"\n          [class.active]=\"slide.active === true\"\n          (click)=\"selectSlide(i)\">\n      </li>\n    </ol>\n  </ng-container>\n  <ng-container *ngIf=\"_bsVer.isBs5 && showIndicators && slides.length > 1\">\n    <div class=\"carousel-indicators\">\n      <button\n        *ngFor=\"let slide of indicatorsSlides(); let i = index;\"\n        [class.active]=\"slide.active === true\"\n        (click)=\"selectSlide(i)\"\n        type=\"button\"\n        [attr.data-bs-target]=\"'#carousel' + currentId\"\n        [attr.data-bs-slide-to]=\"i\" aria-current=\"true\"\n      >\n      </button>\n    </div>\n  </ng-container>\n  <div class=\"carousel-inner\" [ngStyle]=\"{'display': multilist ? 'flex' : 'block'}\">\n    <ng-content></ng-content>\n  </div>\n  <a class=\"left carousel-control carousel-control-prev\"\n     href=\"javascript:void(0);\"\n     [class.disabled]=\"checkDisabledClass('prev')\"\n     [attr.data-bs-target]=\"'#carousel' + currentId\"\n     *ngIf=\"slides.length > 1\"\n     (click)=\"previousSlide()\"\n     tabindex=\"0\" role=\"button\">\n    <span class=\"icon-prev carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only visually-hidden\">Previous</span>\n  </a>\n  <a class=\"right carousel-control carousel-control-next\"\n     href=\"javascript:void(0);\"\n     *ngIf=\"slides.length > 1\"\n     (click)=\"nextSlide()\"\n     [class.disabled]=\"checkDisabledClass('next')\"\n     [attr.data-bs-target]=\"'#carousel' + currentId\"\n     tabindex=\"0\" role=\"button\">\n    <span class=\"icon-next carousel-control-next-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only visually-hidden\">Next</span>\n  </a>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.CarouselConfig }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { noWrap: [{
                type: Input
            }], noPause: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], pauseOnFocus: [{
                type: Input
            }], indicatorsByChunk: [{
                type: Input
            }], itemsPerSlide: [{
                type: Input
            }], singleSlideOffset: [{
                type: Input
            }], isAnimated: [{
                type: Input
            }], activeSlideChange: [{
                type: Output
            }], slideRangeChange: [{
                type: Output
            }], activeSlide: [{
                type: Input
            }], startFromIndex: [{
                type: Input
            }], interval: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3NyYy9jYXJvdXNlbC9jYXJvdXNlbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDs7Ozs7Ozs7R0FRRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQWEsTUFBTSxFQUFpQixNQUFNLEVBQUUsV0FBVyxFQUM5RixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQWMsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDOzs7QUFHakUsTUFBTSxDQUFOLElBQVksU0FJWDtBQUpELFdBQVksU0FBUztJQUNuQiwrQ0FBTyxDQUFBO0lBQ1AseUNBQUksQ0FBQTtJQUNKLHlDQUFJLENBQUE7QUFDTixDQUFDLEVBSlcsU0FBUyxLQUFULFNBQVMsUUFJcEI7QUFFRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFFbkI7O0dBRUc7QUFPSCxNQUFNLE9BQU8saUJBQWlCO0lBNEI1Qix3REFBd0Q7SUFDeEQsSUFDSSxXQUFXLENBQUMsS0FBYTtRQUMzQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7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TixpQkFBaUI7c0JBRGhCLE1BQU07Z0JBS1AsZ0JBQWdCO3NCQURmLE1BQU07Z0JBS0gsV0FBVztzQkFEZCxLQUFLO2dCQXFCTixjQUFjO3NCQURiLEtBQUs7Z0JBUUYsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKlxuICogcGF1c2UgKG5vdCB5ZXQgc3VwcG9ydGVkKSAoP3N0cmluZz0naG92ZXInKSAtIGV2ZW50IGdyb3VwIG5hbWUgd2hpY2ggcGF1c2VzXG4gKiB0aGUgY3ljbGluZyBvZiB0aGUgY2Fyb3VzZWwsIGlmIGhvdmVyIHBhdXNlcyBvbiBtb3VzZWVudGVyIGFuZCByZXN1bWVzIG9uXG4gKiBtb3VzZWxlYXZlIGtleWJvYXJkIChub3QgeWV0IHN1cHBvcnRlZCkgKD9ib29sZWFuPXRydWUpIC0gaWYgZmFsc2VcbiAqIGNhcm91c2VsIHdpbGwgbm90IHJlYWN0IHRvIGtleWJvYXJkIGV2ZW50c1xuICogbm90ZTogc3dpcGluZyBub3QgeWV0IHN1cHBvcnRlZFxuICovXG4vKioqKlxuICogUHJvYmxlbXM6XG4gKiAxKSBpZiB3ZSBzZXQgYW4gYWN0aXZlIHNsaWRlIHZpYSBtb2RlbCBjaGFuZ2VzLCAuYWN0aXZlIGNsYXNzIHJlbWFpbnMgb24gYVxuICogY3VycmVudCBzbGlkZS5cbiAqIDIpIGlmIHdlIGhhdmUgb25seSBvbmUgc2xpZGUsIHdlIHNob3VsZG4ndCBzaG93IHByZXYvbmV4dCBuYXYgYnV0dG9uc1xuICogMykgaWYgZmlyc3Qgb3IgbGFzdCBzbGlkZSBpcyBhY3RpdmUgYW5kIG5vV3JhcCBpcyB0cnVlLCB0aGVyZSBzaG91bGQgYmVcbiAqIFwiZGlzYWJsZWRcIiBjbGFzcyBvbiB0aGUgbmF2IGJ1dHRvbnMuXG4gKiA0KSBkZWZhdWx0IGludGVydmFsIHNob3VsZCBiZSBlcXVhbCA1MDAwXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT3V0cHV0LCBBZnRlclZpZXdJbml0LCBJbmplY3QsIFBMQVRGT1JNX0lEXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIsIE5nSWYsIE5nRm9yLCBOZ1N0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgaXNCczMsIExpbmtlZExpc3QsIGdldEJzVmVyLCBJQnNWZXJzaW9uIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC91dGlscyc7XG5pbXBvcnQgeyBTbGlkZUNvbXBvbmVudCB9IGZyb20gJy4vc2xpZGUuY29tcG9uZW50JztcbmltcG9ydCB7IENhcm91c2VsQ29uZmlnIH0gZnJvbSAnLi9jYXJvdXNlbC5jb25maWcnO1xuaW1wb3J0IHsgZmluZExhc3RJbmRleCwgY2h1bmtCeU51bWJlciwgaXNOdW1iZXIgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFNsaWRlV2l0aEluZGV4LCBJbmRleGVkU2xpZGVMaXN0IH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5leHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICBVTktOT1dOLFxuICBORVhULFxuICBQUkVWXG59XG5cbmxldCBfY3VycmVudElkID0gMTtcblxuLyoqXG4gKiBCYXNlIGVsZW1lbnQgdG8gY3JlYXRlIGNhcm91c2VsXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnY2Fyb3VzZWwnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jYXJvdXNlbC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbTmdJZiwgTmdGb3IsIE5nU3R5bGVdXG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyogSWYgYHRydWVgIOKAlCBjYXJvdXNlbCB3aWxsIG5vdCBjeWNsZSBjb250aW51b3VzbHkgYW5kIHdpbGwgaGF2ZSBoYXJkIHN0b3BzIChwcmV2ZW50IGxvb3BpbmcpICovXG4gIEBJbnB1dCgpIG5vV3JhcCA9IGZhbHNlO1xuICAvKiAgSWYgYHRydWVgIOKAlCB3aWxsIGRpc2FibGUgcGF1c2luZyBvbiBjYXJvdXNlbCBtb3VzZSBob3ZlciAqL1xuICBASW5wdXQoKSBub1BhdXNlID0gZmFsc2U7XG4gIC8qICBJZiBgdHJ1ZWAg4oCUIGNhcm91c2VsLWluZGljYXRvcnMgYXJlIHZpc2libGUgICovXG4gIEBJbnB1dCgpIHNob3dJbmRpY2F0b3JzID0gdHJ1ZTtcbiAgLyogIElmIGB0cnVlYCAtIGF1dG9wbGF5IHdpbGwgYmUgc3RvcHBlZCBvbiBmb2N1cyAqL1xuICBASW5wdXQoKSBwYXVzZU9uRm9jdXMgPSBmYWxzZTtcbiAgLyogSWYgYHRydWVgIC0gY2Fyb3VzZWwgaW5kaWNhdG9ycyBpbmRpY2F0ZSBzbGlkZXMgY2h1bmtzXG4gICAgIHdvcmtzIE9OTFkgaWYgc2luZ2xlU2xpZGVPZmZzZXQgPSBGQUxTRSAqL1xuICBASW5wdXQoKSBpbmRpY2F0b3JzQnlDaHVuayA9IGZhbHNlO1xuICAvKiBJZiB2YWx1ZSBtb3JlIHRoZW4gMSDigJQgY2Fyb3VzZWwgd29ya3MgaW4gbXVsdGlsaXN0IG1vZGUgKi9cbiAgQElucHV0KCkgaXRlbXNQZXJTbGlkZSA9IDE7XG4gIC8qIElmIGB0cnVlYCDigJQgY2Fyb3VzZWwgc2hpZnRzIGJ5IG9uZSBlbGVtZW50LiBCeSBkZWZhdWx0IGNhcm91c2VsIHNoaWZ0cyBieSBudW1iZXJcbiAgICAgb2YgdmlzaWJsZSBlbGVtZW50cyAoaXRlbXNQZXJTbGlkZSBmaWVsZCkgKi9cbiAgQElucHV0KCkgc2luZ2xlU2xpZGVPZmZzZXQgPSBmYWxzZTtcbiAgLyoqIFR1cm4gb24vb2ZmIGFuaW1hdGlvbi4gQW5pbWF0aW9uIGRvZXNuJ3Qgd29yayBmb3IgbXVsdGlsaXN0IGNhcm91c2VsICovXG4gIEBJbnB1dCgpIGlzQW5pbWF0ZWQgPSBmYWxzZTtcblxuICAvKiogV2lsbCBiZSBlbWl0dGVkIHdoZW4gYWN0aXZlIHNsaWRlIGhhcyBiZWVuIGNoYW5nZWQuIFBhcnQgb2YgdHdvLXdheS1iaW5kYWJsZSBbKGFjdGl2ZVNsaWRlKV0gcHJvcGVydHkgKi9cbiAgQE91dHB1dCgpXG4gIGFjdGl2ZVNsaWRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KGZhbHNlKTtcblxuICAvKiogV2lsbCBiZSBlbWl0dGVkIHdoZW4gYWN0aXZlIHNsaWRlcyBoYXMgYmVlbiBjaGFuZ2VkIGluIG11bHRpbGlzdCBtb2RlICovXG4gIEBPdXRwdXQoKVxuICBzbGlkZVJhbmdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXJbXXx2b2lkPigpO1xuXG4gIC8qKiBJbmRleCBvZiBjdXJyZW50bHkgZGlzcGxheWVkIHNsaWRlKHN0YXJ0ZWQgZm9yIDApICovXG4gIEBJbnB1dCgpXG4gIHNldCBhY3RpdmVTbGlkZShpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMubXVsdGlsaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzTnVtYmVyKGluZGV4KSkge1xuICAgICAgdGhpcy5jdXN0b21BY3RpdmVTbGlkZSA9IGluZGV4O1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zbGlkZXMubGVuZ3RoICYmIGluZGV4ICE9PSB0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFjdGl2ZVNsaWRlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRBY3RpdmVTbGlkZSB8fCAwO1xuICB9XG5cbiAgLyogSW5kZXggdG8gc3RhcnQgZGlzcGxheSBzbGlkZXMgZnJvbSBpdCAqL1xuICBASW5wdXQoKVxuICBzdGFydEZyb21JbmRleCA9IDA7XG5cbiAgLyoqXG4gICAqIERlbGF5IG9mIGl0ZW0gY3ljbGluZyBpbiBtaWxsaXNlY29uZHMuIElmIGZhbHNlLCBjYXJvdXNlbCB3b24ndCBjeWNsZVxuICAgKiBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGludGVydmFsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2ludGVydmFsO1xuICB9XG5cbiAgc2V0IGludGVydmFsKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9pbnRlcnZhbCA9IHZhbHVlO1xuICAgIHRoaXMucmVzdGFydFRpbWVyKCk7XG4gIH1cblxuICBnZXQgc2xpZGVzKCk6IFNsaWRlQ29tcG9uZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXMudG9BcnJheSgpO1xuICB9XG5cbiAgZ2V0IGlzRmlyc3RTbGlkZVZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaW5kZXhlcyA9IHRoaXMuZ2V0VmlzaWJsZUluZGV4ZXMoKTtcbiAgICBpZiAoIWluZGV4ZXMgfHwgKGluZGV4ZXMgaW5zdGFuY2VvZiBBcnJheSAmJiAhaW5kZXhlcy5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGV4ZXMuaW5jbHVkZXMoMCk7XG4gIH1cblxuICBnZXQgaXNMYXN0U2xpZGVWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGluZGV4ZXMgPSB0aGlzLmdldFZpc2libGVJbmRleGVzKCk7XG4gICAgaWYgKCFpbmRleGVzIHx8IChpbmRleGVzIGluc3RhbmNlb2YgQXJyYXkgJiYgIWluZGV4ZXMubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBpbmRleGVzLmluY2x1ZGVzKHRoaXMuX3NsaWRlcy5sZW5ndGggLTEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGN1cnJlbnRJbnRlcnZhbD86IG51bWJlcjtcbiAgcHJvdGVjdGVkIF9jdXJyZW50QWN0aXZlU2xpZGU/OiBudW1iZXI7XG4gIHByb3RlY3RlZCBfaW50ZXJ2YWwgPSA1MDAwO1xuICBwcm90ZWN0ZWQgX3NsaWRlczogTGlua2VkTGlzdDxTbGlkZUNvbXBvbmVudD4gPSBuZXcgTGlua2VkTGlzdDxTbGlkZUNvbXBvbmVudD4oKTtcbiAgcHJvdGVjdGVkIF9jaHVua2VkU2xpZGVzPzogU2xpZGVXaXRoSW5kZXhbXVtdO1xuICBwcm90ZWN0ZWQgX3NsaWRlc1dpdGhJbmRleGVzPzogU2xpZGVXaXRoSW5kZXhbXTtcbiAgcHJvdGVjdGVkIF9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID0gMDtcbiAgcHJvdGVjdGVkIGlzUGxheWluZyA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgZGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgY3VzdG9tQWN0aXZlU2xpZGU/OiBudW1iZXI7XG4gIGN1cnJlbnRJZCA9IDA7XG5cbiAgZ2V0IGlzQnM0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhaXNCczMoKTtcbiAgfVxuXG4gIGdldCBfYnNWZXIoKTogSUJzVmVyc2lvbiB7XG4gICAgcmV0dXJuIGdldEJzVmVyKCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENhcm91c2VsQ29uZmlnLCBwcml2YXRlIG5nWm9uZTogTmdab25lLCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwdWJsaWMgcGxhdGZvcm1JZDogbnVtYmVyKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBjb25maWcpO1xuICAgIHRoaXMuY3VycmVudElkID0gX2N1cnJlbnRJZCsrO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2luZ2xlU2xpZGVPZmZzZXQpIHtcbiAgICAgICAgdGhpcy5pbmRpY2F0b3JzQnlDaHVuayA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubXVsdGlsaXN0KSB7XG4gICAgICAgIHRoaXMuX2NodW5rZWRTbGlkZXMgPSBjaHVua0J5TnVtYmVyKFxuICAgICAgICAgIHRoaXMubWFwU2xpZGVzQW5kSW5kZXhlcygpLFxuICAgICAgICAgIHRoaXMuaXRlbXNQZXJTbGlkZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNlbGVjdEluaXRpYWxTbGlkZXMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VzdG9tQWN0aXZlU2xpZGUgJiYgIXRoaXMubXVsdGlsaXN0KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdCh0aGlzLmN1c3RvbUFjdGl2ZVNsaWRlKTtcbiAgICAgIH1cbiAgICB9LCAwKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG5ldyBzbGlkZS4gSWYgdGhpcyBzbGlkZSBpcyBmaXJzdCBpbiBjb2xsZWN0aW9uIC0gc2V0IGl0IGFzIGFjdGl2ZVxuICAgKiBhbmQgc3RhcnRzIGF1dG8gY2hhbmdpbmdcbiAgICogQHBhcmFtIHNsaWRlXG4gICAqL1xuICBhZGRTbGlkZShzbGlkZTogU2xpZGVDb21wb25lbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9zbGlkZXMuYWRkKHNsaWRlKTtcblxuICAgIGlmICh0aGlzLm11bHRpbGlzdCAmJiB0aGlzLl9zbGlkZXMubGVuZ3RoIDw9IHRoaXMuaXRlbXNQZXJTbGlkZSkge1xuICAgICAgc2xpZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubXVsdGlsaXN0ICYmIHRoaXMuaXNBbmltYXRlZCkge1xuICAgICAgc2xpZGUuaXNBbmltYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm11bHRpbGlzdCAmJiB0aGlzLl9zbGlkZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAoIXRoaXMuY3VzdG9tQWN0aXZlU2xpZGUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVTbGlkZSA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tdWx0aWxpc3QgJiYgdGhpcy5fc2xpZGVzLmxlbmd0aCA+IHRoaXMuaXRlbXNQZXJTbGlkZSkge1xuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgc3BlY2lmaWVkIHNsaWRlLiBJZiB0aGlzIHNsaWRlIGlzIGFjdGl2ZSAtIHdpbGwgcm9sbCB0byBhbm90aGVyXG4gICAqIHNsaWRlXG4gICAqIEBwYXJhbSBzbGlkZVxuICAgKi9cbiAgcmVtb3ZlU2xpZGUoc2xpZGU6IFNsaWRlQ29tcG9uZW50KTogdm9pZCB7XG4gICAgY29uc3QgcmVtSW5kZXggPSB0aGlzLl9zbGlkZXMuaW5kZXhPZihzbGlkZSk7XG5cbiAgICBpZiAodGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlID09PSByZW1JbmRleCkge1xuICAgICAgLy8gcmVtb3Zpbmcgb2YgYWN0aXZlIHNsaWRlXG4gICAgICBsZXQgbmV4dFNsaWRlSW5kZXg6IG51bWJlcjtcbiAgICAgIGlmICh0aGlzLl9zbGlkZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyBpZiB0aGlzIHNsaWRlIGxhc3QgLSB3aWxsIHJvbGwgdG8gZmlyc3Qgc2xpZGUsIGlmIG5vV3JhcCBmbGFnIGlzXG4gICAgICAgIC8vIEZBTFNFIG9yIHRvIHByZXZpb3VzLCBpZiBub1dyYXAgaXMgVFJVRSBpbiBjYXNlLCBpZiB0aGlzIHNsaWRlIGluXG4gICAgICAgIC8vIG1pZGRsZSBvZiBjb2xsZWN0aW9uLCBpbmRleCBvZiBuZXh0IHNsaWRlIGlzIHNhbWUgdG8gcmVtb3ZlZFxuICAgICAgICBuZXh0U2xpZGVJbmRleCA9ICF0aGlzLmlzTGFzdChyZW1JbmRleClcbiAgICAgICAgICA/IHJlbUluZGV4XG4gICAgICAgICAgOiB0aGlzLm5vV3JhcCA/IHJlbUluZGV4IC0gMSA6IDA7XG4gICAgICB9XG4gICAgICB0aGlzLl9zbGlkZXMucmVtb3ZlKHJlbUluZGV4KTtcblxuICAgICAgLy8gcHJldmVudHMgZXhjZXB0aW9uIHdpdGggY2hhbmdpbmcgc29tZSB2YWx1ZSBhZnRlciBjaGVja2luZ1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NlbGVjdChuZXh0U2xpZGVJbmRleCk7XG4gICAgICB9LCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2xpZGVzLnJlbW92ZShyZW1JbmRleCk7XG4gICAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHRoaXMuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBhZnRlciByZW1vdmluZywgbmVlZCB0byBhY3R1YWxpemUgaW5kZXggb2YgY3VycmVudCBhY3RpdmUgc2xpZGVcbiAgICAgICAgdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlID0gY3VycmVudFNsaWRlSW5kZXg7XG4gICAgICAgIHRoaXMuYWN0aXZlU2xpZGVDaGFuZ2UuZW1pdCh0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgbmV4dFNsaWRlRnJvbUludGVydmFsKGZvcmNlID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLm1vdmUoRGlyZWN0aW9uLk5FWFQsIGZvcmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSb2xsaW5nIHRvIG5leHQgc2xpZGVcbiAgICogQHBhcmFtIGZvcmNlOiB7Ym9vbGVhbn0gaWYgdHJ1ZSAtIHdpbGwgaWdub3JlIG5vV3JhcCBmbGFnXG4gICAqL1xuICBuZXh0U2xpZGUoZm9yY2UgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgdGhpcy5yZXN0YXJ0VGltZXIoKTtcbiAgICB9XG4gICAgdGhpcy5tb3ZlKERpcmVjdGlvbi5ORVhULCBmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogUm9sbGluZyB0byBwcmV2aW91cyBzbGlkZVxuICAgKiBAcGFyYW0gZm9yY2U6IHtib29sZWFufSBpZiB0cnVlIC0gd2lsbCBpZ25vcmUgbm9XcmFwIGZsYWdcbiAgICovXG4gIHByZXZpb3VzU2xpZGUoZm9yY2UgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgdGhpcy5yZXN0YXJ0VGltZXIoKTtcbiAgICB9XG4gICAgdGhpcy5tb3ZlKERpcmVjdGlvbi5QUkVWLCBmb3JjZSk7XG4gIH1cblxuICBnZXRGaXJzdFZpc2libGVJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNsaWRlcy5maW5kSW5kZXgodGhpcy5nZXRBY3RpdmUpO1xuICB9XG5cbiAgZ2V0TGFzdFZpc2libGVJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiBmaW5kTGFzdEluZGV4KHRoaXMuc2xpZGVzLCB0aGlzLmdldEFjdGl2ZSk7XG4gIH1cblxuICBnZXRBY3RpdmUgPSAoc2xpZGU6IFNsaWRlQ29tcG9uZW50KSA9PiBzbGlkZS5hY3RpdmU7XG5cbiAgbW92ZShkaXJlY3Rpb246IERpcmVjdGlvbiwgZm9yY2UgPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IGZpcnN0VmlzaWJsZUluZGV4ID0gdGhpcy5nZXRGaXJzdFZpc2libGVJbmRleCgpO1xuICAgIGNvbnN0IGxhc3RWaXNpYmxlSW5kZXggPSB0aGlzLmdldExhc3RWaXNpYmxlSW5kZXgoKTtcblxuICAgIGlmICh0aGlzLm5vV3JhcCkge1xuICAgICAgaWYgKFxuICAgICAgICBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5ORVhUICYmXG4gICAgICAgIHRoaXMuaXNMYXN0KGxhc3RWaXNpYmxlSW5kZXgpIHx8XG4gICAgICAgIGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlBSRVYgJiZcbiAgICAgICAgZmlyc3RWaXNpYmxlSW5kZXggPT09IDBcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm11bHRpbGlzdCkge1xuICAgICAgdGhpcy5hY3RpdmVTbGlkZSA9IHRoaXMuZmluZE5leHRTbGlkZUluZGV4KGRpcmVjdGlvbiwgZm9yY2UpIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW92ZU11bHRpbGlzdChkaXJlY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTd2l0aCBzbGlkZXMgYnkgZW50ZXIsIHNwYWNlIGFuZCBhcnJvd3Mga2V5c1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGtleWRvd25QcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMyB8fCBldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMzIgfHwgZXZlbnQua2V5ID09PSAnU3BhY2UnKSB7XG4gICAgICB0aGlzLm5leHRTbGlkZSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNyB8fCBldmVudC5rZXkgPT09ICdMZWZ0QXJyb3cnKSB7XG4gICAgICB0aGlzLnByZXZpb3VzU2xpZGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSB8fCBldmVudC5rZXkgPT09ICdSaWdodEFycm93Jykge1xuICAgICAgdGhpcy5uZXh0U2xpZGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbGF5IG9uIG1vdXNlIGxlYXZlXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wYXVzZU9uRm9jdXMpIHtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbGF5IG9uIG1vdXNlIHVwXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb25Nb3VzZVVwKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wYXVzZU9uRm9jdXMpIHtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHNsaWRlcyBvbiBmb2N1cyBhdXRvcGxheSBpcyBzdG9wcGVkKG9wdGlvbmFsKVxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHBhdXNlRm9jdXNJbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYXVzZU9uRm9jdXMpIHtcbiAgICAgIHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlc2V0VGltZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBzbGlkZXMgb3V0IG9mIGZvY3VzIGF1dG9wbGF5IGlzIHN0YXJ0ZWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwYXVzZUZvY3VzT3V0KCk6IHZvaWQge1xuICAgIHRoaXMucGxheSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvbGxpbmcgdG8gc3BlY2lmaWVkIHNsaWRlXG4gICAqIEBwYXJhbSBpbmRleDoge251bWJlcn0gaW5kZXggb2Ygc2xpZGUsIHdoaWNoIG11c3QgYmUgc2hvd25cbiAgICovXG4gIHNlbGVjdFNsaWRlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHRoaXMucmVzdGFydFRpbWVyKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm11bHRpbGlzdCkge1xuICAgICAgdGhpcy5hY3RpdmVTbGlkZSA9IHRoaXMuaW5kaWNhdG9yc0J5Q2h1bmsgPyBpbmRleCAqIHRoaXMuaXRlbXNQZXJTbGlkZSA6IGluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdFNsaWRlUmFuZ2UodGhpcy5pbmRpY2F0b3JzQnlDaHVuayA/IGluZGV4ICogdGhpcy5pdGVtc1BlclNsaWRlIDogaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgYSBhdXRvIGNoYW5naW5nIG9mIHNsaWRlc1xuICAgKi9cbiAgcGxheSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICB0aGlzLnJlc3RhcnRUaW1lcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyBhIGF1dG8gY2hhbmdpbmcgb2Ygc2xpZGVzXG4gICAqL1xuICBwYXVzZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubm9QYXVzZSkge1xuICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVzZXRUaW1lcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgcmV0dXJucyBpbmRleCBvZiBjdXJyZW50bHkgZGlzcGxheWVkIHNsaWRlXG4gICAqL1xuICBnZXRDdXJyZW50U2xpZGVJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXMuZmluZEluZGV4KHRoaXMuZ2V0QWN0aXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzLCB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgaW5kZXggaXMgbGFzdCBpbiBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBpbmRleFxuICAgKi9cbiAgaXNMYXN0KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggKyAxID49IHRoaXMuX3NsaWRlcy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcywgd2hldGhlciB0aGUgc3BlY2lmaWVkIGluZGV4IGlzIGZpcnN0IGluIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBpc0ZpcnN0KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggPT09IDA7XG4gIH1cblxuICBpbmRpY2F0b3JzU2xpZGVzKCk6IFNsaWRlQ29tcG9uZW50W10ge1xuICAgIHJldHVybiB0aGlzLnNsaWRlcy5maWx0ZXIoXG4gICAgICAoc2xpZGU6IFNsaWRlQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKSA9PiAhdGhpcy5pbmRpY2F0b3JzQnlDaHVuayB8fCBpbmRleCAlIHRoaXMuaXRlbXNQZXJTbGlkZSA9PT0gMFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdEluaXRpYWxTbGlkZXMoKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMuc3RhcnRGcm9tSW5kZXggPD0gdGhpcy5fc2xpZGVzLmxlbmd0aFxuICAgICAgPyB0aGlzLnN0YXJ0RnJvbUluZGV4XG4gICAgICA6IDA7XG5cbiAgICB0aGlzLmhpZGVTbGlkZXMoKTtcblxuICAgIGlmICh0aGlzLnNpbmdsZVNsaWRlT2Zmc2V0KSB7XG4gICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyA9IHRoaXMubWFwU2xpZGVzQW5kSW5kZXhlcygpO1xuXG4gICAgICBpZiAodGhpcy5fc2xpZGVzLmxlbmd0aCAtIHN0YXJ0SW5kZXggPCB0aGlzLml0ZW1zUGVyU2xpZGUpIHtcbiAgICAgICAgY29uc3Qgc2xpZGVzVG9BcHBlbmQgPSB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcy5zbGljZSgwLCBzdGFydEluZGV4KTtcblxuICAgICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyA9IFtcbiAgICAgICAgICAuLi50aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyxcbiAgICAgICAgICAuLi5zbGlkZXNUb0FwcGVuZFxuICAgICAgICBdXG4gICAgICAgICAgLnNsaWNlKHNsaWRlc1RvQXBwZW5kLmxlbmd0aClcbiAgICAgICAgICAuc2xpY2UoMCwgdGhpcy5pdGVtc1BlclNsaWRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzID0gdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMuc2xpY2UoXG4gICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICBzdGFydEluZGV4ICsgdGhpcy5pdGVtc1BlclNsaWRlXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzLmZvckVhY2goKHNsaWRlOiBTbGlkZVdpdGhJbmRleCkgPT4gc2xpZGUuaXRlbS5hY3RpdmUgPSB0cnVlKTtcbiAgICAgIHRoaXMubWFrZVNsaWRlc0NvbnNpc3RlbnQodGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdFJhbmdlQnlOZXN0ZWRJbmRleChzdGFydEluZGV4KTtcbiAgICB9XG5cbiAgICB0aGlzLnNsaWRlUmFuZ2VDaGFuZ2UuZW1pdCh0aGlzLmdldFZpc2libGVJbmRleGVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgbmV4dCBzbGlkZSBpbmRleCwgZGVwZW5kaW5nIG9mIGRpcmVjdGlvblxuICAgKiBAcGFyYW0gZGlyZWN0aW9uOiBEaXJlY3Rpb24oVU5LTk9XTnxQUkVWfE5FWFQpXG4gICAqIEBwYXJhbSBmb3JjZToge2Jvb2xlYW59IGlmIFRSVUUgLSB3aWxsIGlnbm9yZSBub1dyYXAgZmxhZywgZWxzZSB3aWxsXG4gICAqICAgcmV0dXJuIHVuZGVmaW5lZCBpZiBuZXh0IHNsaWRlIHJlcXVpcmUgd3JhcHBpbmdcbiAgICovXG4gIHByaXZhdGUgZmluZE5leHRTbGlkZUluZGV4KGRpcmVjdGlvbjogRGlyZWN0aW9uLCBmb3JjZTogYm9vbGVhbik6IG51bWJlciB8IHZvaWQge1xuICAgIGxldCBuZXh0U2xpZGVJbmRleCA9IDA7XG5cbiAgICBpZiAoXG4gICAgICAhZm9yY2UgJiZcbiAgICAgICh0aGlzLmlzTGFzdCh0aGlzLmFjdGl2ZVNsaWRlKSAmJlxuICAgICAgICBkaXJlY3Rpb24gIT09IERpcmVjdGlvbi5QUkVWICYmXG4gICAgICAgIHRoaXMubm9XcmFwKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIERpcmVjdGlvbi5ORVhUOlxuICAgICAgICAvLyBpZiB0aGlzIGlzIGxhc3Qgc2xpZGUsIG5vdCBmb3JjZSwgbG9vcGluZyBpcyBkaXNhYmxlZFxuICAgICAgICAvLyBhbmQgbmVlZCB0byBnb2luZyBmb3J3YXJkIC0gc2VsZWN0IGN1cnJlbnQgc2xpZGUsIGFzIGEgbmV4dFxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2N1cnJlbnRBY3RpdmVTbGlkZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBuZXh0U2xpZGVJbmRleCA9IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzTGFzdCh0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUpKSB7XG4gICAgICAgICAgbmV4dFNsaWRlSW5kZXggPSB0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5leHRTbGlkZUluZGV4ID0gIWZvcmNlICYmIHRoaXMubm9XcmFwID8gdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlIDogMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERpcmVjdGlvbi5QUkVWOlxuICAgICAgICAvLyBpZiB0aGlzIGlzIGZpcnN0IHNsaWRlLCBub3QgZm9yY2UsIGxvb3BpbmcgaXMgZGlzYWJsZWRcbiAgICAgICAgLy8gYW5kIG5lZWQgdG8gZ29pbmcgYmFja3dhcmQgLSBzZWxlY3QgY3VycmVudCBzbGlkZSwgYXMgYSBuZXh0XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG5leHRTbGlkZUluZGV4ID0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlID4gMCkge1xuICAgICAgICAgIG5leHRTbGlkZUluZGV4ID0gdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlIC0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMubm9XcmFwKSB7XG4gICAgICAgICAgbmV4dFNsaWRlSW5kZXggPSB0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dFNsaWRlSW5kZXggPSB0aGlzLl9zbGlkZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZGlyZWN0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRTbGlkZUluZGV4O1xuICB9XG5cbiAgcHJpdmF0ZSBtYXBTbGlkZXNBbmRJbmRleGVzKCk6IFNsaWRlV2l0aEluZGV4W10ge1xuICAgIHJldHVybiB0aGlzLnNsaWRlc1xuICAgICAgLnNsaWNlKClcbiAgICAgIC5tYXAoKHNsaWRlOiBTbGlkZUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGluZGV4LFxuICAgICAgICAgIGl0ZW06IHNsaWRlXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBzZWxlY3RTbGlkZVJhbmdlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0luZGV4SW5SYW5nZShpbmRleCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGVTbGlkZXMoKTtcblxuICAgIGlmICghdGhpcy5zaW5nbGVTbGlkZU9mZnNldCkge1xuICAgICAgdGhpcy5zZWxlY3RSYW5nZUJ5TmVzdGVkSW5kZXgoaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5pc0luZGV4T25UaGVFZGdlcyhpbmRleClcbiAgICAgICAgPyBpbmRleFxuICAgICAgICA6IGluZGV4IC0gdGhpcy5pdGVtc1BlclNsaWRlICsgMTtcblxuICAgICAgY29uc3QgZW5kSW5kZXggPSB0aGlzLmlzSW5kZXhPblRoZUVkZ2VzKGluZGV4KVxuICAgICAgICA/IGluZGV4ICsgdGhpcy5pdGVtc1BlclNsaWRlXG4gICAgICAgIDogaW5kZXggKyAxO1xuXG4gICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyA9IHRoaXMubWFwU2xpZGVzQW5kSW5kZXhlcygpLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcbiAgICAgIHRoaXMubWFrZVNsaWRlc0NvbnNpc3RlbnQodGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMpO1xuXG4gICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcy5mb3JFYWNoKChzbGlkZTogU2xpZGVXaXRoSW5kZXgpID0+IHNsaWRlLml0ZW0uYWN0aXZlID0gdHJ1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zbGlkZVJhbmdlQ2hhbmdlLmVtaXQodGhpcy5nZXRWaXNpYmxlSW5kZXhlcygpKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VsZWN0UmFuZ2VCeU5lc3RlZEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2NodW5rZWRTbGlkZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZFJhbmdlID0gdGhpcy5fY2h1bmtlZFNsaWRlc1xuICAgICAgLm1hcCgoc2xpZGVzTGlzdCwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGlzdDogc2xpZGVzTGlzdFxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC5maW5kKFxuICAgICAgICAoc2xpZGVzTGlzdDogSW5kZXhlZFNsaWRlTGlzdCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzbGlkZXNMaXN0Lmxpc3QuZmluZChzbGlkZSA9PiBzbGlkZS5pbmRleCA9PT0gaW5kZXgpICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICBpZiAoIXNlbGVjdGVkUmFuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID0gc2VsZWN0ZWRSYW5nZS5pbmRleDtcblxuICAgIHRoaXMuX2NodW5rZWRTbGlkZXNbc2VsZWN0ZWRSYW5nZS5pbmRleF0uZm9yRWFjaCgoc2xpZGU6IFNsaWRlV2l0aEluZGV4KSA9PiB7XG4gICAgICBzbGlkZS5pdGVtLmFjdGl2ZSA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGlzSW5kZXhPblRoZUVkZ2VzKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgaW5kZXggKyAxIC0gdGhpcy5pdGVtc1BlclNsaWRlIDw9IDAgfHxcbiAgICAgIGluZGV4ICsgdGhpcy5pdGVtc1BlclNsaWRlIDw9IHRoaXMuX3NsaWRlcy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0luZGV4SW5SYW5nZShpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuc2luZ2xlU2xpZGVPZmZzZXQgJiYgdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMpIHtcbiAgICAgIGNvbnN0IHZpc2libGVJbmRleGVzID0gdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMubWFwKChzbGlkZTogU2xpZGVXaXRoSW5kZXgpID0+IHNsaWRlLmluZGV4KTtcblxuICAgICAgcmV0dXJuIHZpc2libGVJbmRleGVzLmluZGV4T2YoaW5kZXgpID49IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIGluZGV4IDw9IHRoaXMuZ2V0TGFzdFZpc2libGVJbmRleCgpICYmXG4gICAgICBpbmRleCA+PSB0aGlzLmdldEZpcnN0VmlzaWJsZUluZGV4KClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlU2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzLmZvckVhY2goKHNsaWRlOiBTbGlkZUNvbXBvbmVudCkgPT4gc2xpZGUuYWN0aXZlID0gZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1Zpc2libGVTbGlkZUxpc3RMYXN0KCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5fY2h1bmtlZFNsaWRlcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID09PSB0aGlzLl9jaHVua2VkU2xpZGVzLmxlbmd0aCAtIDE7XG4gIH1cblxuICBwcml2YXRlIGlzVmlzaWJsZVNsaWRlTGlzdEZpcnN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID09PSAwO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlU2xpZGVyQnlPbmVJdGVtKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XG4gICAgbGV0IGZpcnN0VmlzaWJsZUluZGV4OiBudW1iZXI7XG4gICAgbGV0IGxhc3RWaXNpYmxlSW5kZXg6IG51bWJlcjtcbiAgICBsZXQgaW5kZXhUb0hpZGU6IG51bWJlcjtcbiAgICBsZXQgaW5kZXhUb1Nob3c6IG51bWJlcjtcblxuICAgIGlmICh0aGlzLm5vV3JhcCkge1xuICAgICAgZmlyc3RWaXNpYmxlSW5kZXggPSB0aGlzLmdldEZpcnN0VmlzaWJsZUluZGV4KCk7XG4gICAgICBsYXN0VmlzaWJsZUluZGV4ID0gdGhpcy5nZXRMYXN0VmlzaWJsZUluZGV4KCk7XG5cbiAgICAgIGluZGV4VG9IaWRlID0gZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uTkVYVFxuICAgICAgICA/IGZpcnN0VmlzaWJsZUluZGV4XG4gICAgICAgIDogbGFzdFZpc2libGVJbmRleDtcblxuICAgICAgaW5kZXhUb1Nob3cgPSBkaXJlY3Rpb24gIT09IERpcmVjdGlvbi5ORVhUXG4gICAgICAgID8gZmlyc3RWaXNpYmxlSW5kZXggLSAxXG4gICAgICAgIDogIXRoaXMuaXNMYXN0KGxhc3RWaXNpYmxlSW5kZXgpXG4gICAgICAgICAgPyBsYXN0VmlzaWJsZUluZGV4ICsgMSA6IDA7XG5cbiAgICAgIGNvbnN0IHNsaWRlVG9IaWRlID0gdGhpcy5fc2xpZGVzLmdldChpbmRleFRvSGlkZSk7XG4gICAgICBpZiAoc2xpZGVUb0hpZGUpIHtcbiAgICAgICAgc2xpZGVUb0hpZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNsaWRlVG9TaG93ID0gdGhpcy5fc2xpZGVzLmdldChpbmRleFRvU2hvdyk7XG4gICAgICBpZiAoc2xpZGVUb1Nob3cpIHtcbiAgICAgICAgc2xpZGVUb1Nob3cuYWN0aXZlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2xpZGVzVG9SZW9yZGVyID0gdGhpcy5tYXBTbGlkZXNBbmRJbmRleGVzKCkuZmlsdGVyKFxuICAgICAgICAoc2xpZGU6IFNsaWRlV2l0aEluZGV4KSA9PiBzbGlkZS5pdGVtLmFjdGl2ZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5tYWtlU2xpZGVzQ29uc2lzdGVudChzbGlkZXNUb1Jlb3JkZXIpO1xuICAgICAgaWYgKHRoaXMuc2luZ2xlU2xpZGVPZmZzZXQpIHtcbiAgICAgICAgdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMgPSBzbGlkZXNUb1Jlb3JkZXI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2xpZGVSYW5nZUNoYW5nZS5lbWl0KHRoaXMuZ2V0VmlzaWJsZUluZGV4ZXMoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyB8fCAhdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXNbMF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXg6IG51bWJlcjtcblxuICAgIGZpcnN0VmlzaWJsZUluZGV4ID0gdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXNbMF0uaW5kZXg7XG4gICAgbGFzdFZpc2libGVJbmRleCA9IHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzW3RoaXMuX3NsaWRlc1dpdGhJbmRleGVzLmxlbmd0aCAtIDFdLmluZGV4O1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLk5FWFQpIHtcbiAgICAgIHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzLnNoaWZ0KCk7XG5cbiAgICAgIGluZGV4ID0gdGhpcy5pc0xhc3QobGFzdFZpc2libGVJbmRleClcbiAgICAgICAgPyAwXG4gICAgICAgIDogbGFzdFZpc2libGVJbmRleCArIDE7XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9zbGlkZXMuZ2V0KGluZGV4KTtcblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMucHVzaCh7IGluZGV4LCBpdGVtIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcy5wb3AoKTtcbiAgICAgIGluZGV4ID0gdGhpcy5pc0ZpcnN0KGZpcnN0VmlzaWJsZUluZGV4KVxuICAgICAgICA/IHRoaXMuX3NsaWRlcy5sZW5ndGggLSAxXG4gICAgICAgIDogZmlyc3RWaXNpYmxlSW5kZXggLSAxO1xuXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5fc2xpZGVzLmdldChpbmRleCk7XG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICB0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcyA9IFt7IGluZGV4LCBpdGVtIH0sIC4uLnRoaXMuX3NsaWRlc1dpdGhJbmRleGVzXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhpZGVTbGlkZXMoKTtcblxuICAgIHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzLmZvckVhY2goc2xpZGUgPT4gc2xpZGUuaXRlbS5hY3RpdmUgPSB0cnVlKTtcbiAgICB0aGlzLm1ha2VTbGlkZXNDb25zaXN0ZW50KHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzKTtcblxuICAgIHRoaXMuc2xpZGVSYW5nZUNoYW5nZS5lbWl0KFxuICAgICAgdGhpcy5fc2xpZGVzV2l0aEluZGV4ZXMubWFwKChzbGlkZTogU2xpZGVXaXRoSW5kZXgpID0+IHNsaWRlLmluZGV4KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIG1ha2VTbGlkZXNDb25zaXN0ZW50ID0gKHNsaWRlczogU2xpZGVXaXRoSW5kZXhbXSk6IHZvaWQgPT4ge1xuICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZTogU2xpZGVXaXRoSW5kZXgsIGluZGV4OiBudW1iZXIpID0+IHNsaWRlLml0ZW0ub3JkZXIgPSBpbmRleCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBtb3ZlTXVsdGlsaXN0KGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2luZ2xlU2xpZGVPZmZzZXQpIHtcbiAgICAgIHRoaXMubW92ZVNsaWRlckJ5T25lSXRlbShkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGVTbGlkZXMoKTtcblxuICAgICAgaWYgKHRoaXMubm9XcmFwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRWaXNpYmxlU2xpZGVzSW5kZXggPSBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5ORVhUXG4gICAgICAgICAgPyB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ICsgMVxuICAgICAgICAgIDogdGhpcy5fY3VycmVudFZpc2libGVTbGlkZXNJbmRleCAtIDE7XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLk5FWFQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFZpc2libGVTbGlkZXNJbmRleCA9IHRoaXMuaXNWaXNpYmxlU2xpZGVMaXN0TGFzdCgpXG4gICAgICAgICAgPyAwXG4gICAgICAgICAgOiB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZVNsaWRlTGlzdEZpcnN0KCkpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID0gdGhpcy5fY2h1bmtlZFNsaWRlc1xuICAgICAgICAgICAgPyB0aGlzLl9jaHVua2VkU2xpZGVzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIDogMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4ID0gdGhpcy5fY3VycmVudFZpc2libGVTbGlkZXNJbmRleCAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2NodW5rZWRTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5fY2h1bmtlZFNsaWRlc1t0aGlzLl9jdXJyZW50VmlzaWJsZVNsaWRlc0luZGV4XS5mb3JFYWNoKFxuICAgICAgICAgIChzbGlkZTogU2xpZGVXaXRoSW5kZXgpID0+IHNsaWRlLml0ZW0uYWN0aXZlID0gdHJ1ZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5zbGlkZVJhbmdlQ2hhbmdlLmVtaXQodGhpcy5nZXRWaXNpYmxlSW5kZXhlcygpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFZpc2libGVJbmRleGVzKCk6IG51bWJlcltdIHwgdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNpbmdsZVNsaWRlT2Zmc2V0ICYmIHRoaXMuX2NodW5rZWRTbGlkZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jaHVua2VkU2xpZGVzW3RoaXMuX2N1cnJlbnRWaXNpYmxlU2xpZGVzSW5kZXhdXG4gICAgICAgIC5tYXAoKHNsaWRlOiBTbGlkZVdpdGhJbmRleCkgPT4gc2xpZGUuaW5kZXgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zbGlkZXNXaXRoSW5kZXhlcykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlc1dpdGhJbmRleGVzLm1hcCgoc2xpZGU6IFNsaWRlV2l0aEluZGV4KSA9PiBzbGlkZS5pbmRleCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBzbGlkZSwgd2hpY2ggc3BlY2lmaWVkIHRocm91Z2ggaW5kZXgsIGFzIGFjdGl2ZVxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHByaXZhdGUgX3NlbGVjdChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm11bHRpbGlzdCAmJiB0eXBlb2YgdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgY3VycmVudFNsaWRlID0gdGhpcy5fc2xpZGVzLmdldCh0aGlzLl9jdXJyZW50QWN0aXZlU2xpZGUpO1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50U2xpZGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGN1cnJlbnRTbGlkZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBuZXh0U2xpZGUgPSB0aGlzLl9zbGlkZXMuZ2V0KGluZGV4KTtcblxuICAgIGlmICh0eXBlb2YgbmV4dFNsaWRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fY3VycmVudEFjdGl2ZVNsaWRlID0gaW5kZXg7XG4gICAgICBuZXh0U2xpZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWN0aXZlU2xpZGUgPSBpbmRleDtcbiAgICAgIHRoaXMuYWN0aXZlU2xpZGVDaGFuZ2UuZW1pdChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyBsb29wIG9mIGF1dG8gY2hhbmdpbmcgb2Ygc2xpZGVzXG4gICAqL1xuICBwcml2YXRlIHJlc3RhcnRUaW1lcigpIHtcbiAgICB0aGlzLnJlc2V0VGltZXIoKTtcbiAgICBjb25zdCBpbnRlcnZhbCA9ICt0aGlzLmludGVydmFsO1xuICAgIGlmICghaXNOYU4oaW50ZXJ2YWwpICYmIGludGVydmFsID4gMCAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbnRlcnZhbCA9IHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBuSW50ZXJ2YWwgPSArdGhpcy5pbnRlcnZhbDtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzLmlzUGxheWluZyAmJlxuICAgICAgICAgICAgICAhaXNOYU4odGhpcy5pbnRlcnZhbCkgJiZcbiAgICAgICAgICAgICAgbkludGVydmFsID4gMCAmJlxuICAgICAgICAgICAgICB0aGlzLnNsaWRlcy5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aGlzLm5leHRTbGlkZUZyb21JbnRlcnZhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBpbnRlcnZhbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXQgbXVsdGlsaXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zUGVyU2xpZGUgPiAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3BzIGxvb3Agb2YgYXV0byBjaGFuZ2luZyBvZiBzbGlkZXNcbiAgICovXG4gIHByaXZhdGUgcmVzZXRUaW1lcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jdXJyZW50SW50ZXJ2YWwpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jdXJyZW50SW50ZXJ2YWwpO1xuICAgICAgdGhpcy5jdXJyZW50SW50ZXJ2YWwgPSB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tEaXNhYmxlZENsYXNzKGJ1dHRvblR5cGU6ICdwcmV2JyB8ICduZXh0Jyk6IGJvb2xlYW4ge1xuICAgIGlmIChidXR0b25UeXBlID09PSAncHJldicpIHtcbiAgICAgIHJldHVybiAodGhpcy5hY3RpdmVTbGlkZSA9PT0gMCAmJiB0aGlzLm5vV3JhcCAmJiAhdGhpcy5tdWx0aWxpc3QpIHx8ICh0aGlzLmlzRmlyc3RTbGlkZVZpc2libGUgJiYgdGhpcy5ub1dyYXAgJiYgdGhpcy5tdWx0aWxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5pc0xhc3QodGhpcy5hY3RpdmVTbGlkZSkgJiYgdGhpcy5ub1dyYXAgJiYgIXRoaXMubXVsdGlsaXN0KSB8fCAodGhpcy5pc0xhc3RTbGlkZVZpc2libGUgJiYgdGhpcy5ub1dyYXAgJiYgdGhpcy5tdWx0aWxpc3QpO1xuICB9XG59XG4iLCI8ZGl2IChtb3VzZWVudGVyKT1cInBhdXNlKClcIlxuICAgICAobW91c2VsZWF2ZSk9XCJvbk1vdXNlTGVhdmUoKVwiXG4gICAgIChtb3VzZXVwKT1cIm9uTW91c2VVcCgpXCJcbiAgICAgKGtleWRvd24pPVwia2V5ZG93blByZXNzKCRldmVudClcIlxuICAgICAoZm9jdXNpbik9XCJwYXVzZUZvY3VzSW4oKVwiXG4gICAgIChmb2N1c291dCk9XCJwYXVzZUZvY3VzT3V0KClcIlxuICAgICBbaWRdPVwiJ2Nhcm91c2VsJyArIGN1cnJlbnRJZFwiXG4gICAgIGNsYXNzPVwiY2Fyb3VzZWwgc2xpZGVcIiB0YWJpbmRleD1cIjBcIj5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFfYnNWZXIuaXNCczUgJiYgc2hvd0luZGljYXRvcnMgJiYgc2xpZGVzLmxlbmd0aCA+IDFcIj5cbiAgICA8b2wgY2xhc3M9XCJjYXJvdXNlbC1pbmRpY2F0b3JzXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IHNsaWRlIG9mIGluZGljYXRvcnNTbGlkZXMoKTsgbGV0IGkgPSBpbmRleDtcIlxuICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwic2xpZGUuYWN0aXZlID09PSB0cnVlXCJcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0U2xpZGUoaSlcIj5cbiAgICAgIDwvbGk+XG4gICAgPC9vbD5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJfYnNWZXIuaXNCczUgJiYgc2hvd0luZGljYXRvcnMgJiYgc2xpZGVzLmxlbmd0aCA+IDFcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaW5kaWNhdG9yc1wiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICAqbmdGb3I9XCJsZXQgc2xpZGUgb2YgaW5kaWNhdG9yc1NsaWRlcygpOyBsZXQgaSA9IGluZGV4O1wiXG4gICAgICAgIFtjbGFzcy5hY3RpdmVdPVwic2xpZGUuYWN0aXZlID09PSB0cnVlXCJcbiAgICAgICAgKGNsaWNrKT1cInNlbGVjdFNsaWRlKGkpXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIFthdHRyLmRhdGEtYnMtdGFyZ2V0XT1cIicjY2Fyb3VzZWwnICsgY3VycmVudElkXCJcbiAgICAgICAgW2F0dHIuZGF0YS1icy1zbGlkZS10b109XCJpXCIgYXJpYS1jdXJyZW50PVwidHJ1ZVwiXG4gICAgICA+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxkaXYgY2xhc3M9XCJjYXJvdXNlbC1pbm5lclwiIFtuZ1N0eWxlXT1cInsnZGlzcGxheSc6IG11bHRpbGlzdCA/ICdmbGV4JyA6ICdibG9jayd9XCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbiAgPGEgY2xhc3M9XCJsZWZ0IGNhcm91c2VsLWNvbnRyb2wgY2Fyb3VzZWwtY29udHJvbC1wcmV2XCJcbiAgICAgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIlxuICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiY2hlY2tEaXNhYmxlZENsYXNzKCdwcmV2JylcIlxuICAgICBbYXR0ci5kYXRhLWJzLXRhcmdldF09XCInI2Nhcm91c2VsJyArIGN1cnJlbnRJZFwiXG4gICAgICpuZ0lmPVwic2xpZGVzLmxlbmd0aCA+IDFcIlxuICAgICAoY2xpY2spPVwicHJldmlvdXNTbGlkZSgpXCJcbiAgICAgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiPlxuICAgIDxzcGFuIGNsYXNzPVwiaWNvbi1wcmV2IGNhcm91c2VsLWNvbnRyb2wtcHJldi1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwic3Itb25seSB2aXN1YWxseS1oaWRkZW5cIj5QcmV2aW91czwvc3Bhbj5cbiAgPC9hPlxuICA8YSBjbGFzcz1cInJpZ2h0IGNhcm91c2VsLWNvbnRyb2wgY2Fyb3VzZWwtY29udHJvbC1uZXh0XCJcbiAgICAgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIlxuICAgICAqbmdJZj1cInNsaWRlcy5sZW5ndGggPiAxXCJcbiAgICAgKGNsaWNrKT1cIm5leHRTbGlkZSgpXCJcbiAgICAgW2NsYXNzLmRpc2FibGVkXT1cImNoZWNrRGlzYWJsZWRDbGFzcygnbmV4dCcpXCJcbiAgICAgW2F0dHIuZGF0YS1icy10YXJnZXRdPVwiJyNjYXJvdXNlbCcgKyBjdXJyZW50SWRcIlxuICAgICB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJpY29uLW5leHQgY2Fyb3VzZWwtY29udHJvbC1uZXh0LWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5IHZpc3VhbGx5LWhpZGRlblwiPk5leHQ8L3NwYW4+XG4gIDwvYT5cbjwvZGl2PlxuIl19