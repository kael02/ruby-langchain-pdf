import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

const SPLIT_CHUNK_SIZE = 1000;
const SPLIT_CHUNK_OVERLAP = 200;

export const ingestData = async (filePath: string) => {
  try {
    console.log("filePath", filePath);

    const pdfLoader = new PDFLoader(filePath);

    const rawDocs = await pdfLoader.load();

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: SPLIT_CHUNK_SIZE,
      chunkOverlap: SPLIT_CHUNK_OVERLAP,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log("creating supabase vector store...");

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      },
    );
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
