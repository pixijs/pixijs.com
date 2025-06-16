# Contributing to the PixiJS Showcase

We love seeing what the community creates with PixiJS! If you’ve built something cool and want to share it with the world, you can add your project to our showcase by following the steps below.

---

## Image Requirements

To keep the showcase looking clean and consistent, please follow these image guidelines:

* **Dimensions**: \~460×260 pixels (landscape orientation)
* **Formats accepted**: `.avif`, `.webp`, `.png`, `.jpg`, `.jpeg`
* **Max file size**: 200 KB
* **Quality**: High-resolution, crisp screenshot that best represents your project

Add your image to the [`static/showcase/`](/static/showcase/) directory in the repository.

---

## Project Information Format

Your project entry must follow this TypeScript interface:

```ts
interface ShowcaseItem {
  title: string; // Project name
  author: string; // Your name or organization
  imageUrl: string; // Path to the showcase image
  link: string; // URL to live project/demo
  alt?: string; // Alt text for screen readers
  isSponsored?: boolean; // Mark only if you're an official sponsor
  isOpenSource?: boolean; // Is your code open source?
}
```

Example entry:

```ts
{
  title: 'Your Amazing Project',
  author: 'Your Name',
  imageUrl: '/showcase/your-image.png',
  link: 'https://your-project.com',
  isOpenSource: true,
}
```

Add this object to the `showcaseItems` array in [`src/pages/showcase/content.ts`](/src/pages/showcase/content.ts).

---

## 🚀 Submission Steps

1. **Fork** the [PixiJS website repository](https://github.com/pixijs/pixijs.com).

2. **Create a new branch** for your contribution:

   ```bash
   git checkout -b showcase/your-project-name
   ```

3. **Add your image** to [`static/showcase/`](/static/showcase/):

   ```bash
   cp your-image.png static/showcase/
   ```

4. **Update** the `showcaseItems` array in [`src/pages/showcase/content.ts`](/src/pages/showcase/content.ts) with your project.

5. **Test** the site locally to make sure everything renders properly:

   ```bash
   npm install
   npm run start
   ```

6. **Open a Pull Request** with the title in this format:

   ```
   [showcase]: your project name
   ```

---

## Guidelines & Final Notes

* Please only submit projects that **use PixiJS**.
* Make sure your image is **visually clear** and **represents your project well**.
* Projects must be **safe for work** and adhere to our [Code of Conduct](https://github.com/pixijs/pixijs/blob/dev/.github/CODE_OF_CONDUCT.md).
* We reserve the right to **decline submissions** that don't meet our quality standards or showcase goals.
