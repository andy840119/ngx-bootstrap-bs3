import { findCommonOffsetParent } from './findCommonOffsetParent';
import { getFixedPositionOffsetParent } from './getFixedPositionOffsetParent';
import { getOffsetRectRelativeToArbitraryNode } from './getOffsetRectRelativeToArbitraryNode';
import { getParentNode } from './getParentNode';
import { getScrollParent } from './getScrollParent';
import { getViewportOffsetRectRelativeToArtbitraryNode } from './getViewportOffsetRectRelativeToArtbitraryNode';
import { getWindowSizes } from './getWindowSizes';
import { isFixed } from './isFixed';
import { isNumber } from './isNumeric';
export function getBoundaries(target, host, padding = 0, boundariesElement, fixedPosition = false) {
    // NOTE: 1 DOM access here
    let boundaries = { top: 0, left: 0 };
    const offsetParent = fixedPosition ? getFixedPositionOffsetParent(target) : findCommonOffsetParent(target, host);
    // Handle viewport case
    if (boundariesElement === 'viewport') {
        boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    }
    else {
        // Handle other cases based on DOM element used as boundaries
        let boundariesNode;
        if (boundariesElement === 'scrollParent') {
            boundariesNode = getScrollParent(getParentNode(host));
            if (boundariesNode.nodeName === 'BODY') {
                boundariesNode = target.ownerDocument.documentElement;
            }
        }
        else if (boundariesElement === 'window') {
            boundariesNode = target.ownerDocument.documentElement;
        }
        else {
            boundariesNode = boundariesElement;
        }
        const offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);
        // In case of HTML, we need a different computation
        if (offsets && boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
            const { height, width } = getWindowSizes(target.ownerDocument);
            if (isNumber(boundaries.top) && isNumber(offsets.top) && isNumber(offsets.marginTop)) {
                boundaries.top += offsets.top - offsets.marginTop;
            }
            if (isNumber(boundaries.top)) {
                boundaries.bottom = Number(height) + Number(offsets.top);
            }
            if (isNumber(boundaries.left) && isNumber(offsets.left) && isNumber(offsets.marginLeft)) {
                boundaries.left += offsets.left - offsets.marginLeft;
            }
            if (isNumber(boundaries.top)) {
                boundaries.right = Number(width) + Number(offsets.left);
            }
        }
        else if (offsets) {
            // for all the other DOM elements, this one is good
            boundaries = offsets;
        }
    }
    // Add paddings
    if (isNumber(boundaries.left)) {
        boundaries.left += padding;
    }
    if (isNumber(boundaries.top)) {
        boundaries.top += padding;
    }
    if (isNumber(boundaries.right)) {
        boundaries.right -= padding;
    }
    if (isNumber(boundaries.bottom)) {
        boundaries.bottom -= padding;
    }
    return boundaries;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Qm91bmRhcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3NpdGlvbmluZy91dGlscy9nZXRCb3VuZGFyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzlGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLDZDQUE2QyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDaEgsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV2QyxNQUFNLFVBQVUsYUFBYSxDQUMzQixNQUFtQixFQUNuQixJQUFpQixFQUNqQixPQUFPLEdBQUcsQ0FBQyxFQUNYLGlCQUF5QixFQUN6QixhQUFhLEdBQUcsS0FBSztJQUVyQiwwQkFBMEI7SUFFMUIsSUFBSSxVQUFVLEdBQXFCLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDdkQsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWpILHVCQUF1QjtJQUN2QixJQUFJLGlCQUFpQixLQUFLLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLFVBQVUsR0FB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QUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDaEMsVUFBVSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbXB1dGVkIHRoZSBib3VuZGFyaWVzIGxpbWl0cyBhbmQgcmV0dXJuIHRoZW1cbiAqL1xuaW1wb3J0IHsgT2Zmc2V0cyB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50IH0gZnJvbSAnLi9maW5kQ29tbW9uT2Zmc2V0UGFyZW50JztcbmltcG9ydCB7IGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQgfSBmcm9tICcuL2dldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQnO1xuaW1wb3J0IHsgZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlIH0gZnJvbSAnLi9nZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUnO1xuaW1wb3J0IHsgZ2V0UGFyZW50Tm9kZSB9IGZyb20gJy4vZ2V0UGFyZW50Tm9kZSc7XG5pbXBvcnQgeyBnZXRTY3JvbGxQYXJlbnQgfSBmcm9tICcuL2dldFNjcm9sbFBhcmVudCc7XG5pbXBvcnQgeyBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUgfSBmcm9tICcuL2dldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZSc7XG5pbXBvcnQgeyBnZXRXaW5kb3dTaXplcyB9IGZyb20gJy4vZ2V0V2luZG93U2l6ZXMnO1xuaW1wb3J0IHsgaXNGaXhlZCB9IGZyb20gJy4vaXNGaXhlZCc7XG5pbXBvcnQgeyBpc051bWJlciB9IGZyb20gJy4vaXNOdW1lcmljJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kYXJpZXMoXG4gIHRhcmdldDogSFRNTEVsZW1lbnQsXG4gIGhvc3Q6IEhUTUxFbGVtZW50LFxuICBwYWRkaW5nID0gMCxcbiAgYm91bmRhcmllc0VsZW1lbnQ6IHN0cmluZyxcbiAgZml4ZWRQb3NpdGlvbiA9IGZhbHNlXG4pOiBQYXJ0aWFsPE9mZnNldHM+IHtcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcblxuICBsZXQgYm91bmRhcmllczogUGFydGlhbDxPZmZzZXRzPiA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG4gIGNvbnN0IG9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHRhcmdldCkgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHRhcmdldCwgaG9zdCk7XG5cbiAgLy8gSGFuZGxlIHZpZXdwb3J0IGNhc2VcbiAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAndmlld3BvcnQnKSB7XG4gICAgYm91bmRhcmllcyA9IGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShvZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIEhhbmRsZSBvdGhlciBjYXNlcyBiYXNlZCBvbiBET00gZWxlbWVudCB1c2VkIGFzIGJvdW5kYXJpZXNcbiAgICBsZXQgYm91bmRhcmllc05vZGU7XG4gICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnc2Nyb2xsUGFyZW50Jykge1xuICAgICAgYm91bmRhcmllc05vZGUgPSBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShob3N0KSk7XG4gICAgICBpZiAoYm91bmRhcmllc05vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICBib3VuZGFyaWVzTm9kZSA9IHRhcmdldC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnd2luZG93Jykge1xuICAgICAgYm91bmRhcmllc05vZGUgPSB0YXJnZXQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvdW5kYXJpZXNOb2RlID0gYm91bmRhcmllc0VsZW1lbnQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0cyA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShcbiAgICAgIGJvdW5kYXJpZXNOb2RlLFxuICAgICAgb2Zmc2V0UGFyZW50LFxuICAgICAgZml4ZWRQb3NpdGlvblxuICAgICk7XG5cbiAgICAvLyBJbiBjYXNlIG9mIEhUTUwsIHdlIG5lZWQgYSBkaWZmZXJlbnQgY29tcHV0YXRpb25cbiAgICBpZiAob2Zmc2V0cyAmJiBib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnICYmICFpc0ZpeGVkKG9mZnNldFBhcmVudCkpIHtcbiAgICAgIGNvbnN0IHsgaGVpZ2h0LCB3aWR0aCB9ID0gZ2V0V2luZG93U2l6ZXModGFyZ2V0Lm93bmVyRG9jdW1lbnQpO1xuICAgICAgaWYgKGlzTnVtYmVyKGJvdW5kYXJpZXMudG9wKSAmJiBpc051bWJlcihvZmZzZXRzLnRvcCkgJiYgaXNOdW1iZXIob2Zmc2V0cy5tYXJnaW5Ub3ApKSB7XG4gICAgICAgIGJvdW5kYXJpZXMudG9wICs9IG9mZnNldHMudG9wIC0gb2Zmc2V0cy5tYXJnaW5Ub3A7XG4gICAgICB9XG4gICAgICBpZiAoaXNOdW1iZXIoYm91bmRhcmllcy50b3ApKSB7XG4gICAgICAgIGJvdW5kYXJpZXMuYm90dG9tID0gTnVtYmVyKGhlaWdodCkgKyBOdW1iZXIob2Zmc2V0cy50b3ApO1xuICAgICAgfVxuICAgICAgaWYgKGlzTnVtYmVyKGJvdW5kYXJpZXMubGVmdCkgJiYgaXNOdW1iZXIob2Zmc2V0cy5sZWZ0KSAmJiBpc051bWJlcihvZmZzZXRzLm1hcmdpbkxlZnQpKSB7XG4gICAgICAgIGJvdW5kYXJpZXMubGVmdCArPSBvZmZzZXRzLmxlZnQgLSBvZmZzZXRzLm1hcmdpbkxlZnQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNOdW1iZXIoYm91bmRhcmllcy50b3ApKSB7XG4gICAgICAgIGJvdW5kYXJpZXMucmlnaHQgPSBOdW1iZXIod2lkdGgpICsgTnVtYmVyKG9mZnNldHMubGVmdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvZmZzZXRzKSB7XG4gICAgICAvLyBmb3IgYWxsIHRoZSBvdGhlciBET00gZWxlbWVudHMsIHRoaXMgb25lIGlzIGdvb2RcbiAgICAgIGJvdW5kYXJpZXMgPSBvZmZzZXRzO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBwYWRkaW5nc1xuICBpZiAoaXNOdW1iZXIoYm91bmRhcmllcy5sZWZ0KSkge1xuICAgIGJvdW5kYXJpZXMubGVmdCArPSBwYWRkaW5nO1xuICB9XG4gIGlmIChpc051bWJlcihib3VuZGFyaWVzLnRvcCkpIHtcbiAgICBib3VuZGFyaWVzLnRvcCArPSBwYWRkaW5nO1xuICB9XG4gIGlmIChpc051bWJlcihib3VuZGFyaWVzLnJpZ2h0KSkge1xuICAgIGJvdW5kYXJpZXMucmlnaHQgLT0gcGFkZGluZztcbiAgfVxuICBpZiAoaXNOdW1iZXIoYm91bmRhcmllcy5ib3R0b20pKSB7XG4gICAgYm91bmRhcmllcy5ib3R0b20gLT0gcGFkZGluZztcbiAgfVxuXG4gIHJldHVybiBib3VuZGFyaWVzO1xufVxuIl19