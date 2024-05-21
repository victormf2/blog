import { format as dateFnsFormat } from 'date-fns/format'
import enquirer from 'enquirer'
import fs from 'fs'
import path from 'path'
import { readFrontmatter } from './frontmatter.js'

async function createPostFromDraft() {
  const drafts = getDrafts()

  if (drafts.length === 0) {
    console.warn('Não há rascunhos a serem selecionados')
    return
  }

  const { draft } = await enquirer.prompt([
    {
      type: 'select',
      name: 'draft',
      message: 'Selecione um rascunho:',
      required: true,
      choices: drafts.map((draft) => {
        return {
          message: draft.title,
          // for some reason "name" is the actual selected value
          name: draft,
        }
      }),
    },
  ])

  const formattedDate = dateFnsFormat(new Date(), 'yyyy-MM-dd')
  const titleSlugCase = toSlugCase(draft.title)

  const postFile = path.join('_posts', `${formattedDate}-${titleSlugCase}.md`)

  const fileContent = fs.readFileSync(draft.file)

  fs.writeFileSync(postFile, fileContent)
  console.log(`Post criado em ${postFile}`)
  fs.rmSync(draft.file)
}
createPostFromDraft()

function getDrafts() {
  const draftFiles = fs.readdirSync('_drafts')
  const drafts = draftFiles.map((file) => {
    const fullPath = path.join('_drafts', file)
    const frontmatter = readFrontmatter(fullPath)
    const title = frontmatter.title || getTitleFromFileName(file)
    return { file: fullPath, title }
  })

  return drafts
}

/**
 * @param {string} file
 */
function getTitleFromFileName(file) {
  const fileWithoutExtension = file.split('.')[0]
  const parts = fileWithoutExtension.split('-')
  const title = parts.map(capitalize).join(' ')
  return title
}

function capitalize(str) {
  if (!str) return str // Check for empty string
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toSlugCase(str) {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
}
