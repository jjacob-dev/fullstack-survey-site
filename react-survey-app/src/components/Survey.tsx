import React, { useState, useEffect } from "react";
import axios from "axios";
import Responses from "./Responses";

const Survey: React.FC = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    language: "Python",
    colour: "",
    feedback: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, age, language, colour } = formData;
    if (name && age && language && colour) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const nextStep = () => {
    if (!isFormValid) {
      alert("Please fill out the form");
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      formData.age = Number(formData.age);
      const response = await axios.post(
        "https://flask-backsurvey-37288cfae4ae.herokuapp.com/submit-survey",
        formData
      );
      alert(response.data.message);
      nextStep();
    } catch (error) {
      console.error(error); // NOTE - use "error.response.data` (not "error")
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-medium">Software Survey</h1>
              <hr className="w-64 h-[2px] mx-auto my-4 bg-green-600 border-0 rounded justify-left"></hr>
            </div>
            <div>
              <label htmlFor="name">Enter your first name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="age">Enter your age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="language">What language are you best at?</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="Python">Python</option>
                <option value="HTML/CSS">HTML/CSS</option>
                <option value="Javascript">Javascript</option>
                <option value="C++">C++</option>
              </select>
            </div>
            <div className="pt-4">
              <label htmlFor="colour">Select your favorite colour</label>
            </div>

            <div className="radio-container">
              <div className="radio-group">
                <input
                  type="radio"
                  id="red"
                  name="colour"
                  value="Red"
                  checked={formData.colour === "Red"}
                  onChange={handleChange}
                />
                <label htmlFor="red" className="custom-radio"></label>
                <span>Red</span>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="blue"
                  name="colour"
                  value="Blue"
                  checked={formData.colour === "Blue"}
                  onChange={handleChange}
                />
                <label htmlFor="blue" className="custom-radio"></label>
                <span>Blue</span>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="green"
                  name="colour"
                  value="Green"
                  checked={formData.colour === "Green"}
                  onChange={handleChange}
                />
                <label htmlFor="green" className="custom-radio"></label>
                <span>Green</span>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="purple"
                  name="colour"
                  value="Purple"
                  checked={formData.colour === "Purple"}
                  onChange={handleChange}
                />
                <label htmlFor="purple" className="custom-radio"></label>
                <span>Purple</span>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="pink"
                  name="colour"
                  value="Pink"
                  checked={formData.colour === "Pink"}
                  onChange={handleChange}
                />
                <label htmlFor="pink" className="custom-radio"></label>
                <span>Pink</span>
              </div>
            </div>
            <button type="button" id="next" onClick={nextStep}>
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-medium">Enter any feedback!</h1>
              <hr className="w-64 h-[2px] mx-auto my-4 bg-green-600 border-0 rounded justify-left"></hr>
            </div>
            <div className="pt-4">
              <label htmlFor="feedback">Feedback:</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
              />
            </div>
            <button type="submit" id="next">
              Next
            </button>
          </div>
        )}
      </form>
      {step === 3 && (
        <div>
          <Responses />
        </div>
      )}
    </div>
  );
};

export default Survey;
