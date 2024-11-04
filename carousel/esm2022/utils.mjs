/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export function findLastIndex(array, predicate) {
    let l = array.length;
    while (l--) {
        if (predicate(array[l], l, array)) {
            return l;
        }
    }
    return -1;
}
export function chunkByNumber(array, size) {
    const out = [];
    const n = Math.ceil(array.length / size);
    let i = 0;
    while (i < n) {
        const chunk = array.splice(0, i === n - 1 && size < array.length ? array.length : size);
        out.push(chunk);
        i++;
    }
    return out;
}
export function isNumber(value) {
    return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Fyb3VzZWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUksS0FBVSxFQUFFLFNBQXlEO0lBQ3BHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFFckIsT0FBTyxDQUFDLEVBQUUsRUFBRTtRQUNWLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDakMsT0FBTyxDQUFDLENBQUM7U0FDVjtLQUNGO0lBRUQsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFJLEtBQVUsRUFBRSxJQUFZO0lBQ3ZELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNmLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDWixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEYsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQixDQUFDLEVBQUUsQ0FBQztLQUNMO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxLQUFlO0lBQ3RDLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztBQUNsRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBlbGVtZW50IGluIHRoZSBhcnJheSB3aGVyZSBwcmVkaWNhdGUgaXMgdHJ1ZSwgYW5kIC0xXG4gKiBvdGhlcndpc2UuXG4gKiBAcGFyYW0gYXJyYXkgVGhlIHNvdXJjZSBhcnJheSB0byBzZWFyY2ggaW5cbiAqIEBwYXJhbSBwcmVkaWNhdGUgZmluZCBjYWxscyBwcmVkaWNhdGUgb25jZSBmb3IgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSwgaW4gZGVzY2VuZGluZ1xuICogb3JkZXIsIHVudGlsIGl0IGZpbmRzIG9uZSB3aGVyZSBwcmVkaWNhdGUgcmV0dXJucyB0cnVlLiBJZiBzdWNoIGFuIGVsZW1lbnQgaXMgZm91bmQsXG4gKiBmaW5kTGFzdEluZGV4IGltbWVkaWF0ZWx5IHJldHVybnMgdGhhdCBlbGVtZW50IGluZGV4LiBPdGhlcndpc2UsIGZpbmRMYXN0SW5kZXggcmV0dXJucyAtMS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMYXN0SW5kZXg8VD4oYXJyYXk6IFRbXSwgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIG9iajogVFtdKSA9PiBib29sZWFuKTogbnVtYmVyIHtcbiAgbGV0IGwgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKGwtLSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbbF0sIGwsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2h1bmtCeU51bWJlcjxUPihhcnJheTogVFtdLCBzaXplOiBudW1iZXIpOiBUW11bXSB7XG4gIGNvbnN0IG91dCA9IFtdO1xuICBjb25zdCBuID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIHNpemUpO1xuICBsZXQgaSA9IDA7XG5cbiAgd2hpbGUgKGkgPCBuKSB7XG4gICAgY29uc3QgY2h1bmsgPSBhcnJheS5zcGxpY2UoMCwgaSA9PT0gbiAtIDEgJiYgc2l6ZSA8IGFycmF5Lmxlbmd0aCA/IGFycmF5Lmxlbmd0aCA6IHNpemUpO1xuXG4gICAgb3V0LnB1c2goY2h1bmspO1xuICAgIGkrKztcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlcih2YWx1ZT86IHVua25vd24pOiB2YWx1ZSBpcyBudW1iZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBOdW1iZXJdJztcbn1cbiJdfQ==