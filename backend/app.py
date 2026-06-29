from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow the frontend (different origin in dev) to call this API


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask")


if __name__ == "__main__":
    app.run(port=5000, debug=True)
