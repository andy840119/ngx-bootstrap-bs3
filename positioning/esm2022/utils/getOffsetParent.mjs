/**
 * Returns the offset parent of the given element
 */
import { getStyleComputedProperty } from './getStyleComputedProperty';
export function getOffsetParent(element) {
    if (!element) {
        return document.documentElement;
    }
    const noOffsetParent = null;
    // NOTE: 1 DOM access here
    let offsetParent = element?.offsetParent;
    // Skip hidden elements which don't have an offsetParent
    let sibling = void 0;
    while (offsetParent === noOffsetParent
        && element.nextElementSibling
        && sibling !== element.nextElementSibling) {
        // todo: valorkin fix
        sibling = element.nextElementSibling;
        offsetParent = sibling.offsetParent;
    }
    const nodeName = offsetParent && offsetParent.nodeName;
    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
        return sibling ? sibling.ownerDocument.documentElement : document.documentElement;
    }
    // .offsetParent will return the closest TH, TD or TABLE in case
    if (offsetParent &&
        ['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 &&
        getStyleComputedProperty(offsetParent, 'position') === 'static') {
        return getOffsetParent(offsetParent);
    }
    return offsetParent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T2Zmc2V0UGFyZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Bvc2l0aW9uaW5nL3V0aWxzL2dldE9mZnNldFBhcmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXRFLE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBb0I7SUFDbEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFFNUIsMEJBQTBCO0lBQzFCLElBQUksWUFBWSxHQUFHLE9BQU8sRUFBRSxZQUFZLENBQUM7SUFFekMsd0RBQXdEO0lBQ3hELElBQUksT0FBTyxHQUE0QixLQUFLLENBQUMsQ0FBQztJQUU5QyxPQUFPLFlBQVksS0FBSyxjQUFjO1dBQzVCLE9BQU8sQ0FBQyxrQkFBa0I7V0FDMUIsT0FBTyxLQUFLLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRS9DLHFCQUFxQjtRQUNyQixPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFpQyxDQUFDO1FBQ3BELFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0lBQ3RDLENBQUM7SUFFSCxNQUFNLFFBQVEsR0FBRyxZQUFZLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUV2RCxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQzVELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUNwRixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLElBQ0UsWUFBWTtRQUNaLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRCx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLEtBQUssUUFBUSxFQUMvRCxDQUFDO1FBQ0QsT0FBTyxlQUFlLENBQUMsWUFBMkIsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxPQUFPLFlBQTJCLENBQUM7QUFDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyB0aGUgb2Zmc2V0IHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICovXG5pbXBvcnQgeyBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkgfSBmcm9tICcuL2dldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICBjb25zdCBub09mZnNldFBhcmVudCA9IG51bGw7XG5cbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgbGV0IG9mZnNldFBhcmVudCA9IGVsZW1lbnQ/Lm9mZnNldFBhcmVudDtcblxuICAvLyBTa2lwIGhpZGRlbiBlbGVtZW50cyB3aGljaCBkb24ndCBoYXZlIGFuIG9mZnNldFBhcmVudFxuICBsZXQgc2libGluZzogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQgPSB2b2lkIDA7XG5cbiAgd2hpbGUgKG9mZnNldFBhcmVudCA9PT0gbm9PZmZzZXRQYXJlbnRcbiAgICAgICAgICYmIGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgICAgICAmJiBzaWJsaW5nICE9PSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZykge1xuXG4gICAgICAvLyB0b2RvOiB2YWxvcmtpbiBmaXhcbiAgICAgIHNpYmxpbmcgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZyBhcyBIVE1MRWxlbWVudDtcbiAgICAgIG9mZnNldFBhcmVudCA9IHNpYmxpbmcub2Zmc2V0UGFyZW50O1xuICAgIH1cblxuICBjb25zdCBub2RlTmFtZSA9IG9mZnNldFBhcmVudCAmJiBvZmZzZXRQYXJlbnQubm9kZU5hbWU7XG5cbiAgaWYgKCFub2RlTmFtZSB8fCBub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcbiAgICByZXR1cm4gc2libGluZyA/IHNpYmxpbmcub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICAvLyAub2Zmc2V0UGFyZW50IHdpbGwgcmV0dXJuIHRoZSBjbG9zZXN0IFRILCBURCBvciBUQUJMRSBpbiBjYXNlXG4gIGlmIChcbiAgICBvZmZzZXRQYXJlbnQgJiZcbiAgICBbJ1RIJywgJ1REJywgJ1RBQkxFJ10uaW5kZXhPZihvZmZzZXRQYXJlbnQubm9kZU5hbWUpICE9PSAtMSAmJlxuICAgIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShvZmZzZXRQYXJlbnQsICdwb3NpdGlvbicpID09PSAnc3RhdGljJ1xuICApIHtcbiAgICByZXR1cm4gZ2V0T2Zmc2V0UGFyZW50KG9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50O1xufVxuIl19