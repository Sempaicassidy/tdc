# Tanzania Developers Community (TDC)

The website of the Tanzania Developers Community. It is a single page: a grid of member tiles that fills any screen, with a search bar and skill tags to filter people, a tile to join the WhatsApp group, and a tile that explains how to add yourself.

There is no backend and no database. Every member lives in one file, [`data/members.ts`](data/members.ts), and the site grows as people add themselves to it through pull requests.

## Add yourself

1. Open [`data/members.ts`](data/members.ts) on GitHub and click the pencil icon. GitHub forks the repository for you if you do not have write access.
2. Add your entry at the end of the `members` list.
3. Commit, open a pull request, and your tile appears once it is merged.

```ts
{
  name: "Your Name",
  github: "your-github-username",
  title: "Frontend Engineer",
  location: "Dar es Salaam",
  bio: "One or two sentences about what you build.",
  skills: {
    languages: ["TypeScript"],
    frontend: ["React", "Next.js"],
    design: ["Figma"],
  },
  links: {
    website: "https://your-site.dev",
    linkedin: "https://linkedin.com/in/you",
    x: "yourhandle",
  },
  openToWork: true,
  hireContact: "you@example.com",
},
```

| Field | What it does |
| --- | --- |
| `name` | Your full name. Required. |
| `github` | Your GitHub username. Required, your photo comes from it. |
| `avatar` | Optional image URL if you prefer a different photo. |
| `title` | A short role, like Mobile Engineer. |
| `location` | A city or country. |
| `bio` | One or two sentences, up to 200 characters. |
| `skills` | Your stack, grouped by category. See below. |
| `links` | Any of `website`, `linkedin`, `x` and `email`. |
| `openToWork` | Set to `true` to show a gold dot on your tile and a Hire me button on your card. |
| `hireContact` | Where Hire me sends people, an email address or a link. Without it, your email, LinkedIn, website or GitHub is used, in that order. |

### Skills

Skills are grouped under `languages`, `frontend`, `backend`, `mobile`, `desktop`, `design`, `devops`, `data` and `ai`. The allowed values for each group live in [`data/skills.ts`](data/skills.ts), so your editor autocompletes them and the build fails on a typo. This keeps tags consistent across members, which is what makes the filter tags under the search bar work.

If your skill is missing, add it to the right list in `data/skills.ts` in the same pull request.

## How the page works

- The grid has as many columns as the screen allows and as many rows as it needs.
- The first tile adds you, the second opens the WhatsApp rules and invite, and every other tile is a member.
- When there are fewer members than cells, members are scattered across the visible cells, leaving open spots that show there is room for more people.
- Tiles swap places every few seconds. The shuffle pauses while you hover a tile, search, or have a card open, and it is off for people who prefer reduced motion.
- Five tags are picked at random from everyone's skills. Click one to filter, or use the shuffle button for a different set.
- Each member card has its own link, for example `https://tdcdevs.xyz/#alphaolomi`.

## Development

This project uses [Bun](https://bun.sh).

```bash
bun install
```

```bash
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Linting and formatting use [Biome](https://biomejs.dev). Run `check` before opening a pull request, it formats the code and applies safe fixes.

```bash
bun run check
```

```bash
bun run lint
```

```bash
bun run build
```

## Project structure

- `app/` Next.js App Router entry, layout, metadata, sitemap and the 404 page.
- `components/community-grid.tsx` The grid, shuffle, filtering and dialog state.
- `components/tiles.tsx` Member, action and open spot tiles.
- `components/member-dialog.tsx`, `join-dialog.tsx`, `whatsapp-dialog.tsx` The cards that open from tiles.
- `components/search-dock.tsx` The floating search bar and tags.
- `data/members.ts` Every member of the community.
- `data/skills.ts` The skill vocabulary used for tags.
- `data/rules.ts` WhatsApp group rules.
- `data/community.ts` Community links, including the WhatsApp invite and repository.
- `lib/grid.ts` Grid sizing, scatter and shuffle logic.
- `lib/members.ts` Search, tags and link helpers.

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Radix Dialog and Lucide icons.

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, improving the UI, or adding new features, your help is appreciated.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## ⭐ Star the Repository

If you find this project useful or interesting, please consider giving it a star! It helps others discover the project and motivates us to keep improving it.

[![GitHub stars](https://img.shields.io/github/stars/astrod333/tdc?style=social)](https://github.com/astrod333/tdc/stargazers)


## License

[MIT](LICENSE)

Built with ❤️ by Astro.
