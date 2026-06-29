from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow the frontend (different origin in dev) to call this API


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask")


if __name__ == "__main__":
    # 5000 is hijacked by macOS AirPlay Receiver (AirTunes), so use 5001.
    app.run(port=5001, debug=True)
