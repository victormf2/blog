import enquirer from 'enquirer'
import fs from 'fs'
import path from 'path'

async function createDraft() {
  const { title } = await enquirer.prompt([
    {
      name: 'title',
      message: 'Título do rascunho:',
      type: 'text',
      required: true,
    },
  ])

  const titleSlugCase = toSlugCase(title)

  fs.mkdirSync('_drafts', { recursive: true })
  const file = path.join('_drafts', `${titleSlugCase}.md`)

  const fileContent = `
---
title: ${title}
---
  
  `.trimStart()

  fs.writeFileSync(file, fileContent)

  console.log(`Rascunho criado em ${file}`)
}
createDraft()

function toSlugCase(str) {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
}
