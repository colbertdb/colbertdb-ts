import axios, { AxiosResponse } from 'axios';
import {
  CreateCollectionDocument,
  CreateCollectionsOptions,
  CreateCollectionRequest,
  OperationResponse,
  SearchCollectionResponse,
} from './models';

const TIMEOUT = 60000;

class Collection {
  name: string;
  client: Colbertdb;

  constructor(name: string, client: Colbertdb) {
    this.name = name;
    this.client = client;
  }

  async search(query: string, k?: number): Promise<SearchCollectionResponse> {
    const response = await this.client.searchCollection(this.name, query, k);
    return { documents: response.documents };
  }

  async deleteDocuments(documentIds: string[]): Promise<Collection> {
    await this.client.deleteDocuments(this.name, documentIds);
    return this;
  }

  async addDocuments(documents: CreateCollectionDocument[]): Promise<Collection> {
    await this.client.addToCollection(this.name, documents);
    return this;
  }

  async delete(): Promise<Record<string, any>> {
    return this.client.deleteCollection(this.name);
  }
}

class Colbertdb {
  url: string;
  apiKey?: string;
  storeName?: string;
  accessToken?: string;

  constructor(url: string, apiKey?: string, storeName: string = 'default') {
    this.url = url;
    this.apiKey = apiKey;
    this.storeName = storeName;
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${this.url}/api/v1/client/connect/${this.storeName}`,
        {},
        { headers: { 'x-api-key': this.apiKey }, timeout: TIMEOUT }
      );
      this.accessToken = response.data.access_token;
    } catch (error: any) {
      throw new Error(`Failed to connect to the Colbertdb server - ${error.response?.data?.detail}`);
    }
  }

  private async get(path: string, data: Record<string, any>): Promise<any> {
    const response: AxiosResponse<any> = await axios.get(
      `${this.url}/api/v1/collections${path}`,
      {
        params: data,
        headers: { Authorization: `Bearer ${this.accessToken}` },
        timeout: TIMEOUT,
      }
    );
    return response.data;
  }

  private async post(path: string, data: Record<string, any>): Promise<any> {
    const response: AxiosResponse<any> = await axios.post(
      `${this.url}/api/v1/collections${path}`,
      data,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        timeout: TIMEOUT,
      }
    );
    return response.data;
  }

  private async delete(path: string, data: Record<string, any>): Promise<any> {
    const response: AxiosResponse<any> = await axios.delete(
      `${this.url}/api/v1/collections${path}`,
      {
        data,
        headers: { Authorization: `Bearer ${this.accessToken}` },
        timeout: TIMEOUT,
      }
    );
    return response.data;
  }

  async createCollection(
    name: string,
    documents: CreateCollectionDocument[],
    options?: CreateCollectionsOptions
  ): Promise<Collection> {
    if (documents.length === 0) {
      throw new Error('At least one document must be provided.');
    }
    const data: CreateCollectionRequest = { name, documents, options };
    await this.post('/', data);
    return new Collection(name, this);
  }

  async listCollections(): Promise<string[]> {
    const response = await this.get('/', {});
    return response.collections;
  }

  async loadCollection(name: string): Promise<Collection> {
    const response = await this.get(`/${name}`, {});
    if (!response.exists) {
      throw new Error(`Collection '${name}' does not exist.`);
    }
    return new Collection(name, this);
  }

  async searchCollection(name: string, query: string, k?: number): Promise<SearchCollectionResponse> {
    const data = { query, k };
    return this.post(`/${name}/search`, data);
  }

  async deleteDocuments(name: string, documentIds: string[]): Promise<OperationResponse> {
    const data = { document_ids: documentIds };
    return this.post(`/${name}/delete`, data);
  }

  async addToCollection(name: string, documents: CreateCollectionDocument[]): Promise<OperationResponse> {
    const data = { documents };
    return this.post(`/${name}/documents`, data);
  }

  async deleteCollection(name: string): Promise<OperationResponse> {
    return this.delete(`/${name}`, {});
  }
}

export { Colbertdb, Collection };
