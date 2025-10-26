"""Simple runner to start the FastAPI app with uvicorn on Render."""
import os
import uvicorn

if __name__ == "__main__":
    # Render dynamically assigns a port
    port = int(os.environ.get("PORT", 8000))
    
    # Bind to 0.0.0.0 so it's accessible externally
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
