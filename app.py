import numpy as np
from flask import Flask, request, jsonify,render_template
from joblib import dump, load
import os
import pymongo
import _pickle as cPickle


# ENVIRONMENT VARIABLES
mongo_uri = os.getenv('MONGODB_URI', None)
run_mode = os.getenv('RUN_MODE','server')

assert(not mongo_uri is None)

# Set up mongo connection
#conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(mongo_uri)
# Declare the database
db = client.heroku_2l0h7jrs
# Declare the collection
collection = db.movie

image_FOLDER = os.path.join('static', 'img')

app = Flask(__name__,)
app.config['UPLOAD_FOLDER'] = image_FOLDER

# Load the model
model1 = load('svm_model.joblib')
model2 = load('svm_model_4.joblib')

if run_mode == 'local':

    import pandas as pd
    # # train Data
    Data = pd.read_csv("https://imdb-reviews-data.s3.us-east-2.amazonaws.com/IMDB%2BDataset+(1).csv")

    from sklearn.feature_extraction.text import TfidfVectorizer
    # Create feature vectors
    vectorizer_1 = TfidfVectorizer(min_df = 5,max_df = 0.8,sublinear_tf = True, use_idf = True)
    train_vectors_1 = vectorizer_1.fit_transform(Data['review'])
    with open(r"vect_1.pickle", "wb") as output_file:
        cPickle.dump(vectorizer_1, output_file)

    vectorizer_2 = TfidfVectorizer(min_df = 5, max_df = 0.8, ngram_range = (2,2), sublinear_tf = True, use_idf = True)
    train_vectors_2 = vectorizer_2.fit_transform(Data['review'])
    with open(r"vect_2.pickle", "wb") as output_file:
        cPickle.dump(vectorizer_2, output_file)

with open(r"vect_1.pickle", "rb") as input_file:
    vectorizer_1 = cPickle.load(input_file)

with open(r"vect_2.pickle", "rb") as input_file:
    vectorizer_2 = cPickle.load(input_file)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index.html")
def reindex():
    return render_template("index.html")

@app.route('/result',methods=['post'])
def predict():
    # Get the data from the POST request.
    data = request.form

    review = data['message']

    movie = data['email'].upper()

    name = data['name'].upper()

    review_length = len(review.split()) 

    message = "If you are a film-maker, you would want to check our detailed analysis about hollywood movies from 2000 to 2020." 
    positive_file = os.path.join(app.config['UPLOAD_FOLDER'], 'thumbs-up.png')
    negative_file = os.path.join(app.config['UPLOAD_FOLDER'], 'thumbs-down.png')

    if review_length == 1:
        # prediction = f"Hi {name}, Unfortunately we need more than 1 word to understand your sentiment. Please express it in a sentence"
        # neutral_file = os.path.join(app.config['UPLOAD_FOLDER'], 'neutral.png')
        # image = neutral_file
        review_vector = vectorizer_1.transform([review])
        prediction = model1.predict(review_vector)
        output = prediction[0]
        output = output.upper()

        if output == 'POSITIVE':        
            prediction = f"Hi {name}, Glad to know that you enjoyed the movie {movie}. Thank you for the {output} review."
            image = positive_file
        
        else:
            prediction = f"Oh no!! {name}, Sorry to hear that the movie {movie} did not meet your expectations. We will certainly pass on this {output} feedback to the movie makers"
            image = negative_file


    else:
        review_vector = vectorizer_2.transform([review]) # vectorizing

        # Make prediction using model loaded from disk as per the data.
    
        prediction = model2.predict(review_vector)

        # Take the first value of prediction
        output = prediction[0]

        output = output.upper()        
    

        if output == 'POSITIVE':        
            prediction = f"Hi {name}, Glad to know that you enjoyed the movie {movie}. Thank you for the {output} review."
            image = positive_file
        
        else:
            prediction = f"Oh no!! {name}, Sorry to hear that the movie {movie} did not meet your expectations. We will certainly pass on this {output} feedback to the movie makers"
            image = negative_file  


    # return prediction
    return render_template("prediction.html", prediction = prediction, message = message, image = image)

@app.route('/Tableau_Analysis.html')
def analysis():
    return render_template("Tableau_Analysis.html")

@app.route('/graphs.html')
def analyser():
    
    return render_template("graphs.html")

@app.route('/api/v1/resources/movies')
def api_movies():
    movies = list(collection.find())
    movie_bkp = [ movie.pop('_id') for movie in movies]
    return jsonify(movies)

    

if __name__ == '__main__':
    app.run(debug=True)
