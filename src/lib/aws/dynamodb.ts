import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getAwsRegion, getMediaItemsTable, getRateLimitsTable, isAwsConfigured } from '@/lib/config/env';
import type { RateLimitStore } from '@/lib/uploads/rate-limit';
import type { MediaRecord, MediaSource, MediaStatus } from '@/lib/uploads/types';

let documentClient: DynamoDBDocumentClient | undefined;

function getDocumentClient(): DynamoDBDocumentClient {
  if (!documentClient) {
    documentClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: getAwsRegion() }),
      { marshallOptions: { removeUndefinedValues: true } },
    );
  }

  return documentClient;
}

export class DynamoRateLimitStore implements RateLimitStore {
  constructor(private readonly tableName: string) {}

  async increment(key: string, amount: number, ttlSeconds: number): Promise<number> {
    const ttl = Math.floor(Date.now() / 1000) + ttlSeconds;
    const result = await getDocumentClient().send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { pk: key },
        UpdateExpression: 'ADD #count :amount SET #ttl = if_not_exists(#ttl, :ttl)',
        ExpressionAttributeNames: {
          '#count': 'count',
          '#ttl': 'ttl',
        },
        ExpressionAttributeValues: {
          ':amount': amount,
          ':ttl': ttl,
        },
        ReturnValues: 'UPDATED_NEW',
      }),
    );

    const count = result.Attributes?.count;
    return typeof count === 'number' ? count : amount;
  }
}

export function getRateLimitStore(): RateLimitStore | undefined {
  if (!isAwsConfigured()) {
    return undefined;
  }

  return new DynamoRateLimitStore(getRateLimitsTable());
}

export async function putMediaRecord(record: MediaRecord): Promise<void> {
  await getDocumentClient().send(
    new PutCommand({
      TableName: getMediaItemsTable(),
      Item: record,
    }),
  );
}

export async function publishMediaRecord(id: string, updates: Partial<MediaRecord>): Promise<void> {
  await getDocumentClient().send(
    new UpdateCommand({
      TableName: getMediaItemsTable(),
      Key: { id },
      UpdateExpression:
        'SET #status = :status, #guestName = :guestName, #caption = :caption, #event = :event, #size = :size, #thumbKey = :thumbKey',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#guestName': 'guestName',
        '#caption': 'caption',
        '#event': 'event',
        '#size': 'size',
        '#thumbKey': 'thumbKey',
      },
      ExpressionAttributeValues: {
        ':status': 'published' satisfies MediaStatus,
        ':guestName': updates.guestName ?? '',
        ':caption': updates.caption ?? '',
        ':event': updates.event ?? '',
        ':size': updates.size ?? 0,
        ':thumbKey': updates.thumbKey ?? '',
      },
      ConditionExpression: 'attribute_exists(id)',
    }),
  );
}

export async function getMediaRecord(id: string): Promise<MediaRecord | undefined> {
  const result = await getDocumentClient().send(
    new GetCommand({
      TableName: getMediaItemsTable(),
      Key: { id },
    }),
  );

  return result.Item as MediaRecord | undefined;
}

export async function listPublishedMedia(source: MediaSource, limit = 60): Promise<MediaRecord[]> {
  const result = await getDocumentClient().send(
    new QueryCommand({
      TableName: getMediaItemsTable(),
      IndexName: 'source-createdAt-index',
      KeyConditionExpression: '#source = :source',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#source': 'source',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':source': source,
        ':status': 'published',
      },
      ScanIndexForward: false,
      Limit: limit,
    }),
  );

  return (result.Items ?? []) as MediaRecord[];
}
