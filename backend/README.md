# Backend (Flask)

A single-file Flask API exposing one endpoint.

## Install

From the **project root**, create and activate a virtual environment, then install
the dependencies:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
```

## Run

With the `.venv` active:

```bash
python backend/app.py
```

The server listens on **http://localhost:5000**.

## Endpoint

| Method | Path         | Response                          |
| ------ | ------------ | --------------------------------- |
| GET    | `/api/hello` | `{"message": "Hello from Flask"}` |
