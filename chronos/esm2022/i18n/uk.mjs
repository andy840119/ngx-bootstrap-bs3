import { getHours } from '../utils/date-getters';
import { getDayOfWeek } from '../units/day-of-week';
//! moment.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
function plural(word, num) {
    let forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(num, withoutSuffix, key) {
    let format = {
        ss: withoutSuffix ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
        mm: withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
        hh: withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
        dd: 'день_дні_днів',
        MM: 'місяць_місяці_місяців',
        yy: 'рік_роки_років'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвилина' : 'хвилину';
    }
    if (key === 'h') {
        return withoutSuffix ? 'година' : 'годину';
    }
    return num + ' ' + plural(format[key], +num);
}
function weekdaysCaseReplace(date, format, isUTC) {
    let weekdays = {
        nominative: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
        accusative: 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
        genitive: 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
    };
    if (!date) {
        return weekdays.nominative;
    }
    let nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
        'accusative' :
        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
            'genitive' :
            'nominative');
    return weekdays[nounCase][getDayOfWeek(date, isUTC)];
}
function processHoursFunction(str) {
    return function (date) {
        return str + 'о' + (getHours(date) === 11 ? 'б' : '') + '] LT';
    };
}
export const ukLocale = {
    abbr: 'uk',
    months: {
        format: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
        standalone: 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
    },
    monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
    weekdays: weekdaysCaseReplace,
    weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY р.',
        LLL: 'D MMMM YYYY р., HH:mm',
        LLLL: 'dddd, D MMMM YYYY р., HH:mm'
    },
    calendar: {
        sameDay: processHoursFunction('[Сьогодні '),
        nextDay: processHoursFunction('[Завтра '),
        lastDay: processHoursFunction('[Вчора '),
        nextWeek: processHoursFunction('[У] dddd ['),
        lastWeek(date) {
            switch (getDayOfWeek(date)) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return processHoursFunction('[Минулої] dddd [')(date);
                case 1:
                case 2:
                case 4:
                    return processHoursFunction('[Минулого] dddd [')(date);
            }
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'за %s',
        past: '%s тому',
        s: 'декілька секунд',
        ss: relativeTimeWithPlural,
        m: relativeTimeWithPlural,
        mm: relativeTimeWithPlural,
        h: 'годину',
        hh: relativeTimeWithPlural,
        d: 'день',
        dd: relativeTimeWithPlural,
        M: 'місяць',
        MM: relativeTimeWithPlural,
        y: 'рік',
        yy: relativeTimeWithPlural
    },
    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
    meridiemParse: /ночі|ранку|дня|вечора/,
    isPM(input) {
        return /^(дня|вечора)$/.test(input);
    },
    meridiem(hour, minute, isLower) {
        if (hour < 4) {
            return 'ночі';
        }
        else if (hour < 12) {
            return 'ранку';
        }
        else if (hour < 17) {
            return 'дня';
        }
        else {
            return 'вечора';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
    ordinal(_num, period) {
        const num = Number(_num);
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
            case 'w':
            case 'W':
                return num + '-й';
            case 'D':
                return num + '-го';
            default:
                return num.toString();
        }
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 7 // The week that contains Jan 1st is the first week of the year.
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY2hyb25vcy9pMThuL3VrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFcEQsa0NBQWtDO0FBQ2xDLDJCQUEyQjtBQUMzQixtREFBbUQ7QUFDbkQsd0RBQXdEO0FBRXhELFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHO0lBQ3ZCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsT0FBTyxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2SixDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFXLEVBQUUsYUFBYSxFQUFFLEdBQUc7SUFDN0QsSUFBSSxNQUFNLEdBQThCO1FBQ3RDLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyx3QkFBd0I7UUFDdkUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtRQUN2RSxFQUFFLEVBQUUs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NUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDYixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO2FBQU0sSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDckIsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQzthQUFNLElBQUksSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztJQUNELHNCQUFzQixFQUFFLGdCQUFnQjtJQUN4QyxPQUFPLENBQUMsSUFBWSxFQUFFLE1BQWM7UUFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLFFBQVEsTUFBTSxFQUFFLENBQUM7WUFDZixLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRztnQkFDTixPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDcEIsS0FBSyxHQUFHO2dCQUNOLE9BQU8sR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNyQjtnQkFDRSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUNELElBQUksRUFBRTtRQUNKLEdBQUcsRUFBRSxDQUFDLEVBQUUsdUNBQXVDO1FBQy9DLEdBQUcsRUFBRSxDQUFDLENBQUUsZ0VBQWdFO0tBQ3pFO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2FsZURhdGEgfSBmcm9tICcuLi9sb2NhbGUvbG9jYWxlLmNsYXNzJztcbmltcG9ydCB7IGdldEhvdXJzIH0gZnJvbSAnLi4vdXRpbHMvZGF0ZS1nZXR0ZXJzJztcbmltcG9ydCB7IGdldERheU9mV2VlayB9IGZyb20gJy4uL3VuaXRzL2RheS1vZi13ZWVrJztcblxuLy8hIG1vbWVudC5qcyBsb2NhbGUgY29uZmlndXJhdGlvblxuLy8hIGxvY2FsZSA6IFVrcmFpbmlhbiBbdWtdXG4vLyEgYXV0aG9yIDogemVtbGFuaW4gOiBodHRwczovL2dpdGh1Yi5jb20vemVtbGFuaW5cbi8vISBBdXRob3IgOiBNZW5lbGlvbiBFbGVuc8O6bGUgOiBodHRwczovL2dpdGh1Yi5jb20vT2lyZVxuXG5mdW5jdGlvbiBwbHVyYWwod29yZCwgbnVtKSB7XG4gIGxldCBmb3JtcyA9IHdvcmQuc3BsaXQoJ18nKTtcbiAgcmV0dXJuIG51bSAlIDEwID09PSAxICYmIG51bSAlIDEwMCAhPT0gMTEgPyBmb3Jtc1swXSA6IChudW0gJSAxMCA+PSAyICYmIG51bSAlIDEwIDw9IDQgJiYgKG51bSAlIDEwMCA8IDEwIHx8IG51bSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKTtcbn1cblxuZnVuY3Rpb24gcmVsYXRpdmVUaW1lV2l0aFBsdXJhbChudW06IG51bWJlciwgd2l0aG91dFN1ZmZpeCwga2V5KTogc3RyaW5nIHtcbiAgbGV0IGZvcm1hdDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICBzczogd2l0aG91dFN1ZmZpeCA/ICfRgdC10LrRg9C90LTQsF/RgdC10LrRg9C90LTQuF/RgdC10LrRg9C90LQnIDogJ9GB0LXQutGD0L3QtNGDX9GB0LXQutGD0L3QtNC4X9GB0LXQutGD0L3QtCcsXG4gICAgbW06IHdpdGhvdXRTdWZmaXggPyAn0YXQstC40LvQuNC90LBf0YXQstC40LvQuNC90Lhf0YXQstC40LvQuNC9JyA6ICfRhdCy0LjQu9C40L3Rg1/RhdCy0LjQu9C40L3QuF/RhdCy0LjQu9C40L0nLFxuICAgIGhoOiB3aXRob3V0U3VmZml4ID8gJ9Cz0L7QtNC40L3QsF/Qs9C+0LTQuNC90Lhf0LPQvtC00LjQvScgOiAn0LPQvtC00LjQvdGDX9Cz0L7QtNC40L3QuF/Qs9C+0LTQuNC9JyxcbiAgICBkZDogJ9C00LXQvdGMX9C00L3Rll/QtNC90ZbQsicsXG4gICAgTU06ICfQvNGW0YHRj9GG0Yxf0LzRltGB0Y/RhtGWX9C80ZbRgdGP0YbRltCyJyxcbiAgICB5eTogJ9GA0ZbQul/RgNC+0LrQuF/RgNC+0LrRltCyJ1xuICB9O1xuXG4gIGlmIChrZXkgPT09ICdtJykge1xuICAgIHJldHVybiB3aXRob3V0U3VmZml4ID8gJ9GF0LLQuNC70LjQvdCwJyA6ICfRhdCy0LjQu9C40L3Rgyc7XG4gIH1cblxuICBpZiAoa2V5ID09PSAnaCcpIHtcbiAgICByZXR1cm4gd2l0aG91dFN1ZmZpeCA/ICfQs9C+0LTQuNC90LAnIDogJ9Cz0L7QtNC40L3Rgyc7XG4gIH1cbiAgcmV0dXJuIG51bSArICcgJyArIHBsdXJhbChmb3JtYXRba2V5XSwgK251bSk7XG59XG5cbmZ1bmN0aW9uIHdlZWtkYXlzQ2FzZVJlcGxhY2UoZGF0ZTogRGF0ZSwgZm9ybWF0OiBzdHJpbmcsIGlzVVRDPzogYm9vbGVhbik6IHN0cmluZyB8IHN0cmluZ1tdIHtcbiAgbGV0IHdlZWtkYXlzID0ge1xuICAgIG5vbWluYXRpdmU6ICfQvdC10LTRltC70Y9f0L/QvtC90LXQtNGW0LvQvtC6X9Cy0ZbQstGC0L7RgNC+0Lpf0YHQtdGA0LXQtNCwX9GH0LXRgtCy0LXRgF/Qv+KAmdGP0YLQvdC40YbRj1/RgdGD0LHQvtGC0LAnLnNwbGl0KCdfJyksXG4gICAgYWNjdXNhdGl2ZTogJ9C90LXQtNGW0LvRjl/Qv9C+0L3QtdC00ZbQu9C+0Lpf0LLRltCy0YLQvtGA0L7Qul/RgdC10YDQtdC00YNf0YfQtdGC0LLQtdGAX9C/4oCZ0Y/RgtC90LjRhtGOX9GB0YPQsdC+0YLRgycuc3BsaXQoJ18nKSxcbiAgICBnZW5pdGl2ZTogJ9C90LXQtNGW0LvRll/Qv9C+0L3QtdC00ZbQu9C60LBf0LLRltCy0YLQvtGA0LrQsF/RgdC10YDQtdC00Lhf0YfQtdGC0LLQtdGA0LPQsF/Qv+KAmdGP0YLQvdC40YbRll/RgdGD0LHQvtGC0LgnLnNwbGl0KCdfJylcbiAgfTtcblxuICBpZiAoIWRhdGUpIHtcbiAgICByZXR1cm4gd2Vla2RheXMubm9taW5hdGl2ZTtcbiAgfVxuXG4gIGxldCBub3VuQ2FzZSA9ICgvKFxcW1vQktCy0KPRg11cXF0pID9kZGRkLykudGVzdChmb3JtYXQpID9cbiAgICAnYWNjdXNhdGl2ZScgOlxuICAgICgoL1xcWz8oPzrQvNC40L3Rg9C70L7Rl3zQvdCw0YHRgtGD0L/QvdC+0ZcpPyA/XFxdID9kZGRkLykudGVzdChmb3JtYXQpID9cbiAgICAgICdnZW5pdGl2ZScgOlxuICAgICAgJ25vbWluYXRpdmUnKTtcbiAgcmV0dXJuIHdlZWtkYXlzW25vdW5DYXNlXVtnZXREYXlPZldlZWsoZGF0ZSwgaXNVVEMpXTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0hvdXJzRnVuY3Rpb24oc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRlOiBEYXRlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyICsgJ9C+JyArIChnZXRIb3VycyhkYXRlKSA9PT0gMTEgPyAn0LEnIDogJycpICsgJ10gTFQnO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgdWtMb2NhbGU6IExvY2FsZURhdGEgPSB7XG4gIGFiYnI6ICd1aycsXG4gIG1vbnRoczoge1xuICAgIGZvcm1hdDogJ9GB0ZbRh9C90Y9f0LvRjtGC0L7Qs9C+X9Cx0LXRgNC10LfQvdGPX9C60LLRltGC0L3Rj1/RgtGA0LDQstC90Y9f0YfQtdGA0LLQvdGPX9C70LjQv9C90Y9f0YHQtdGA0L/QvdGPX9Cy0LXRgNC10YHQvdGPX9C20L7QstGC0L3Rj1/Qu9C40YHRgtC+0L/QsNC00LBf0LPRgNGD0LTQvdGPJy5zcGxpdCgnXycpLFxuICAgIHN0YW5kYWxvbmU6ICfRgdGW0YfQtdC90Yxf0LvRjtGC0LjQuV/QsdC10YDQtdC30LXQvdGMX9C60LLRltGC0LXQvdGMX9GC0YDQsNCy0LXQvdGMX9GH0LXRgNCy0LXQvdGMX9C70LjQv9C10L3RjF/RgdC10YDQv9C10L3RjF/QstC10YDQtdGB0LXQvdGMX9C20L7QstGC0LXQvdGMX9C70LjRgdGC0L7Qv9Cw0LRf0LPRgNGD0LTQtdC90YwnLnNwbGl0KCdfJylcbiAgfSxcbiAgbW9udGhzU2hvcnQ6ICfRgdGW0Ydf0LvRjtGCX9Cx0LXRgF/QutCy0ZbRgl/RgtGA0LDQsl/Rh9C10YDQsl/Qu9C40L9f0YHQtdGA0L9f0LLQtdGAX9C20L7QstGCX9C70LjRgdGCX9Cz0YDRg9C0Jy5zcGxpdCgnXycpLFxuICB3ZWVrZGF5czogd2Vla2RheXNDYXNlUmVwbGFjZSxcbiAgd2Vla2RheXNTaG9ydDogJ9C90LRf0L/QvV/QstGCX9GB0YBf0YfRgl/Qv9GCX9GB0LEnLnNwbGl0KCdfJyksXG4gIHdlZWtkYXlzTWluOiAn0L3QtF/Qv9C9X9Cy0YJf0YHRgF/Rh9GCX9C/0YJf0YHQsScuc3BsaXQoJ18nKSxcbiAgbG9uZ0RhdGVGb3JtYXQ6IHtcbiAgICBMVDogJ0hIOm1tJyxcbiAgICBMVFM6ICdISDptbTpzcycsXG4gICAgTDogJ0RELk1NLllZWVknLFxuICAgIExMOiAnRCBNTU1NIFlZWVkg0YAuJyxcbiAgICBMTEw6ICdEIE1NTU0gWVlZWSDRgC4sIEhIOm1tJyxcbiAgICBMTExMOiAnZGRkZCwgRCBNTU1NIFlZWVkg0YAuLCBISDptbSdcbiAgfSxcbiAgY2FsZW5kYXI6IHtcbiAgICBzYW1lRGF5OiBwcm9jZXNzSG91cnNGdW5jdGlvbignW9Ch0YzQvtCz0L7QtNC90ZYgJyksXG4gICAgbmV4dERheTogcHJvY2Vzc0hvdXJzRnVuY3Rpb24oJ1vQl9Cw0LLRgtGA0LAgJyksXG4gICAgbGFzdERheTogcHJvY2Vzc0hvdXJzRnVuY3Rpb24oJ1vQktGH0L7RgNCwICcpLFxuICAgIG5leHRXZWVrOiBwcm9jZXNzSG91cnNGdW5jdGlvbignW9CjXSBkZGRkIFsnKSxcbiAgICBsYXN0V2VlayhkYXRlOiBEYXRlKSB7XG4gICAgICBzd2l0Y2ggKGdldERheU9mV2VlayhkYXRlKSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NIb3Vyc0Z1bmN0aW9uKCdb0JzQuNC90YPQu9C+0ZddIGRkZGQgWycpKGRhdGUpO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHJldHVybiBwcm9jZXNzSG91cnNGdW5jdGlvbignW9Cc0LjQvdGD0LvQvtCz0L5dIGRkZGQgWycpKGRhdGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2FtZUVsc2U6ICdMJ1xuICB9LFxuICByZWxhdGl2ZVRpbWU6IHtcbiAgICBmdXR1cmU6ICfQt9CwICVzJyxcbiAgICBwYXN0OiAnJXMg0YLQvtC80YMnLFxuICAgIHM6ICfQtNC10LrRltC70YzQutCwINGB0LXQutGD0L3QtCcsXG4gICAgc3M6IHJlbGF0aXZlVGltZVdpdGhQbHVyYWwsXG4gICAgbTogcmVsYXRpdmVUaW1lV2l0aFBsdXJhbCxcbiAgICBtbTogcmVsYXRpdmVUaW1lV2l0aFBsdXJhbCxcbiAgICBoOiAn0LPQvtC00LjQvdGDJyxcbiAgICBoaDogcmVsYXRpdmVUaW1lV2l0aFBsdXJhbCxcbiAgICBkOiAn0LTQtdC90YwnLFxuICAgIGRkOiByZWxhdGl2ZVRpbWVXaXRoUGx1cmFsLFxuICAgIE06ICfQvNGW0YHRj9GG0YwnLFxuICAgIE1NOiByZWxhdGl2ZVRpbWVXaXRoUGx1cmFsLFxuICAgIHk6ICfRgNGW0LonLFxuICAgIHl5OiByZWxhdGl2ZVRpbWVXaXRoUGx1cmFsXG4gIH0sXG4gIC8vIE0uIEUuOiB0aG9zZSB0d28gYXJlIHZpcnR1YWxseSB1bnVzZWQgYnV0IGEgdXNlciBtaWdodCB3YW50IHRvIGltcGxlbWVudCB0aGVtIGZvciBoaXMvaGVyIHdlYnNpdGUgZm9yIHNvbWUgcmVhc29uXG4gIG1lcmlkaWVtUGFyc2U6IC/QvdC+0YfRlnzRgNCw0L3QutGDfNC00L3Rj3zQstC10YfQvtGA0LAvLFxuICBpc1BNKGlucHV0KSB7XG4gICAgcmV0dXJuIC9eKNC00L3Rj3zQstC10YfQvtGA0LApJC8udGVzdChpbnB1dCk7XG4gIH0sXG4gIG1lcmlkaWVtKGhvdXIsIG1pbnV0ZSwgaXNMb3dlcikge1xuICAgIGlmIChob3VyIDwgNCkge1xuICAgICAgcmV0dXJuICfQvdC+0YfRlic7XG4gICAgfSBlbHNlIGlmIChob3VyIDwgMTIpIHtcbiAgICAgIHJldHVybiAn0YDQsNC90LrRgyc7XG4gICAgfSBlbHNlIGlmIChob3VyIDwgMTcpIHtcbiAgICAgIHJldHVybiAn0LTQvdGPJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICfQstC10YfQvtGA0LAnO1xuICAgIH1cbiAgfSxcbiAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogL1xcZHsxLDJ9LSjQuXzQs9C+KS8sXG4gIG9yZGluYWwoX251bTogbnVtYmVyLCBwZXJpb2Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbnVtID0gTnVtYmVyKF9udW0pO1xuICAgIHN3aXRjaCAocGVyaW9kKSB7XG4gICAgICBjYXNlICdNJzpcbiAgICAgIGNhc2UgJ2QnOlxuICAgICAgY2FzZSAnREREJzpcbiAgICAgIGNhc2UgJ3cnOlxuICAgICAgY2FzZSAnVyc6XG4gICAgICAgIHJldHVybiBudW0gKyAnLdC5JztcbiAgICAgIGNhc2UgJ0QnOlxuICAgICAgICByZXR1cm4gbnVtICsgJy3Qs9C+JztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKTtcbiAgICB9XG4gIH0sXG4gIHdlZWs6IHtcbiAgICBkb3c6IDEsIC8vIE1vbmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgIGRveTogNyAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICB9XG59O1xuIl19