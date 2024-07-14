from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

app = Flask(__name__)
cors = CORS(app, origins='*')

# Configure MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password123@localhost/surveydb'

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Model for survey responses
class SurveyResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    language = db.Column(db.String(100), nullable=False)
    colour = db.Column(db.String(100), nullable=False)
    feedback = db.Column(db.Text, nullable=False)
    # Add more fields as needed

def get_column_counts(column):
    results = db.session.query(column, func.count(column)).group_by(column).all()
    return {value: count for value, count in results}


@app.route('/submit-survey', methods=['POST'])
def submit_survey():
    response = request.json

    # Example of creating and saving a SurveyResponse object
    new_response = SurveyResponse(name=response.get('name'), age=response.get('age'), language=response.get('language'), colour=response.get('colour'), feedback=response.get('feedback'))
    db.session.add(new_response)
    db.session.commit()

    return jsonify({"message": "Survey submitted successfully"}), 200

@app.route('/get-responses', methods=['GET'])
def get_responses():
    responses = SurveyResponse.query.all()
    response_list = []
    for response in responses:
        response_list.append({
            'id': response.id,
            'name': response.name,
            'age': response.age,
            'language': response.language,
            'colour': response.colour
            # Add more fields as needed
        })
    return jsonify(response_list), 200

@app.route('/counts', methods=['GET'])
def get_counts():
    columns = request.args.getlist('columns')
    counts = {}
    for column_name in columns:
        if hasattr(SurveyResponse, column_name):
            column = getattr(SurveyResponse, column_name)
            counts[column_name] = get_column_counts(column)
        else:
            return jsonify({"error": f"Invalid column name: {column_name}"}), 400
    return jsonify(counts)


@app.route('/last-entry/<column_name>', methods=['GET'])
def get_last_entry(column_name):
    try:
        last_entry = db.session.query(getattr(SurveyResponse, column_name)).order_by(SurveyResponse.id.desc()).first()
        if last_entry:
            return jsonify({column_name: getattr(last_entry, column_name)})
        else:
            return jsonify({"message": "No entries found"}), 404
    except AttributeError:
        return jsonify({"error": f"Column '{column_name}' does not exist in SurveyResponse table"}), 400
    


if __name__ == '__main__':
    app.run(debug=True)