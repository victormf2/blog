import { format as dateFnsFormat } from 'date-fns/format'
import fs from 'fs'
import { readFrontmatter, writeFrontmatter } from './frontmatter'

function addDates() {
  const fileNames = process.argv.slice(2)

  for (const file of fileNames) {
    addDatesToFile(file)
  }
}
addDates()

function addDatesToFile(file) {
  const frontmatter = readFrontmatter(file)

  const lastModifiedAt = getLastModifiedDate(file)
  const createdAt = getCreationDate(file)

  frontmatter.date = formatDate(createdAt)
  frontmatter.last_modified_at = formatDate(lastModifiedAt)

  writeFrontmatter(file, frontmatter)
}

function formatDate(date) {
  // Get the timezone offset in minutes and convert it to hours and minutes
  const offset = date.getTimezoneOffset()
  const absOffset = Math.abs(offset)
  const hoursOffset = String(Math.floor(absOffset / 60)).padStart(2, '0')
  const minutesOffset = String(absOffset % 60).padStart(2, '0')
  const sign = offset > 0 ? '-' : '+'
  const formattedOffset = `${sign}${hoursOffset}${minutesOffset}`

  // Format the date
  const formattedDate = dateFnsFormat(date, 'yyyy-MM-dd HH:mm:ss')

  // Combine the formatted date and the timezone offset
  return `${formattedDate} ${formattedOffset}`
}

function getLastModifiedDate(file) {
  const stat = fs.statSync(file)
  return stat.mtime
}

function getCreationDate(file) {
  const stat = fs.statSync(file)
  return stat.birthtime
}
