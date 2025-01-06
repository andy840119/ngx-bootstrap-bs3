// compare two arrays, return the number of differences
import { toInt } from './type-checks';
export function compareArrays(array1, array2, dontConvert) {
    const len = Math.min(array1.length, array2.length);
    const lengthDiff = Math.abs(array1.length - array2.length);
    let diffs = 0;
    let i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i])
            || (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFyZS1hcnJheXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY2hyb25vcy91dGlscy9jb21wYXJlLWFycmF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1REFBdUQ7QUFDdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0QyxNQUFNLFVBQVUsYUFBYSxDQUFJLE1BQVcsRUFBRSxNQUFXLEVBQUUsV0FBb0I7SUFDN0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksQ0FBQyxDQUFDO0lBQ04sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7ZUFDdkMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM3RCxLQUFLLEVBQUUsQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxLQUFLLEdBQUcsVUFBVSxDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG5pbXBvcnQgeyB0b0ludCB9IGZyb20gJy4vdHlwZS1jaGVja3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZUFycmF5czxUPihhcnJheTE6IFRbXSwgYXJyYXkyOiBUW10sIGRvbnRDb252ZXJ0OiBib29sZWFuKSB7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpO1xuICBjb25zdCBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpO1xuICBsZXQgZGlmZnMgPSAwO1xuICBsZXQgaTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSlcbiAgICAgIHx8ICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgIGRpZmZzKys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbn1cbiJdfQ==