import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { codegen } from "@graphql-codegen/core";
import { plugin as typedDocumentNodePlugin } from "@graphql-codegen/typed-document-node";
import { plugin as typescriptOperationsPlugin } from "@graphql-codegen/typescript-operations";
import { plugin as typescriptPlugin } from "@graphql-codegen/typescript";
import { buildASTSchema, parse } from "graphql";
import { parse as parseYaml } from "yaml";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(frontendRoot, "codegen.yml");
const config = parseYaml(await readFile(configPath, "utf8"));
const schemaDocument = parse(await readFile(path.resolve(frontendRoot, config.schema), "utf8"));
const outputEntries = Object.entries(config.generates ?? {});

if (outputEntries.length !== 1) {
  throw new Error(`Expected one GraphQL Codegen output in ${configPath}`);
}

const [outputName, outputConfig] = outputEntries[0];
const outputPath = path.resolve(frontendRoot, outputName);
const sourceRoot = path.join(frontendRoot, "src");
const plugins = outputConfig.plugins.map((plugin) =>
  typeof plugin === "string" ? { [plugin]: {} } : plugin,
);

async function findGraphqlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findGraphqlFiles(entryPath);
      return entry.isFile() && entry.name.endsWith(".graphql") ? [entryPath] : [];
    }),
  );
  return nestedFiles.flat();
}

const documents = await Promise.all(
  (await findGraphqlFiles(sourceRoot))
    .sort()
    .map(async (location) => ({
      location,
      document: parse(await readFile(location, "utf8")),
    })),
);

const pluginMap = {
  typescript: { plugin: typescriptPlugin },
  "typescript-operations": { plugin: typescriptOperationsPlugin },
  "typed-document-node": { plugin: typedDocumentNodePlugin },
};

const generated = await codegen({
  filename: outputPath,
  schema: schemaDocument,
  schemaAst: buildASTSchema(schemaDocument),
  documents,
  config: {},
  plugins,
  pluginMap,
});

await writeFile(outputPath, generated);
