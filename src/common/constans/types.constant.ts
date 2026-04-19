export type RecordPollerNotificationMinio = {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: UserIdentity;
  requestParameters: RequestParameters;
  responseElements: ResponseElements;
  s3: S3;
  source: Source;
};

type Source = {
  host: string;
  port: string;
  userAgent: string;
};

type S3 = {
  s3SchemaVersion: string;
  configurationId: string;
  bucket: Bucket;
  object: S3Object;
};

type S3Object = {
  key: string;
  size: number;
  eTag: string;
  contentType: string;
  userMetadata: null[];
  sequencer: string;
};

type Bucket = {
  name: string;
  ownerIdentity: null[];
  arn: string;
};

type ResponseElements = {
  "x-amz-id-2": string;
  "x-amz-request-id": string;
  "x-minio-deployment-id": string;
  "x-minio-origin-endpoint": string;
};

type RequestParameters = {
  principalId: string;
  region: string;
  sourceIPAddress: string;
};

type UserIdentity = {
  principalId: string;
};
