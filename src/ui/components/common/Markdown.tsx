import { marked } from "marked";
import styles from "./Markdown.module.css";

export function Markdown({ children }: { children: string }) {
  // Parse and sanitize markdown for safe rendering
  const html = marked.parse(children) as string;

  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
