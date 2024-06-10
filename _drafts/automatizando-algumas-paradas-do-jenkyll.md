---
title: Como eu criei um blog usando Jekyll, Node.js e um pre-commit hook
---

Trabalho com programação desde 2011, ou seja, já tenho mais de uma década de experiência com esse negócio. Um belo dia eu decidi que seria legal compartilhar um pouco do meu conhecimento com o mundo. Então eu resolvi criar um blog.

Não fui muito atrás de plataformas de blog, porque eu queria algo gratuito e altamente customizável, e também queria brincar de código. Cheguei a pesquisar várias ferramentas open source e encontrei o [Jekyll](https://jekyllrb.com/), que faz exatamente isso que eu preciso e já tem uma integração com o [GitHub Pages](https://pages.github.com/).

O código do meu blog fica no repositório [{{ site.repository }}]({{ site.repository }}). Se você também quiser criar um blog no GitHub com Jekyll, eu recomendo começar por [este vídeo do YouTube](https://youtu.be/z6dx_OUChRs?si=Wp1yEuxfFM2BN0LB) do [Nasc](https://nasc.dev/).
{:.notice--info}


## Limitações do Jekyll
Para mim o fluxo perfeito seria começar criando meus posts como rascunhos. Quando eu terminar de escrever o rascunho, eu publico. Seria legal também mostrar a data de publicação e de última atualização dos posts.

É possível fazer tudo isso com o Jekyll, mas eles não fornecem nenhuma ferramenta que facilite esse trabalho. Pesquisei no google e encontrei alguns CMS, mas quando eu tiver tempo, eu tento configurar um. Por enquanto eu decidi fazer uma CLI para me ajudar.

## Rascunhos
O Jekyll nos permite criar rascunhos na pasta `\_drafts` e os posts publicados devem ficar na pasta `\_posts`. Minha ideia foi criar um comando para criar um rascunho e outro para publicar.

Eu até poderia criar os arquivos dos rascunhos na mão, mas por uma CLI eu só forneço o título e ela já gera o template mínimo para eu começar.
{% include github_code.html url="https://github.com/victormf2/blog/blob/284d9e536bc64050d018df29c2aa310ce57b0921/scripts/create_draft.js" %}

Para publicar, aparece um prompt para selecionar o rascunho a ser publicado. Um arquivo é criado com o nome no [formato requisitado pelo Jekyll](https://jekyllrb.com/docs/posts/#creating-posts). Depois o arquivo do rascunho é apagado.

Como será mostrado a seguir, as datas de criação e última modificação do arquivo serão usadas como as datas da publicação. Por isso o script cria um arquivo de post e deleta o de rascunho, se não a data de publicação seria considerada a data de criação do rascunho.
{% include github_code.html url="https://github.com/victormf2/blog/blob/284d9e536bc64050d018df29c2aa310ce57b0921/scripts/create_post_from_draft.js" %}

## Adicionando as datas automaticamente

O tema que eu escolhi [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) já fornece a opção de [mostrar datas de publicação e atualização](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#post-dates). O problema pra mim é que eu precisaria fornecer isso no [front matter](https://jekyllrb.com/docs/front-matter/) dos meus posts. Como eu não quero ter que ficar editando essas datas na mão, eu pensei em uma solução para automatizar esse processo.

Arquivos contém informação de data e hora de quando foram criados e da última vez que foram editados.

O [lint-staged](https://github.com/lint-staged/lint-staged) é uma ferramenta que se usada junto com o [Husky](https://typicode.github.io/husky/) nos permite rodar um script para os arquivos que foram alterados no git no momento do commit.

Para garantir que os posts que eu publicar tenham as datas de atualização e criação, eu precisei criar um script que atualiza o front matter com as datas do arquivo, e mandar esse script rodar no hook pre-commit com o lint-staged.

{% include github_code.html url="https://github.com/victormf2/blog/blob/284d9e536bc64050d018df29c2aa310ce57b0921/.lintstagedrc.json" %}
{% include github_code.html url="https://github.com/victormf2/blog/blob/284d9e536bc64050d018df29c2aa310ce57b0921/scripts/add_dates.js" %}

## Lidando com o frontmatter
Para ler e atualizar o frontmatter dos arquivos eu criei funções helpers.

A ideia é basicamente identificar no conteúdo do arquivo onde está o frontmatter e fazer um parse do YAML. E para atualizar basta substituir o conteúdo do frontmatter com o stringify do objeto representando o YAML.
{% include github_code.html url="https://github.com/victormf2/blog/blob/284d9e536bc64050d018df29c2aa310ce57b0921/scripts/frontmatter.js" %}

## Conclusão
Adicionando alguns scripts no package.json agora eu posso criar meus posts usando um fluxo bem fácil:
```bash
pnpm draft
# Edito o rascunho
pnpm post
# datas são adicionadas automaticamente com o hook pre-commit
git commit && git push
## Adiciono correções no post
git commit && git push
```

Crio meus posts e não preciso me preocupar em definir nomes de arquivo nem datas de atualização.