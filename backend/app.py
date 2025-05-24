from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/parse', methods=['POST'])
def parse_text():
    data = request.get_json()
    resume_text = data.get('resume')
    job_description = data.get('job_description')
    # Implement your parsing and matching logic here
    similarity_score = 0.85  # Placeholder for actual computation
    return jsonify({'similarity': similarity_score})

if __name__ == '__main__':
    app.run(port=5000)
