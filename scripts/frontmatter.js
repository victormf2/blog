import fs from 'fs'
import os from 'os'
import YAML from 'yaml'

/**
 *
 * @param {string} file
 */
export function readFrontmatter(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' }).trimStart()

  if (!fileContent.startsWith('---')) {
    return {}
  }

  const frontMatterTerminatorIndex = fileContent.indexOf('---', 3)
  if (frontMatterTerminatorIndex < 0) {
    return {}
  }

  const frontMatterContent = fileContent
    .substring(3, frontMatterTerminatorIndex)
    .trim()

  const frontmatter = YAML.parse(frontMatterContent)

  return frontmatter
}

export function writeFrontmatter(file, frontmatter) {
  const frontmatterContent = YAML.stringify(frontmatter)
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' }).trimStart()

  if (!fileContent.startsWith('---')) {
    fs.writeFileSync(
      file,
      `---${os.EOL}${frontmatterContent}---${os.EOL}${os.EOL}${fileContent}`,
    )
    return
  }

  const frontMatterTerminatorIndex = fileContent.indexOf('---', 3)
  if (frontMatterTerminatorIndex < 0) {
    fs.writeFileSync(
      file,
      `---${os.EOL}${frontmatterContent}---${os.EOL}${os.EOL}${fileContent}`,
    )
    return
  }

  const fileContentAfterFrontMatter = fileContent.substring(
    frontMatterTerminatorIndex + 3,
  )

  fs.writeFileSync(
    file,
    `---${os.EOL}${frontmatterContent}---${fileContentAfterFrontMatter}`,
  )
}
