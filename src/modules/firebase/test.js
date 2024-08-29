const { join } = require('path');

console.log(
  join(
    __dirname,
    '../../../portfolio-3e371-firebase-adminsdk-mdm1b-45935ae7c3.json',
  ),
);

const file = new URL(
  'https://firebasestorage.googleapis.com/v0/b/portfolio-3e371.appspot.com/o/49ed27649ae14a87117a.png?alt=media&token=6093e0cb-0f2d-42d7-af00-491ccb394316',
).pathname.split('/o/')[1];

console.log(file);

function convertToUzbekistanTime(dateTime) {
  // Create a new Date object from the input date and time
  const date = new Date(dateTime);

  // Get the UTC offset for Uzbekistan (UTC+5)
  const uzbekistanOffset = 5 * 60; // 5 hours in minutes

  // Calculate the Uzbekistan time
  const uzbekistanTime = new Date(
    date.getTime() + uzbekistanOffset * 60 * 1000,
  );

  // Format the date and time
  const options = {
    timeZone: 'Asia/Tashkent',
    dateStyle: 'full',
    timeStyle: 'long',
  };
  return uzbekistanTime.toLocaleString('en-US', options);
}
console.log(convertToUzbekistanTime(new Date().toISOString()));
