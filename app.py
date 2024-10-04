from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

nlp = pipeline(
    "document-question-answering",
    model="impira/layoutlm-document-qa",
)


@app.route("/answer", methods=["POST"])
def answer_question():
    data = request.get_json()
    image_url = data.get("image_url")
    question = data.get("question")

    if image_url and question:
        try:
            result = nlp(image_url, question)
            return jsonify({"answer": result["answer"]})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Missing image_url or question"}), 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
