from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = Chroma(
    collection_name="documents",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)


retriever = vector_db.as_retriever(
    search_kwargs={"k": 4}
)

def add_document_to_vectordb(file_path:str,thread_id:str,document_id:str=None) :

    try :
        loaded_data = PyPDFLoader(file_path).load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)


        splitted_text = splitter.split_documents(loaded_data)

        for chunks in splitted_text :
            chunks.metadata["thread_id"] = thread_id
            chunks.metadata["document_id"] = document_id

        vector_db.add_documents(documents=splitted_text)

        return {"message":"success"}

    except Exception as e :
        raise Exception("Error Occurred, couldnt store data in vector_db")
