import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const extensionIds = manifest.extensionPack;
const endpoint = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';
const concurrency = 4;
const maxAttempts = 3;

if (!Array.isArray(extensionIds) || extensionIds.length === 0) {
  throw new Error('package.json extensionPack must be a non-empty array.');
}

const normalizedIds = extensionIds.map((id) => String(id).toLowerCase());
if (new Set(normalizedIds).size !== extensionIds.length) {
  throw new Error('package.json extensionPack contains duplicate extension IDs.');
}

const results = [];
for (let index = 0; index < extensionIds.length; index += concurrency) {
  const batch = extensionIds.slice(index, index + concurrency);
  results.push(...await Promise.all(batch.map(queryExtension)));
}

const failures = results.filter((result) => !result.ok);
if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Marketplace validation failed for ${failure.id}: ${failure.detail}`);
  }
  process.exitCode = 1;
} else {
  const verifiedPublishers = results.filter((result) => result.publisherVerified).length;
  console.log(
    `Validated ${results.length} unique Marketplace IDs ` +
      `(${verifiedPublishers} from domain-verified publishers).`,
  );
}

async function queryExtension(id) {
  let response;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json;api-version=7.2-preview.1',
          'Content-Type': 'application/json',
          'User-Agent': `CRUXIDE-release-validation/${manifest.version}`,
        },
        body: JSON.stringify({
          filters: [{
            criteria: [{ filterType: 7, value: id }],
            pageNumber: 1,
            pageSize: 1,
            sortBy: 0,
            sortOrder: 0,
          }],
          assetTypes: [],
          flags: 870,
        }),
        signal: AbortSignal.timeout(60_000),
      });
      break;
    } catch (error) {
      if (attempt === maxAttempts) {
        const detail = error instanceof Error ? error.message : String(error);
        return { id, ok: false, detail: `network validation failed after ${maxAttempts} attempts: ${detail}`, publisherVerified: false };
      }
    }
  }

  if (!response) {
    return { id, ok: false, detail: 'Marketplace returned no response', publisherVerified: false };
  }

  if (!response.ok) {
    return { id, ok: false, detail: `HTTP ${response.status}`, publisherVerified: false };
  }

  const payload = await response.json();
  const extension = payload.results?.[0]?.extensions?.[0];
  if (!extension) {
    return { id, ok: false, detail: 'not found', publisherVerified: false };
  }

  const canonicalId = `${extension.publisher.publisherName}.${extension.extensionName}`;
  return {
    id,
    ok: canonicalId.toLowerCase() === id.toLowerCase(),
    detail: `Marketplace returned ${canonicalId}`,
    publisherVerified: extension.publisher.isDomainVerified === true,
  };
}
