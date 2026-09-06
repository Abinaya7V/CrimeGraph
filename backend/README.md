# CrimeGraph-AI Backend

Minimal backend for the CrimeGraph-AI hackathon demo. It exposes a single FastAPI endpoint to extract entities (Persons, Locations, Phone Numbers, Vehicle Numbers) from text using spaCy and Regex.

## Setup Instructions

1. **Ensure you have Python installed.** (Python 3.8+ recommended)
2. **Open a terminal in the `backend` folder.**
3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```
4. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```
5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
6. **Download the spaCy NLP model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

## Running the Server

Run the FastAPI server using `uvicorn`:

```bash
uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000/extract`.

## Testing Standalone

You can test the extraction script without starting the server:
```bash
python extract.py
```
