from flask import Flask, request, jsonify

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import pymysql
from flask_cors import CORS

application = Flask(__name__)
CORS(application)
application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:Aqkn24412@surveydb.cpsokwaqw7fg.us-east-1.rds.amazonaws.com:3306/surveydb'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Avoids SQLAlchemy warning



# Initialize SQLAlchemy
db = SQLAlchemy(application)


class SurveyResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    age = db.Column(db.Integer, nullable=False)  
    language = db.Column(db.String(30), nullable=False)
    colour = db.Column(db.String(30), nullable=False)
    feedback = db.Column(db.Text, nullable=False)

def get_column_counts(column):
    results = db.session.query(column, func.count(column)).group_by(column).all()
    return {value: count for value, count in results}


@application.route('/')
def index():
    return 'Working!'

@application.route('/submit-survey', methods=['POST'])
def submit_survey():
    print("anything!!")
    response = request.json
    new_response = SurveyResponse(name=response.get('name'), age=response.get('age'), language=response.get('language'), colour=response.get('colour'), feedback=response.get('feedback'))
    print("true" + str(new_response))
    db.session.add(new_response)
    db.session.commit()

    return jsonify({"message": "Survey submitted successfully"}), 200

@application.route('/get-responses', methods=['GET'])
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
        })
    return jsonify(response_list), 200

@application.route('/counts', methods=['GET'])
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


@application.route('/last-entry/<column_name>', methods=['GET'])
def get_last_entry(column_name):
    try:
        last_entry = db.session.query(getattr(SurveyResponse, column_name)).order_by(SurveyResponse.id.desc()).first()
        if last_entry:
            return jsonify({column_name: getattr(last_entry, column_name)})
        else:
            return jsonify({"message": "No entries found"}), 404
    except AttributeError:
        return jsonify({"error": f"Column '{column_name}' does not exist in SurveyResponse table"}), 400
    

if __name__ == "__main__":
    application.run()