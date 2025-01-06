// moment.js locale configuration
// locale : Thai [th]
// author : Watcharapol Sanitwong : https://github.com/tumit
export const thLocale = {
    abbr: 'th',
    months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
    monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
    monthsParseExact: true,
    weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
    weekdaysShort: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'), // yes, three characters difference
    weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY เวลา H:mm',
        LLLL: 'วันddddที่ D MMMM YYYY เวลา H:mm'
    },
    meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
    isPM(input) {
        return input === 'หลังเที่ยง';
    },
    meridiem(hour, minute, isLower) {
        if (hour < 12) {
            return 'ก่อนเที่ยง';
        }
        else {
            return 'หลังเที่ยง';
        }
    },
    calendar: {
        sameDay: '[วันนี้ เวลา] LT',
        nextDay: '[พรุ่งนี้ เวลา] LT',
        nextWeek: 'dddd[หน้า เวลา] LT',
        lastDay: '[เมื่อวานนี้ เวลา] LT',
        lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'อีก %s',
        past: '%sที่แล้ว',
        s: 'ไม่กี่วินาที',
        ss: '%d วินาที',
        m: '1 นาที',
        mm: '%d นาที',
        h: '1 ชั่วโมง',
        hh: '%d ชั่วโมง',
        d: '1 วัน',
        dd: '%d วัน',
        M: '1 เดือน',
        MM: '%d เดือน',
        y: '1 ปี',
        yy: '%d ปี'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY2hyb25vcy9pMThuL3RoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQUNqQyxxQkFBcUI7QUFDckIsNERBQTREO0FBSTVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBZTtJQUNsQyxJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxtR0FBbUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3RILFdBQVcsRUFBRSxnRUFBZ0UsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3hGLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsUUFBUSxFQUFFLGdEQUFnRCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDckUsYUFBYSxFQUFFLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxtQ0FBbUM7SUFDdkYsV0FBVyxFQUFFLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDaEQsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixjQUFjLEVBQUU7UUFDZCxFQUFFLEVBQUUsTUFBTTtRQUNWLEdBQUcsRUFBRSxTQUFTO1FBQ2QsQ0FBQyxFQUFFLFlBQVk7UUFDZixFQUFFLEVBQUUsYUFBYTtRQUNqQixHQUFHLEVBQUUsdUJBQXVCO1FBQzVCLElBQUksRUFBRSxrQ0FBa0M7S0FDekM7SUFDRCxhQUFhLEVBQUUsdUJBQXVCO0lBQ3RDLElBQUksQ0FBQyxLQUFLO1FBQ1IsT0FBTyxLQUFLLEtBQUssWUFBWSxDQUFDO0lBQ2hDLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPO1FBQzVCLElBQUksSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2QsT0FBTyxZQUFZLENBQUM7UUFDdEIsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUNELFFBQVEsRUFBRTtRQUNSLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsT0FBTyxFQUFFLG9CQUFvQjtRQUM3QixRQUFRLEVBQUUsb0JBQW9CO1FBQzlCLE9BQU8sRUFBRSx1QkFBdUI7UUFDaEMsUUFBUSxFQUFFLDRCQUE0QjtRQUN0QyxRQUFRLEVBQUUsR0FBRztLQUNkO0lBQ0QsWUFBWSxFQUFFO1FBQ1osTUFBTSxFQUFFLFFBQVE7UUFDaEIsSUFBSSxFQUFFLFdBQVc7UUFDakIsQ0FBQyxFQUFFLGNBQWM7UUFDakIsRUFBRSxFQUFFLFdBQVc7UUFDZixDQUFDLEVBQUUsUUFBUTtRQUNYLEVBQUUsRUFBRSxTQUFTO1FBQ2IsQ0FBQyxFQUFFLFdBQVc7UUFDZCxFQUFFLEVBQUUsWUFBWTtRQUNoQixDQUFDLEVBQUUsT0FBTztRQUNWLEVBQUUsRUFBRSxRQUFRO1FBQ1osQ0FBQyxFQUFFLFNBQVM7UUFDWixFQUFFLEVBQUUsVUFBVTtRQUNkLENBQUMsRUFBRSxNQUFNO1FBQ1QsRUFBRSxFQUFFLE9BQU87S0FDWjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb21lbnQuanMgbG9jYWxlIGNvbmZpZ3VyYXRpb25cbi8vIGxvY2FsZSA6IFRoYWkgW3RoXVxuLy8gYXV0aG9yIDogV2F0Y2hhcmFwb2wgU2FuaXR3b25nIDogaHR0cHM6Ly9naXRodWIuY29tL3R1bWl0XG5cbmltcG9ydCB7IExvY2FsZURhdGEgfSBmcm9tICcuLi9sb2NhbGUvbG9jYWxlLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IHRoTG9jYWxlOiBMb2NhbGVEYXRhID0ge1xuICBhYmJyOiAndGgnLFxuICBtb250aHM6ICfguKHguIHguKPguLLguITguKFf4LiB4Li44Lih4Lig4Liy4Lie4Lix4LiZ4LiY4LmMX+C4oeC4teC4meC4suC4hOC4oV/guYDguKHguKnguLLguKLguJlf4Lie4Lik4Lip4Lig4Liy4LiE4LihX+C4oeC4tOC4luC4uOC4meC4suC4ouC4mV/guIHguKPguIHguI7guLLguITguKFf4Liq4Li04LiH4Lir4Liy4LiE4LihX+C4geC4seC4meC4ouC4suC4ouC4mV/guJXguLjguKXguLLguITguKFf4Lie4Lik4Lio4LiI4Li04LiB4Liy4Lii4LiZX+C4mOC4seC4meC4p+C4suC4hOC4oScuc3BsaXQoJ18nKSxcbiAgbW9udGhzU2hvcnQ6ICfguKEu4LiELl/guIEu4LieLl/guKHguLUu4LiELl/guYDguKEu4LiiLl/guJ4u4LiELl/guKHguLQu4LiiLl/guIEu4LiELl/guKou4LiELl/guIEu4LiiLl/guJUu4LiELl/guJ4u4LiiLl/guJgu4LiELicuc3BsaXQoJ18nKSxcbiAgbW9udGhzUGFyc2VFeGFjdDogdHJ1ZSxcbiAgd2Vla2RheXM6ICfguK3guLLguJfguLTguJXguKLguYxf4LiI4Lix4LiZ4LiX4Lij4LmMX+C4reC4seC4h+C4hOC4suC4o1/guJ7guLjguJhf4Lie4Lik4Lir4Lix4Liq4Lia4LiU4Li1X+C4qOC4uOC4geC4o+C5jF/guYDguKrguLLguKPguYwnLnNwbGl0KCdfJyksXG4gIHdlZWtkYXlzU2hvcnQ6ICfguK3guLIuX+C4iC5f4LitLl/guJ4uX+C4nuC4pC5f4LioLl/guKouJy5zcGxpdCgnXycpLCAvLyB5ZXMsIHRocmVlIGNoYXJhY3RlcnMgZGlmZmVyZW5jZVxuICB3ZWVrZGF5c01pbjogJ+C4reC4si5f4LiILl/guK0uX+C4ni5f4Lie4LikLl/guKguX+C4qi4nLnNwbGl0KCdfJyksXG4gIHdlZWtkYXlzUGFyc2VFeGFjdDogdHJ1ZSxcbiAgbG9uZ0RhdGVGb3JtYXQ6IHtcbiAgICBMVDogJ0g6bW0nLFxuICAgIExUUzogJ0g6bW06c3MnLFxuICAgIEw6ICdERC9NTS9ZWVlZJyxcbiAgICBMTDogJ0QgTU1NTSBZWVlZJyxcbiAgICBMTEw6ICdEIE1NTU0gWVlZWSDguYDguKfguKXguLIgSDptbScsXG4gICAgTExMTDogJ+C4p+C4seC4mWRkZGTguJfguLXguYggRCBNTU1NIFlZWVkg4LmA4Lin4Lil4LiyIEg6bW0nXG4gIH0sXG4gIG1lcmlkaWVtUGFyc2U6IC/guIHguYjguK3guJnguYDguJfguLXguYjguKLguId84Lir4Lil4Lix4LiH4LmA4LiX4Li14LmI4Lii4LiHLyxcbiAgaXNQTShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCA9PT0gJ+C4q+C4peC4seC4h+C5gOC4l+C4teC5iOC4ouC4hyc7XG4gIH0sXG4gIG1lcmlkaWVtKGhvdXIsIG1pbnV0ZSwgaXNMb3dlcikge1xuICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgIHJldHVybiAn4LiB4LmI4Lit4LiZ4LmA4LiX4Li14LmI4Lii4LiHJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICfguKvguKXguLHguIfguYDguJfguLXguYjguKLguIcnO1xuICAgIH1cbiAgfSxcbiAgY2FsZW5kYXI6IHtcbiAgICBzYW1lRGF5OiAnW+C4p+C4seC4meC4meC4teC5iSDguYDguKfguKXguLJdIExUJyxcbiAgICBuZXh0RGF5OiAnW+C4nuC4o+C4uOC5iOC4h+C4meC4teC5iSDguYDguKfguKXguLJdIExUJyxcbiAgICBuZXh0V2VlazogJ2RkZGRb4Lir4LiZ4LmJ4LiyIOC5gOC4p+C4peC4sl0gTFQnLFxuICAgIGxhc3REYXk6ICdb4LmA4Lih4Li34LmI4Lit4Lin4Liy4LiZ4LiZ4Li14LmJIOC5gOC4p+C4peC4sl0gTFQnLFxuICAgIGxhc3RXZWVrOiAnW+C4p+C4seC4mV1kZGRkW+C4l+C4teC5iOC5geC4peC5ieC4pyDguYDguKfguKXguLJdIExUJyxcbiAgICBzYW1lRWxzZTogJ0wnXG4gIH0sXG4gIHJlbGF0aXZlVGltZToge1xuICAgIGZ1dHVyZTogJ+C4reC4teC4gSAlcycsXG4gICAgcGFzdDogJyVz4LiX4Li14LmI4LmB4Lil4LmJ4LinJyxcbiAgICBzOiAn4LmE4Lih4LmI4LiB4Li14LmI4Lin4Li04LiZ4Liy4LiX4Li1JyxcbiAgICBzczogJyVkIOC4p+C4tOC4meC4suC4l+C4tScsXG4gICAgbTogJzEg4LiZ4Liy4LiX4Li1JyxcbiAgICBtbTogJyVkIOC4meC4suC4l+C4tScsXG4gICAgaDogJzEg4LiK4Lix4LmI4Lin4LmC4Lih4LiHJyxcbiAgICBoaDogJyVkIOC4iuC4seC5iOC4p+C5guC4oeC4hycsXG4gICAgZDogJzEg4Lin4Lix4LiZJyxcbiAgICBkZDogJyVkIOC4p+C4seC4mScsXG4gICAgTTogJzEg4LmA4LiU4Li34Lit4LiZJyxcbiAgICBNTTogJyVkIOC5gOC4lOC4t+C4reC4mScsXG4gICAgeTogJzEg4Lib4Li1JyxcbiAgICB5eTogJyVkIOC4m+C4tSdcbiAgfVxufTtcbiJdfQ==