const fs = require('fs')
const os = require('os')
const YAML = require('yaml')
const { format: dateFnsFormat } = require('date-fns/format')

const fileNames = process.argv.slice(2);

for (const file of fileNames) {
  addDates(file)
}

function addDates(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' }).trimStart()

  if (!fileContent.startsWith('---')) {
    return
  }

  const frontMatterTerminatorIndex = fileContent.indexOf('---', 3)
  if (frontMatterTerminatorIndex < 0) {
    return
  }

  const frontMatterContent = fileContent.substring(3, frontMatterTerminatorIndex).trim()

  const frontMatter = YAML.parse(frontMatterContent)

  const lastModifiedAt = getLastModifiedDate(file)
  const createdAt = getCreationDate(file)

  frontMatter.date = formatDate(createdAt)
  frontMatter.last_modified_at = formatDate(lastModifiedAt)
  
  const updatedFrontMatterContent = YAML.stringify(frontMatter)

  const fileContentAfterFrontMatter = fileContent.substring(frontMatterTerminatorIndex + 3)
  const updatedFileContent = `---${os.EOL}${updatedFrontMatterContent}---${fileContentAfterFrontMatter}`

  fs.writeFileSync(file, updatedFileContent)
}

function formatDate(date) {
  // Get the timezone offset in minutes and convert it to hours and minutes
  const offset = date.getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hoursOffset = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutesOffset = String(absOffset % 60).padStart(2, '0');
  const sign = offset > 0 ? '-' : '+';
  const formattedOffset = `${sign}${hoursOffset}${minutesOffset}`;

  // Format the date
  const formattedDate = dateFnsFormat(date, 'yyyy-MM-dd HH:mm:ss');

  // Combine the formatted date and the timezone offset
  return `${formattedDate} ${formattedOffset}`;
}

function getLastModifiedDate(file) {
  const stat = fs.statSync(file)
  return stat.mtime
}

function getCreationDate(file) {
  const stat = fs.statSync(file)
  return stat.birthtime
}