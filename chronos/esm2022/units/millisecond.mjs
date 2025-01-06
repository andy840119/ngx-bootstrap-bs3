// FORMATTING
import { addFormatToken } from '../format/format';
import { addRegexToken, match1, match1to3, match2, match3, matchUnsigned } from '../parse/regex';
import { MILLISECOND } from './constants';
import { toInt } from '../utils/type-checks';
import { addParseToken } from '../parse/token';
import { addUnitAlias } from './aliases';
import { addUnitPriority } from './priorities';
import { getMilliseconds } from '../utils/date-getters';
export function initMillisecond() {
    addFormatToken('S', null, null, function (date, opts) {
        return (~~(getMilliseconds(date, opts.isUTC) / 100)).toString(10);
    });
    addFormatToken(null, ['SS', 2, false], null, function (date, opts) {
        return (~~(getMilliseconds(date, opts.isUTC) / 10)).toString(10);
    });
    addFormatToken(null, ['SSS', 3, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC)).toString(10);
    });
    addFormatToken(null, ['SSSS', 4, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 10).toString(10);
    });
    addFormatToken(null, ['SSSSS', 5, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 100).toString(10);
    });
    addFormatToken(null, ['SSSSSS', 6, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 1000).toString(10);
    });
    addFormatToken(null, ['SSSSSSS', 7, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 10000).toString(10);
    });
    addFormatToken(null, ['SSSSSSSS', 8, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 100000).toString(10);
    });
    addFormatToken(null, ['SSSSSSSSS', 9, false], null, function (date, opts) {
        return (getMilliseconds(date, opts.isUTC) * 1000000).toString(10);
    });
    // ALIASES
    addUnitAlias('millisecond', 'ms');
    // PRIORITY
    addUnitPriority('millisecond', 16);
    // PARSING
    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);
    let token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }
    function parseMs(input, array, config) {
        array[MILLISECOND] = toInt(parseFloat(`0.${input}`) * 1000);
        return config;
    }
    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlsbGlzZWNvbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY2hyb25vcy91bml0cy9taWxsaXNlY29uZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBRWIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBR3hELE1BQU0sVUFBVSxlQUFlO0lBQzdCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDNUIsVUFBUyxJQUFVLEVBQUUsSUFBMEI7UUFDN0MsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FDRixDQUFDO0lBRUYsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUN6QyxVQUFTLElBQVUsRUFBRSxJQUEwQjtRQUM3QyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxD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LENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxhQUFhLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUV4QyxJQUFJLEtBQUssQ0FBQztJQUNWLEtBQUssS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksR0FBRyxFQUFFLENBQUM7UUFDckQsYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsS0FBYSxFQUFFLEtBQWdCLEVBQUUsTUFBeUI7UUFDekUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2xELGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNILFVBQVU7QUFDVixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRk9STUFUVElOR1xuXG5pbXBvcnQgeyBhZGRGb3JtYXRUb2tlbiB9IGZyb20gJy4uL2Zvcm1hdC9mb3JtYXQnO1xuaW1wb3J0IHsgYWRkUmVnZXhUb2tlbiwgbWF0Y2gxLCBtYXRjaDF0bzMsIG1hdGNoMiwgbWF0Y2gzLCBtYXRjaFVuc2lnbmVkIH0gZnJvbSAnLi4vcGFyc2UvcmVnZXgnO1xuaW1wb3J0IHsgTUlMTElTRUNPTkQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyB0b0ludCB9IGZyb20gJy4uL3V0aWxzL3R5cGUtY2hlY2tzJztcbmltcG9ydCB7IGFkZFBhcnNlVG9rZW4gfSBmcm9tICcuLi9wYXJzZS90b2tlbic7XG5pbXBvcnQgeyBEYXRlQXJyYXksIERhdGVGb3JtYXR0ZXJPcHRpb25zLCBXZWVrUGFyc2luZyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFkZFVuaXRBbGlhcyB9IGZyb20gJy4vYWxpYXNlcyc7XG5pbXBvcnQgeyBhZGRVbml0UHJpb3JpdHkgfSBmcm9tICcuL3ByaW9yaXRpZXMnO1xuaW1wb3J0IHsgRGF0ZVBhcnNpbmdDb25maWcgfSBmcm9tICcuLi9jcmVhdGUvcGFyc2luZy50eXBlcyc7XG5pbXBvcnQgeyBnZXRNaWxsaXNlY29uZHMgfSBmcm9tICcuLi91dGlscy9kYXRlLWdldHRlcnMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0TWlsbGlzZWNvbmQoKSB7XG4gIGFkZEZvcm1hdFRva2VuKCdTJywgbnVsbCwgbnVsbCxcbiAgICBmdW5jdGlvbihkYXRlOiBEYXRlLCBvcHRzOiBEYXRlRm9ybWF0dGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gKH5+KGdldE1pbGxpc2Vjb25kcyhkYXRlLCBvcHRzLmlzVVRDKSAvIDEwMCkpLnRvU3RyaW5nKDEwKTtcbiAgICB9XG4gICk7XG5cbiAgYWRkRm9ybWF0VG9rZW4obnVsbCwgWydTUycsIDIsIGZhbHNlXSwgbnVsbCxcbiAgICBmdW5jdGlvbihkYXRlOiBEYXRlLCBvcHRzOiBEYXRlRm9ybWF0dGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gKH5+KGdldE1pbGxpc2Vjb25kcyhkYXRlLCBvcHRzLmlzVVRDKSAvIDEwKSkudG9TdHJpbmcoMTApO1xuICAgIH1cbiAgKTtcblxuICBhZGRGb3JtYXRUb2tlbihudWxsLCBbJ1NTUycsIDMsIGZhbHNlXSwgbnVsbCxcbiAgICBmdW5jdGlvbihkYXRlOiBEYXRlLCBvcHRzOiBEYXRlRm9ybWF0dGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gKGdldE1pbGxpc2Vjb25kcyhkYXRlLCBvcHRzLmlzVVRDKSkudG9TdHJpbmcoMTApO1xuICAgIH1cbiAgKTtcbiAgYWRkRm9ybWF0VG9rZW4obnVsbCwgWydTU1NTJywgNCwgZmFsc2VdLCBudWxsLFxuICAgIGZ1bmN0aW9uKGRhdGU6IERhdGUsIG9wdHM6IERhdGVGb3JtYXR0ZXJPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAoZ2V0TWlsbGlzZWNvbmRzKGRhdGUsIG9wdHMuaXNVVEMpICogMTApLnRvU3RyaW5nKDEwKTtcbiAgICB9XG4gICk7XG4gIGFkZEZvcm1hdFRva2VuKG51bGwsIFsnU1NTU1MnLCA1LCBmYWxzZV0sIG51bGwsXG4gICAgZnVuY3Rpb24oZGF0ZTogRGF0ZSwgb3B0czogRGF0ZUZvcm1hdHRlck9wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIChnZXRNaWxsaXNlY29uZHMoZGF0ZSwgb3B0cy5pc1VUQykgKiAxMDApLnRvU3RyaW5nKDEwKTtcbiAgICB9XG4gICk7XG4gIGFkZEZvcm1hdFRva2VuKG51bGwsIFsnU1NTU1NTJywgNiwgZmFsc2VdLCBudWxsLFxuICAgIGZ1bmN0aW9uKGRhdGU6IERhdGUsIG9wdHM6IERhdGVGb3JtYXR0ZXJPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAoZ2V0TWlsbGlzZWNvbmRzKGRhdGUsIG9wdHMuaXNVVEMpICogMTAwMCkudG9TdHJpbmcoMTApO1xuICAgIH1cbiAgKTtcbiAgYWRkRm9ybWF0VG9rZW4obnVsbCwgWydTU1NTU1NTJywgNywgZmFsc2VdLCBudWxsLFxuICAgIGZ1bmN0aW9uKGRhdGU6IERhdGUsIG9wdHM6IERhdGVGb3JtYXR0ZXJPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAoZ2V0TWlsbGlzZWNvbmRzKGRhdGUsIG9wdHMuaXNVVEMpICogMTAwMDApLnRvU3RyaW5nKDEwKTtcbiAgICB9XG4gICk7XG4gIGFkZEZvcm1hdFRva2VuKG51bGwsIFsnU1NTU1NTU1MnLCA4LCBmYWxzZV0sIG51bGwsXG4gICAgZnVuY3Rpb24oZGF0ZTogRGF0ZSwgb3B0czogRGF0ZUZvcm1hdHRlck9wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIChnZXRNaWxsaXNlY29uZHMoZGF0ZSwgb3B0cy5pc1VUQykgKiAxMDAwMDApLnRvU3RyaW5nKDEwKTtcbiAgICB9XG4gICk7XG4gIGFkZEZvcm1hdFRva2VuKG51bGwsIFsnU1NTU1NTU1NTJywgOSwgZmFsc2VdLCBudWxsLFxuICAgIGZ1bmN0aW9uKGRhdGU6IERhdGUsIG9wdHM6IERhdGVGb3JtYXR0ZXJPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAoZ2V0TWlsbGlzZWNvbmRzKGRhdGUsIG9wdHMuaXNVVEMpICogMTAwMDAwMCkudG9TdHJpbmcoMTApO1xuICAgIH1cbiAgKTtcblxuXG4vLyBBTElBU0VTXG5cbiAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4vLyBQUklPUklUWVxuXG4gIGFkZFVuaXRQcmlvcml0eSgnbWlsbGlzZWNvbmQnLCAxNik7XG5cbi8vIFBBUlNJTkdcblxuICBhZGRSZWdleFRva2VuKCdTJywgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICBhZGRSZWdleFRva2VuKCdTUycsIG1hdGNoMXRvMywgbWF0Y2gyKTtcbiAgYWRkUmVnZXhUb2tlbignU1NTJywgbWF0Y2gxdG8zLCBtYXRjaDMpO1xuXG4gIGxldCB0b2tlbjtcbiAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNcyhpbnB1dDogc3RyaW5nLCBhcnJheTogRGF0ZUFycmF5LCBjb25maWc6IERhdGVQYXJzaW5nQ29uZmlnKTogRGF0ZVBhcnNpbmdDb25maWcge1xuICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KHBhcnNlRmxvYXQoYDAuJHtpbnB1dH1gKSAqIDEwMDApO1xuXG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxuXG4gIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbiAgfVxuLy8gTU9NRU5UU1xufVxuIl19