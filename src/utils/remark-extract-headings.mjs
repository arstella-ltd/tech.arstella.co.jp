import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import Slugger from 'github-slugger';

export function remarkExtractHeadings() {
  return function (tree, file) {
    const slugger = new Slugger();
    const headings = [];

    visit(tree, 'heading', (node) => {
      const text = toString(node);
      const slug = slugger.slug(text);
      
      headings.push({
        depth: node.depth,
        text,
        slug,
      });
    });

    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    file.data.astro.frontmatter.headings = headings;
  };
}