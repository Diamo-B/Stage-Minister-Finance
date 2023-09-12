//=>  
function arraysAreEqual(arr1:Array<any>, arr2:Array<any>) {
    // Sort both arrays
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    // Use .every() to compare elements
    return (
        sortedArr1.length === sortedArr2.length &&
        sortedArr1.every((value, index) => value === sortedArr2[index])
    );
}
export default arraysAreEqual;