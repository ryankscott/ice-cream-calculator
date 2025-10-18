import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

let cachedDocument: Record<string, unknown> | null = null;

function loadDocument() {
	if (cachedDocument) {
		return cachedDocument;
	}

	const specPath = path.resolve(process.cwd(), "schema/ingredients.yaml");
	const raw = fs.readFileSync(specPath, "utf8");
	cachedDocument = YAML.parse(raw);
	return cachedDocument;
}

export function getOpenApiDocument() {
	return loadDocument();
}
