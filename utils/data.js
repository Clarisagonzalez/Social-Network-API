//Data to generate random usernames
const names = [
    'Aaran',
    'Aaren',
    'Aarez',
    'Aarman',
    'Aaron',
    'Aaron-James',
    'Aarron',
    'Aaryan',
    'Aaryn',
    'Aayan',
    'Aazaan',
    'Abaan',
    'Abbas',
    'Abdallah',
    'Abdalroof',
    'Abdihakim',
    'Abdirahman',
    'Abdisalam',
    'Abdul',
    'Abdul-Aziz',
    'Abdulbasir',
    'Abdulkadir',
    'Abdulkarem',
    'Smith',
    'Jones',
    'Coollastname',
    'enter_name_here',
    'Ze',
    'Zechariah',
    'Zeek',
    'Zeeshan',
    'Zeid',
    'Zein',
    'Zen',
    'Zendel',
    'Zenith',
    'Zennon',
    'Zeph',
    'Zerah',
    'Zhen',
    'Zhi',
    'Zhong',
    'Zhuo',
    'Zi',
    'Zidane',
    'Zijie',
    'Zinedine',
    'Zion',
    'Zishan',
    'Ziya',
    'Ziyaan',
    'Zohaib',
    'Zohair',
    'Zoubaeir',
    'Zubair',
    'Zubayr',
    'Zuriel',
    'Xander',
    'Jared',
    'Courtney',
    'Gillian',
    'Clark',
    'Jared',
    'Grace',
    'Kelsey',
    'Tamar',
    'Alex',
    'Mark',
    'Tamar',
    'Farish',
    'Sarah',
    'Nathaniel',
    'Parker',
];
//Data to get random reactions to user's thoughts
const reactions = [
    'Decision Trackers are awesome',
    'Find My Phone is a useful app',
    'Learn Piano is not very good for learning Piano',
    'Starbase Defender is a great game, I love it',
    'Tower Defense is okay',
    'Monopoly Money is better than real money IMO',
    'Movie trailers are just the best parts of a movie distilled into 90 seconds',
    'Hello world, this is a comment',
    'Social media is a big waste of time',
    'Notes is my most used app',
    'Messages is open on my computer 24/7',
    'Email is open on my computer',
    'Compass is never opened',
    'Firefox is great for privacy',
    'I disagree!',
    'I tried your algorithm, here were the results',
    'This was awesome',
    'Thank you for the great content',
    'Please check out my video response',
    'Like and subscribe to my channel please',
    'Reply: The side effects of in app purchases on digital marketplaces'
];
//Data to generate random thoughts (in pseudo-Latin) one word at a time.
const lorum = [
    'lorem',
    'imsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'curabitur',
    'vel',
    'hendrerit',
    'libero',
    'eleifend',
    'blandit',
    'nunc',
    'ornare',
    'odio',
    'ut',
    'orci',
    'gravida',
    'imperdiet',
    'nullam',
    'purus',
    'lacinia',
    'a',
    'pretium',
    'quis',
];
//Data to add a domain to each randomly generated email address
const domain = [
    'gmail',
    'hotmail',
    'aol',
    'yahoo',
    'outlook'
];
//Given an array of any length, generate a random valid index.
const genRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

// Get a random item given an array
const getRandomArrItem = (arr) => arr[genRandomIndex(arr)];

// Function to generate random usernames
const getRandomUserName = () =>
    `${getRandomArrItem(names)}${Math.floor(Math.random() * 10**3 + 1)}`;
//Gets a random domain for each email address that is persisted to the database.
const getRandomDomain = () => `${domain[genRandomIndex(domain)]}`;
//Generates a random thought with the specified number of words (passed through the 'words' parameter) from the 'lorum' array 
const getRandomThought = (words) => {
    let thoughtText = `${getRandomArrItem(lorum)}`;
    for (let i = 1; i < words; i++) {
        thoughtText += ` ${getRandomArrItem(lorum)}`;
    };
    return thoughtText;
};

// Function to generate an array of random reactions to a particular thought given a number (which will become the length of the reactions array) and an array from which to pull a valid username.
const getRandomReactions = (int, arr) => {
    const results = [];
    for (let i = 0; i < int; i++) {
        results.push({
            reactionBody: getRandomArrItem(reactions),
            username: getRandomArrItem(arr)
        });
    }
    return results;
};
// Export the functions for use in seed.js
module.exports = {
    getRandomUserName,
    getRandomThought,
    getRandomReactions,
    getRandomDomain,
    getRandomArrItem
};
