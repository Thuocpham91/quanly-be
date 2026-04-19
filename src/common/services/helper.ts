export const getUrlPublic = (path: string) => {
  const { S_ENDPOINT_PUBLIC, S_PORT } = process.env;
  if (!S_ENDPOINT_PUBLIC) console.log("invalid env S_ENDPOINT_PUBLIC");
  const endpoint = S_ENDPOINT_PUBLIC?.includes("http")
    ? `${S_ENDPOINT_PUBLIC}:${S_PORT}`
    : `http://${S_ENDPOINT_PUBLIC}:${S_PORT}`;
  return `${endpoint}/${process.env.S_BUCKET_NAME}/${path}`;
};

export const randomCode = () => {
  return Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
};

export const getGroupSchemaName = (groupId: string) => {
  return `group_${groupId}`;
};

export const getProjectSchemaName = (groupId: string, projectId: string) => {
  // Use naming convention: group_{groupId}_p_{projectId}
  // This maintains logical grouping while being compatible with PostgreSQL
  return `group_${groupId}_project_${projectId}`;
};
