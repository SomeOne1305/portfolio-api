import { Project } from '../entities/project.entity';
import { IContact } from '../interfaces';

function convertToUzbekistanTime(dateTime: Date) {
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
  } as Intl.DateTimeFormatOptions;
  return uzbekistanTime.toLocaleString('en-US', options);
}

export function ToMessage(args: IContact) {
  const date = convertToUzbekistanTime(new Date());
  console.log(date);

  return `
	📬 <b>Contact Form</b>\n
- <b>Name:</b> ${args.name}
- <b>Email:</b> ${args.email}
- <b>Username:</b> ${args.username} 
- <b>Message:</b> ${args.message}
\n
-<b>Time:</b> ${date}
	`;
}

export function projectText(project: Project) {
  return `
  <b>🚀 Project name: </b>${project.title}\n
<b>ℹ️ Description: </b>${project.description}\n
<b>⚙️ Stacks: </b>${project.stacks.map((stack) => stack.name).join(',')}\n
<b>🌐 Link: </b>${project.url}
  `;
}
