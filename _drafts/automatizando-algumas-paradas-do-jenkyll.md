---
title: Automatizando algumas paradas do Jekyll
---

Um belo dia eu decidi que seria legal compartilhar um pouco do meu conhecimento com o mundo. Trabalho com programação desde 2011, ou seja, já tenho mais de uma década de experiência com esse negócio.

Então eu resolvi que criaria um blog. Eu poderia ter feito esse blog usando alguma plataforma pra facilitar a minha vida, mas eu decidi que faria usando o [GitHub Pages](https://pages.github.com/) com alguma solução de geração de HTML a partir de arquivos Markdown e que me permitisse customizar o tema. Pelo menos eu me divirto e aprendo alguma coisa.

Foi aí que eu encontrei o [Jekyll](https://jekyllrb.com/). E neste post eu vou explicar algumas coisas que eu fiz pra facilitar a criação e edição de posts com o Jekyll.

## Objetivos

- Mostrar a data de criação e de última atualização dos meus posts.
- Fazer isso de forma que eu não precise digitar essas datas manualmente.

O tema que eu escolhi [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) já fornece a [opção de mostrar essas datas](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#post-dates). O problema pra mim é que eu precisaria fornecer isso no [front matter](https://jekyllrb.com/docs/front-matter/) dos meus posts. Então eu pensei em uma solução para automatizar esse processo.

## Solução

Os arquivos contém informação de data e hora de quando foram criados e da última vez que foram editados. Com isso, eu posso criar algum script que pegue essa informação e atualize o front matter dos meus posts.

O [lint-staged](https://github.com/lint-staged/lint-staged) é uma ferramenta que se usada junto com o [Husky](https://typicode.github.io/husky/) nos permite rodar um script para os arquivos que foram alterados no git no momento do commit.

Se eu criar um script que lê as datas de criação e atualização dos arquivos e atualiza no front matter e mandar ele rodar no pre-commit somente para os arquivos que foram alterados, então eu tenho a minha solução.
