from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.json.ensure_ascii = False  # output non-ASCII chars as-is instead of \uXXXX

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/api/extract", methods=["POST"])
def extract():
	text = request.json.get("text", "")
	# Stage 2: no real extraction yet — accept the input but return hardcoded data.
	# Some fields are intentionally None to exercise the "missing field" UI.
	fake = {
		"course_title": "Python Intro Workshop",
		"location": "Gangnam Coding Academy, 3F",
		"datetime": "2026-07-12 Sat 14:00",
		"pay": None,
		"contact": None,
	}
	return jsonify(fake)

if __name__ == "__main__":
	app.run(port=5001, debug=True)
