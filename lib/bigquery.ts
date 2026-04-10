import { BigQuery } from "@google-cloud/bigquery";

export type Submission = {
  id: string;
  formId: string;
  formName: string;
  data: any;
  metadata: any;
  createdAt: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    projectId: requiredEnv("GCP_PROJECT_ID"),
    datasetId: requiredEnv("BQ_DATASET_ID"),
    tableId: requiredEnv("BQ_TABLE_ID"),
  };
}

function getBigQuery() {
  const { projectId } = getConfig();
  return new BigQuery({ projectId });
}

export async function insertSubmission(submission: Submission) {
  const { datasetId, tableId } = getConfig();
  const bigquery = getBigQuery();

  await bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert([
      {
        id: submission.id,
        formId: submission.formId,
        formName: submission.formName,
        dataJson: JSON.stringify(submission.data ?? {}),
        metadataJson: JSON.stringify(submission.metadata ?? {}),
        createdAt: submission.createdAt,
      },
    ]);
}

export async function getSubmissions(limit = 100): Promise<Submission[]> {
  const { projectId, datasetId, tableId } = getConfig();
  const bigquery = getBigQuery();

  const query = `
    SELECT
      id,
      formId,
      formName,
      dataJson,
      metadataJson,
      FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', createdAt) AS createdAt
    FROM \`${projectId}.${datasetId}.${tableId}\`
    ORDER BY createdAt DESC
    LIMIT @limit
  `;

  const [rows] = await bigquery.query({
    query,
    params: { limit },
    location: "europe-west1",
  });

  return (rows as any[]).map((row) => ({
    id: row.id,
    formId: row.formId,
    formName: row.formName,
    data: safeParse(row.dataJson),
    metadata: safeParse(row.metadataJson),
    createdAt: row.createdAt,
  }));
}

function safeParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
