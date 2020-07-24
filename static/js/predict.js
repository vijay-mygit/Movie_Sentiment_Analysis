import pandas as pd
// train Data
Data = pd.read_csv("https://imdb-reviews-data.s3.us-east-2.amazonaws.com/IMDB+Dataset.csv")

from sklearn.feature_extraction.text import TfidfVectorizer
// Create feature vectors

vectorizer = TfidfVectorizer(min_df = 5,
                             max_df = 0.8,
                             sublinear_tf = True,
                             use_idf = True)
train_vectors = vectorizer.fit_transform(Data['review'])

# prediction function 
def reviewPredictor(review): 
    // to_predict = np.array(to_predict_list).reshape(1, 12) 
    model = load('svm_model.joblib')
    review_vector = vectorizer.transform([review])
    review_result = model.predict(review_vector) 
    return review_result[0] 
  
@app.route('/result', methods = ['post']) 
def result(): 
    if request.method == 'post': 
        to_predict_list = request.form.to_dict() 
        to_predict_list = list(to_predict_list.values()) 
        to_predict_list = list(map(int, to_predict_list)) 
        result = ValuePredictor(to_predict_list)         
        if int(result)== 1: 
            prediction ='Income more than 50K'
        else: 
            prediction ='Income less that 50K'            
        return render_template("result.html", prediction = prediction) 