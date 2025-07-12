import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import Slugger from 'github-slugger';

export function remarkExtractHeadings() {
  return function (tree, file) {
    const slugger = new Slugger();
    const headings = [];

    visit(tree, 'heading', (node) => {
      const text = toString(node);
      // #記号を除去（もし含まれていた場合）
      const cleanText = text.replace(/^#+\s*/, '').replace(/\s*#*$/, '');
      const slug = slugger.slug(cleanText);
      
      headings.push({
        depth: node.depth,
        text: cleanText,
        slug,
      });
    });

    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    file.data.astro.frontmatter.headings = headings;
  };
}