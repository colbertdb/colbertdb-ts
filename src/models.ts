interface ListCollectionsResponse {
  collections: string[];
}

interface GetCollectionResponse {
  exists: boolean;
}

interface ConnectResponse {
  access_token: string;
}

interface CreateCollectionDocument {
  content: string;
  metadata?: Record<string, any>;
}

interface CreateCollectionsOptions {
  force_create?: boolean;
}

interface CreateCollectionRequest {
  name: string;
  documents: CreateCollectionDocument[];
  options?: CreateCollectionsOptions;
}

interface DeleteDocumentsRequest {
  document_ids: string[];
}

interface Document {
  content: string;
  document_id?: string;
  score?: number;
  rank?: number;
  passage_id?: number;
  metadata?: Record<string, any>;
}

interface OperationResponse {
  status: string;
  message: string;
}

interface SearchCollectionRequest {
  k?: number;
  query: string;
}

interface SearchCollectionResponse {
  documents: Document[];
}

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface AddToCollectionRequest {
  documents: CreateCollectionDocument[];
}

interface HTTPValidationError {
  detail?: ValidationError[];
}

export {
  ListCollectionsResponse,
  GetCollectionResponse,
  CreateCollectionDocument,
  CreateCollectionsOptions,
  CreateCollectionRequest,
  DeleteDocumentsRequest,
  Document,
  OperationResponse,
  SearchCollectionRequest,
  SearchCollectionResponse,
  ValidationError,
  AddToCollectionRequest,
  HTTPValidationError,
  ConnectResponse,
};
