import { getParsingFlags } from './parsing-flags';
export function isValid(config) {
    if (config._isValid == null) {
        const flags = getParsingFlags(config);
        const parsedParts = Array.prototype.some.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        let isNowValid = !isNaN(config._d && config._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.weekdayMismatch &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));
        if (config._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }
        if (Object.isFrozen == null || !Object.isFrozen(config)) {
            config._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return config._isValid;
}
export function createInvalid(config, flags) {
    config._d = new Date(NaN);
    Object.assign(getParsingFlags(config), flags || { userInvalidated: true });
    return config;
}
export function markInvalid(config) {
    config._isValid = false;
    return config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY2hyb25vcy9jcmVhdGUvdmFsaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWxELE1BQU0sVUFBVSxPQUFPLENBQUMsTUFBeUI7SUFDL0MsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQVM7WUFDdEYsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxVQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3ZELEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQztZQUNsQixDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQ1osQ0FBQyxLQUFLLENBQUMsWUFBWTtZQUNuQixDQUFDLEtBQUssQ0FBQyxjQUFjO1lBQ3JCLENBQUMsS0FBSyxDQUFDLGVBQWU7WUFDdEIsQ0FBQyxLQUFLLENBQUMsU0FBUztZQUNoQixDQUFDLEtBQUssQ0FBQyxhQUFhO1lBQ3BCLENBQUMsS0FBSyxDQUFDLGVBQWU7WUFDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFdkQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsVUFBVSxHQUFHLFVBQVU7Z0JBQ3JCLEtBQUssQ0FBQyxhQUFhLEtBQUssQ0FBQztnQkFDekIsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDL0IsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDeEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDL0IsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxNQUF5QixFQUFFLEtBQThCO0lBQ3JGLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFM0UsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsTUFBeUI7SUFDbkQsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFFeEIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGVQYXJzaW5nQ29uZmlnIH0gZnJvbSAnLi9wYXJzaW5nLnR5cGVzJztcbmltcG9ydCB7IGdldFBhcnNpbmdGbGFncyB9IGZyb20gJy4vcGFyc2luZy1mbGFncyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkKGNvbmZpZzogRGF0ZVBhcnNpbmdDb25maWcpOiBib29sZWFuIHtcbiAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgY29uc3QgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKTtcbiAgICBjb25zdCBwYXJzZWRQYXJ0cyA9IEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwoZmxhZ3MucGFyc2VkRGF0ZVBhcnRzLCBmdW5jdGlvbiAoaTogbnVtYmVyKSB7XG4gICAgICByZXR1cm4gaSAhPSBudWxsO1xuICAgIH0pO1xuICAgIGxldCBpc05vd1ZhbGlkID0gIWlzTmFOKGNvbmZpZy5fZCAmJiBjb25maWcuX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICFmbGFncy5pbnZhbGlkV2Vla2RheSAmJlxuICAgICAgIWZsYWdzLndlZWtkYXlNaXNtYXRjaCAmJlxuICAgICAgIWZsYWdzLm51bGxJbnB1dCAmJlxuICAgICAgIWZsYWdzLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQgJiZcbiAgICAgICghZmxhZ3MubWVyaWRpZW0gfHwgKGZsYWdzLm1lcmlkaWVtICYmIHBhcnNlZFBhcnRzKSk7XG5cbiAgICBpZiAoY29uZmlnLl9zdHJpY3QpIHtcbiAgICAgIGlzTm93VmFsaWQgPSBpc05vd1ZhbGlkICYmXG4gICAgICAgIGZsYWdzLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgZmxhZ3MudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICBmbGFncy5iaWdIb3VyID09PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbiA9PSBudWxsIHx8ICFPYmplY3QuaXNGcm96ZW4oY29uZmlnKSkge1xuICAgICAgY29uZmlnLl9pc1ZhbGlkID0gaXNOb3dWYWxpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzTm93VmFsaWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5faXNWYWxpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUludmFsaWQoY29uZmlnOiBEYXRlUGFyc2luZ0NvbmZpZywgZmxhZ3M/OiB7IG51bGxJbnB1dDogYm9vbGVhbiB9KTogRGF0ZVBhcnNpbmdDb25maWcge1xuICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICBPYmplY3QuYXNzaWduKGdldFBhcnNpbmdGbGFncyhjb25maWcpLCBmbGFncyB8fCB7IHVzZXJJbnZhbGlkYXRlZDogdHJ1ZSB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFya0ludmFsaWQoY29uZmlnOiBEYXRlUGFyc2luZ0NvbmZpZyk6IERhdGVQYXJzaW5nQ29uZmlnIHtcbiAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiJdfQ==