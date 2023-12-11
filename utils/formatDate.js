//Data array to transform the number returned by the .getMonth method of the native JavaScript Date class-constructor into the first three letters of the corresponding month.
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
//This function will format the string values of the createdAt properties of thoughts and reactions.
function formatDate(date) {

    const monthNum = new Date(date).getMonth();
    const month = months[monthNum];
    let day;
    if(new Date(date).getDate() === 1) day = `1st`;
    if(new Date(date).getDate() === 2) day = `2nd`;
    if(new Date(date).getDate() === 3) day = `3rd`;
    if(new Date(date).getDate() > 3) day = `${new Date(date).getDate()}th`;
    const year = new Date(date).getFullYear();

    let hours = new Date(date).getHours() % 12 ? new Date(date).getHours() % 12 : 12;
    let minutes = new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes();

    let newFormat = new Date(date).getHours() >= 12 ? 'PM' : 'AM';


    return `${month} ${day}, ${year} at ${hours}:${minutes}${newFormat}`;
}

module.exports = formatDate;