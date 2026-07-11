import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

// Conteúdo legal vive nos messages/*.json como blocos estruturados (i18n).
// Este renderer transforma esses blocos no markup que o `.prose-legal`
// (globals.css) estiliza. O texto suporta um markup inline mínimo:
//   **negrito**            → <strong>
//   [rótulo](/interno)     → <Link> do next-intl (href começa com "/")
//   [rótulo](mailto:…)     → <a> comum (qualquer outro href)
export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

function renderLinks(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const [, label, href] = m;
    nodes.push(
      href.startsWith("/") ? (
        <Link key={`${key}-${i}`} href={href}>
          {label}
        </Link>
      ) : (
        <a key={`${key}-${i}`} href={href}>
          {label}
        </a>
      ),
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderInline(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  BOLD_RE.lastIndex = 0;
  while ((m = BOLD_RE.exec(text)) !== null) {
    if (m.index > last)
      nodes.push(...renderLinks(text.slice(last, m.index), `${key}-t${i}`));
    nodes.push(
      <strong key={`${key}-b${i}`}>{renderLinks(m[1], `${key}-b${i}`)}</strong>,
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length)
    nodes.push(...renderLinks(text.slice(last), `${key}-t${i}`));
  return nodes;
}

export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{renderInline(block.text, `h${i}`)}</h2>;
          case "p":
            return <p key={i}>{renderInline(block.text, `p${i}`)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `u${i}-${j}`)}</li>
                ))}
              </ul>
            );
          case "blockquote":
            return (
              <blockquote key={i}>
                <p>{renderInline(block.text, `q${i}`)}</p>
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {block.head.map((cell, j) => (
                        <th key={j}>{renderInline(cell, `th${i}-${j}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci}>
                            {renderInline(cell, `td${i}-${ri}-${ci}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
