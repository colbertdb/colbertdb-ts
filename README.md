# Quickstart Guide for `colbertdb-ts`

This guide provides a quickstart tutorial for using the `colbertdb-ts` package to integrate ColbertDB with LlamaIndex, leveraging OpenAI's GPT-4 model for processing and querying documents.

## Prerequisites

Ensure you have the following installed and configured:

- Node.js and npm
- Docker (for running ColbertDB)
- An OpenAI API key
- Environment variables configured for ColbertDB

## Installation

1. **Install the package**

   ```sh
   npm install colbertdb-ts
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory of your project and add the following:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   COLBERT_URL=your_colbertdb_url
   COLBERT_API_KEY=your_colbertdb_api_key
   COLBERT_STORE_NAME=your_colbertdb_store_name
   ```

## Code Example

Below is an example of how to use the `colbertdb-ts` package to fetch, process, and query documents.

### Import Dependencies

The code begins by importing necessary dependencies.

```typescript
import axios from "axios";
import "dotenv/config";
import { HTMLReader, TextQaPrompt, OpenAI, Settings } from "llamaindex";
import { ColbertDB } from "colbertdb-ts";
import { CreateCollectionDocument } from "colbertdb-ts/dist/models";
```

### Configure OpenAI Settings

Set the OpenAI model configuration with your API key.

```typescript
Settings.llm = new OpenAI({
  model: "gpt-4-turbo",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY as string,
});
```

### Define the Prompt Template

Define a prompt template for generating responses in the style of a Sherlock Holmes detective novel.

```typescript
const newTextQaPrompt: TextQaPrompt = ({ context, query }) => {
  return `Context information is below.
  ---------------------
  ${context}
  ---------------------
  Given the context information and not prior knowledge, answer the query.
  Answer the query in the style of a Sherlock Holmes detective novel.
  Query: ${query}
  Answer:`;
};
```

### Main Function

The main function contains the core logic for connecting to ColbertDB, fetching HTML content, creating a collection, and querying the data.

```typescript
const main = async () => {
  // Connect to ColbertDB
  const client = await new ColbertDB(
    process.env.COLBERT_URL as string,
    process.env.COLBERT_API_KEY as string,
    process.env.COLBERT_STORE_NAME as string
  ).connect();

  // Fetch HTML content from Wikipedia
  const html = await axios.get("https://en.wikipedia.org/wiki/Onigiri");
  const docs = [
    {
      content: await new HTMLReader().parseContent(html.data),
      metadata: { type: "food" },
    } as CreateCollectionDocument,
  ];

  // Create a new collection in ColbertDB
  const collection = await client.createCollection("onigiri", docs, {
    force_create: true,
  });

  // Search the collection
  const response = await collection.search("What are onigiri?", 3);
  let context = "";
  for (const doc of response.documents) {
    context += doc.content + "\n";
  }

  // Generate a response using OpenAI
  const prompt = newTextQaPrompt({ context, query: "What are onigiri?" });
  const answer = await new OpenAI().complete({ prompt });
  console.log(answer);
};

// Execute the main function
main();
```

### Execution

To execute the script, run:

```sh
ts-node path/to/your/script.ts
```

This will connect to ColbertDB, fetch and process the HTML content from the specified URL, create a document collection, perform a search query, and generate a response using OpenAI's GPT-4 model.

## Conclusion

This guide provides a quickstart overview of using the `colbertdb-ts` package for document processing and querying. Customize the prompt and collection as needed for your specific use case.