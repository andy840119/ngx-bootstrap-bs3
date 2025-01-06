export function shift(data) {
    const placement = data.placement;
    const basePlacement = placement.split(' ')[0];
    const shiftVariation = placement.split(' ')[1];
    if (shiftVariation) {
        const { host, target } = data.offsets;
        const isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
        const side = isVertical ? 'left' : 'top';
        const measurement = isVertical ? 'width' : 'height';
        const shiftOffsets = {
            start: { [side]: host[side] },
            end: {
                [side]: (host[side] ?? 0) + host[measurement] - target[measurement]
            }
        };
        data.offsets.target = {
            ...target, ...{
                [side]: (side === shiftVariation ? shiftOffsets.start[side] : shiftOffsets.end[side])
            }
        };
    }
    return data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zaXRpb25pbmcvbW9kaWZpZXJzL3NoaWZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sVUFBVSxLQUFLLENBQUMsSUFBVTtJQUM5QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ2pDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvQyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxNQUFNLFVBQVUsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkUsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6QyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRXBELE1BQU0sWUFBWSxHQUFHO1lBQ25CLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLEdBQUcsRUFBRTtnQkFDSCxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2FBQ3BFO1NBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHO1lBQ3BCLEdBQUcsTUFBTSxFQUFFLEdBQUc7Z0JBQ1osQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEY7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGEgfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hpZnQoZGF0YTogRGF0YSk6IERhdGEge1xuICBjb25zdCBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcbiAgY29uc3QgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnICcpWzBdO1xuICBjb25zdCBzaGlmdFZhcmlhdGlvbiA9IHBsYWNlbWVudC5zcGxpdCgnICcpWzFdO1xuXG4gIGlmIChzaGlmdFZhcmlhdGlvbikge1xuICAgIGNvbnN0IHsgaG9zdCwgdGFyZ2V0IH0gPSBkYXRhLm9mZnNldHM7XG4gICAgY29uc3QgaXNWZXJ0aWNhbCA9IFsnYm90dG9tJywgJ3RvcCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xuICAgIGNvbnN0IHNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XG4gICAgY29uc3QgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuXG4gICAgY29uc3Qgc2hpZnRPZmZzZXRzID0ge1xuICAgICAgc3RhcnQ6IHsgW3NpZGVdOiBob3N0W3NpZGVdIH0sXG4gICAgICBlbmQ6IHtcbiAgICAgICAgW3NpZGVdOiAoaG9zdFtzaWRlXSA/PyAwKSArIGhvc3RbbWVhc3VyZW1lbnRdIC0gdGFyZ2V0W21lYXN1cmVtZW50XVxuICAgICAgfVxuICAgIH07XG5cbiAgICBkYXRhLm9mZnNldHMudGFyZ2V0ID0ge1xuICAgICAgLi4udGFyZ2V0LCAuLi57XG4gICAgICAgIFtzaWRlXTogKHNpZGUgPT09IHNoaWZ0VmFyaWF0aW9uID8gc2hpZnRPZmZzZXRzLnN0YXJ0W3NpZGVdIDogc2hpZnRPZmZzZXRzLmVuZFtzaWRlXSlcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iXX0=