import { hasOwnProp, isString } from '../utils/type-checks';
const aliases = {};
const _mapUnits = {
    date: 'day',
    hour: 'hours',
    minute: 'minutes',
    second: 'seconds',
    millisecond: 'milliseconds'
};
export function addUnitAlias(unit, shorthand) {
    const lowerCase = unit.toLowerCase();
    let _unit = unit;
    if (lowerCase in _mapUnits) {
        _unit = _mapUnits[lowerCase];
    }
    aliases[lowerCase] = aliases[`${lowerCase}s`] = aliases[shorthand] = _unit;
}
export function normalizeUnits(units) {
    return isString(units) ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}
export function normalizeObjectUnits(inputObject) {
    const normalizedInput = {};
    let normalizedProp;
    let prop;
    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }
    return normalizedInput;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jaHJvbm9zL3VuaXRzL2FsaWFzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUc1RCxNQUFNLE9BQU8sR0FBOEIsRUFBRSxDQUFDO0FBSzlDLE1BQU0sU0FBUyxHQUFrQztJQUMvQyxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxPQUFPO0lBQ2IsTUFBTSxFQUFFLFNBQVM7SUFDakIsTUFBTSxFQUFFLFNBQVM7SUFDakIsV0FBVyxFQUFFLGNBQWM7Q0FDNUIsQ0FBQztBQUVGLE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBd0IsRUFBRSxTQUFpQjtJQUN0RSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksU0FBUyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzNCLEtBQUssR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDN0UsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsS0FBd0I7SUFDckQsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN0RixDQUFDO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLFdBQW9DO0lBQ3ZFLE1BQU0sZUFBZSxHQUE0QixFQUFFLENBQUM7SUFDcEQsSUFBSSxjQUFjLENBQUM7SUFDbkIsSUFBSSxJQUFJLENBQUM7SUFFVCxLQUFLLElBQUksSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUN6QixJQUFJLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNsQyxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ25CLGVBQWUsQ0FBQyxjQUFjLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxlQUFlLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhc093blByb3AsIGlzU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvdHlwZS1jaGVja3MnO1xuaW1wb3J0IHsgRGF0ZU9iamVjdCwgVW5pdE9mVGltZSB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgYWxpYXNlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG5leHBvcnQgdHlwZSBFeHRlbmRlZFVuaXRPZlRpbWUgPSBVbml0T2ZUaW1lIHwgJ2RhdGUnIHwgJ3dlZWsnIHwgJ2lzb1dlZWsnIHwgJ2RheU9mWWVhcicgfFxuICAnd2Vla2RheScgfCAnaXNvV2Vla2RheScgfCAnc2Vjb25kJyB8ICdtaWxsaXNlY29uZCcgfCAnbWludXRlJyB8ICdob3VyJyB8ICdxdWFydGVyJyB8ICd3ZWVrWWVhcicgfCAnaXNvV2Vla1llYXInO1xuXG5jb25zdCBfbWFwVW5pdHM6IHsgW2tleTogc3RyaW5nXTogVW5pdE9mVGltZSB9ID0ge1xuICBkYXRlOiAnZGF5JyxcbiAgaG91cjogJ2hvdXJzJyxcbiAgbWludXRlOiAnbWludXRlcycsXG4gIHNlY29uZDogJ3NlY29uZHMnLFxuICBtaWxsaXNlY29uZDogJ21pbGxpc2Vjb25kcydcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRVbml0QWxpYXModW5pdDogRXh0ZW5kZWRVbml0T2ZUaW1lLCBzaG9ydGhhbmQ6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBsb3dlckNhc2UgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gIGxldCBfdW5pdCA9IHVuaXQ7XG4gIGlmIChsb3dlckNhc2UgaW4gX21hcFVuaXRzKSB7XG4gICAgX3VuaXQgPSBfbWFwVW5pdHNbbG93ZXJDYXNlXTtcbiAgfVxuICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2Ake2xvd2VyQ2FzZX1zYF0gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSBfdW5pdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiBpc1N0cmluZyh1bml0cykgPyBhbGlhc2VzW3VuaXRzXSB8fCBhbGlhc2VzW3VuaXRzLnRvTG93ZXJDYXNlKCldIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3Q6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogRGF0ZU9iamVjdCB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRJbnB1dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgbGV0IG5vcm1hbGl6ZWRQcm9wO1xuICBsZXQgcHJvcDtcblxuICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG59XG4iXX0=