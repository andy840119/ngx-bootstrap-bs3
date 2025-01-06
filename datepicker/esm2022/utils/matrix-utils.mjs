import { shiftDate } from 'ngx-bootstrap/chronos';
export function createMatrix(options, fn) {
    let prevValue = options.initialDate;
    const matrix = new Array(options.height);
    for (let i = 0; i < options.height; i++) {
        matrix[i] = new Array(options.width);
        for (let j = 0; j < options.width; j++) {
            matrix[i][j] = fn(prevValue);
            prevValue = shiftDate(prevValue, options.shift);
        }
    }
    return matrix;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvdXRpbHMvbWF0cml4LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBWSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQVc1RCxNQUFNLFVBQVUsWUFBWSxDQUMxQixPQUFzQixFQUN0QixFQUFxQjtJQUVyQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFVLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUaW1lVW5pdCwgc2hpZnREYXRlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9jaHJvbm9zJztcblxuZXhwb3J0IHR5cGUgQ3JlYXRlTWF0cml4Q2I8VD4gPSAoZGF0ZTogRGF0ZSkgPT4gVDtcblxuZXhwb3J0IGludGVyZmFjZSBNYXRyaXhPcHRpb25zIHtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGluaXRpYWxEYXRlOiBEYXRlO1xuICBzaGlmdDogVGltZVVuaXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRyaXg8VD4oXG4gIG9wdGlvbnM6IE1hdHJpeE9wdGlvbnMsXG4gIGZuOiBDcmVhdGVNYXRyaXhDYjxUPlxuKTogVFtdW10ge1xuICBsZXQgcHJldlZhbHVlID0gb3B0aW9ucy5pbml0aWFsRGF0ZTtcbiAgY29uc3QgbWF0cml4OiBUW11bXSA9IG5ldyBBcnJheShvcHRpb25zLmhlaWdodCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5oZWlnaHQ7IGkrKykge1xuICAgIG1hdHJpeFtpXSA9IG5ldyBBcnJheShvcHRpb25zLndpZHRoKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9wdGlvbnMud2lkdGg7IGorKykge1xuICAgICAgbWF0cml4W2ldW2pdID0gZm4ocHJldlZhbHVlKTtcbiAgICAgIHByZXZWYWx1ZSA9IHNoaWZ0RGF0ZShwcmV2VmFsdWUsIG9wdGlvbnMuc2hpZnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRyaXg7XG59XG4iXX0=