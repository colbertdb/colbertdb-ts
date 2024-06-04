interface ListCollectionsResponse {
    /**
     * Pydantic model for the response of listing collections.
     */
    collections: string[];
  }

interface GetCollectionResponse {
/**
 * Pydantic model for the response of getting a collection.
 */
exists: boolean;
}

interface CreateCollectionDocument {
content: string;
metadata?: Record<string, any>;
}

interface CreateCollectionsOptions {
/**
 * Pydantic model for options for creating a collection.
 */
force_create?: boolean;
}

interface CreateCollectionRequest {
/**
 * Pydantic model for creating a collection.
 */
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

export { ListCollectionsResponse, GetCollectionResponse, CreateCollectionDocument, CreateCollectionsOptions, CreateCollectionRequest, DeleteDocumentsRequest, Document, OperationResponse, SearchCollectionRequest, SearchCollectionResponse, ValidationError, AddToCollectionRequest, HTTPValidationError}