import React, { useState, useEffect } from 'react';
import './App.css'; 

const App = () => {
  const [activeTab, setActiveTab] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      dob: '',
      nationality: '',
      contactNo: '',
      email: '',
      address: '',
      state: '',
      city: '',
      pin: '',
    },
    guardianDetails: {
      name: '',
      relation: '',
      contactNo: '',
      email: '',
    },
    programDetails: {
      program: '',
      specialization: '',
      mode: '',
    },
  });
  const [referralSource, setReferralSource] = useState('');
  const [referralDetails, setReferralDetails] = useState({
    name: '',
    contactNo: '',
    program: '',
    batchYear: ''
  });
  const [submittedData, setSubmittedData] = useState([]); 
  const [errors, setErrors] = useState({}); 

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [name]: value },
      
    }));
  };
  
  const validateFields = (section) => {
    const newErrors = {};
    const fields = formData[section];   
   
    for (const field in fields) {
      if (fields[field] === '') {
        newErrors[field] = `${field} is required`;
      }
      if (field === 'contactNo') {
        const contactNo = fields[field].toString(); 
        if (contactNo.length < 10) {
          newErrors[field] = 'Contact number must be at least 10 digits';
        } else if (contactNo.length > 15) {
          newErrors[field] = 'Contact number must not exceed 15 digits';
        } else if (!/^\d+$/.test(contactNo)) {
          newErrors[field] = 'Contact number must contain only digits';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleNext = () => {    
    if (validateFields(getCurrentTabSection())) {      
      setActiveTab((prevTab) => prevTab + 1);
    }
  };

  const handlePrevious = () => {
    setActiveTab((prevTab) => prevTab - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (referralSource === '') {
      alert('Please select referral Type!');
      newErrors[field] = `Please select ${field} `;
    }
    setIsLoading(true);
    const updatedFormData = {
      ...formData, 
      referralDetails: referralDetails, 
      referraltype: referralSource 
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/save-applicant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
      
      if (response.ok) {
        setIsLoading(false); 
        alert('Thank you!, Your details submitted successfully!');
        
        fetchSubmittedData();
        setActiveTab(1);
        setFormData({
          personalDetails: {
            name: '',
            dob: '',
            nationality: '',
            contactNo: '',
            email: '',
            address: '',
            state: '',
            city: '',
            pin: '',
          },
          guardianDetails: {
            name: '',
            relation: '',
            contactNo: '',
            email: '',
          },
          programDetails: {
            program: '',
            specialization: '',
            mode: '',
          },
        });
      
         setReferralSource('');
        setReferralDetails({
          name: '',
          contactNo: '',
          program: '',
          batchYear: ''
        });
      
        
        setErrors({});
     
      } else {
        alert('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }finally {
      setIsLoading(false); 
    }
  };

  const fetchSubmittedData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get-applicants');
      if (response.ok) {
        const data = await response.json();        
        setSubmittedData(data);
      } else {
        console.error('Failed to fetch submitted data.');
      }
    } catch (error) {
      console.error('Error fetching submitted data:', error);
    }
  };

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const [popupData, setPopupData] = useState(null);
  const [popupType, setPopupType] = useState(null); 

  
  const handlePopup = (type, data) => {
    setPopupType(type);
    setPopupData(data);
  };

  const closePopup = () => {
    setPopupData(null);
    setPopupType(null);
  };
   
  const handleReferralChange = (e) => {
    setReferralSource(e.target.value);
  };

  const handleReferralDetailsChange = (e) => {
    const { name, value } = e.target;
    setReferralDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

 
  const renderReferralFields = () => {
    if (referralSource === 'I am a referral') {
      return (
        <div>
          <div>
            <label>Referral Name:</label><br/>
            <input
              type="text"
              name="name"
              value={referralDetails.name}
              onChange={handleReferralDetailsChange}
              required
            />
          </div>
          <div>
            <label>Contact Number:</label><br/>
            <input
              type="number"
              name="contactNo"
              value={referralDetails.contactNo}
              onChange={handleReferralDetailsChange}
              required
            />
          </div>
          <div>
            <label>Program:</label><br/>
            <input
              type="text"
              name="program"
              value={referralDetails.program}
              onChange={handleReferralDetailsChange}
              required
            />
          </div>
          <div>
            <label>Batch Year:</label><br/>
            <input
              type="number"
              name="batchYear"
              value={referralDetails.batchYear}
              onChange={handleReferralDetailsChange}
              required
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h2>Applicant’s Information</h2>
            <div>
              <label>Name:</label><br/>
              <input
                type="text"
                name="name"
                value={formData.personalDetails.name}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
              <label>Date of Birth:</label><br/>
              <input
                type="date"
                name="dob"
                value={formData.personalDetails.dob}
                onChange={(e) => handleChange(e, 'personalDetails')}
                max={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>
            <div>
              <label>Nationality:</label><br/>
              <input
                type="text"
                name="nationality"
                value={formData.personalDetails.nationality}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.nationality && <span className="error">{errors.nationality}</span>}
            </div>
            <div>
              <label>Contact No:</label><br/>
              <input
                type="number"
                name="contactNo"
                value={formData.personalDetails.contactNo}
                onChange={(e) => handleChange(e, 'personalDetails')} 
                required
              />
              {errors.contactNo && <span className="error">{errors.contactNo}</span>}
            </div>
            <div>
              <label>Email:</label><br/>
              <input
                type="email"
                name="email"
                value={formData.personalDetails.email}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div>
              <label>Address:</label><br/>
              <input
                type="text"
                name="address"
                value={formData.personalDetails.address}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
            <div>
              <label>City:</label><br/>
              <input
                type="text"
                name="city"
                value={formData.personalDetails.city}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div>
              <label>State:</label><br/>
              <input
                type="text"
                name="state"
                value={formData.personalDetails.state}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
            <div>
              <label>Pincode:</label><br/>
              <input
                type="text"
                name="pin"
                value={formData.personalDetails.pin}
                onChange={(e) => handleChange(e, 'personalDetails')}
                required
              />
              {errors.pin && <span className="error">{errors.pin}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Parent’s/Guardian’s Details</h2>
            <div>
              <label>Name:</label><br/>
              <input
                type="text"
                name="name"
                value={formData.guardianDetails.name}
                onChange={(e) => handleChange(e, 'guardianDetails')}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
              <label>Relation to Student:</label><br/>
              <input
                type="text"
                name="relation"
                value={formData.guardianDetails.relation}
                onChange={(e) => handleChange(e, 'guardianDetails')}
                required
              />
              {errors.relation && <span className="error">{errors.relation}</span>}
            </div>
            <div>
              <label>Contact No:</label><br/>
              <input
                type="number"
                name="contactNo"
                value={formData.guardianDetails.contactNo}
                onChange={(e) => handleChange(e, 'guardianDetails')}
                required
              />
              {errors.contactNo && <span className="error">{errors.contactNo}</span>}
            </div>
            <div>
              <label>Email:</label><br/>
              <input
                type="text"
                name="email"
                value={formData.guardianDetails.email}
                onChange={(e) => handleChange(e, 'guardianDetails')}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Program Details</h2>
            <div>
              <label>Choose Program:</label><br/>
              <select
                name="program"
                value={formData.programDetails.program}
                onChange={(e) => handleChange(e, 'programDetails')}
                required
              >
                <option value="">Select</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Advanced Diploma">Advanced Diploma</option>
              </select>
              {errors.program && <span className="error">{errors.program}</span>}
            </div>
            <div>
              <label>Specialization:</label><br/>
              <input
                type="text"
                name="specialization"
                value={formData.programDetails.specialization}
                onChange={(e) => handleChange(e, 'programDetails')}
                required
              />
              {errors.specialization && <span className="error">{errors.specialization}</span>}
            </div>
            <div>
              <label>Mode:</label><br/>
              <select
                name="mode"
                value={formData.programDetails.mode}
                onChange={(e) => handleChange(e, 'programDetails')}
                required
              >
                <option value="">Select</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              {errors.mode && <span className="error">{errors.mode}</span>}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Final Form Submission</h2>
            <div>
              <label>Before submitting the form, let us know how you found out about us:</label>
              <div>
                <input
                  type="radio"
                  name="referralSource"
                  value="Facebook/Instagram Ad"
                  checked={referralSource === 'Facebook/Instagram Ad'}
                  onChange={handleReferralChange}
                />
                <label>Facebook/Instagram Ad</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="referralSource"
                  value="Twitter"
                  checked={referralSource === 'Twitter'}
                  onChange={handleReferralChange}
                />
                <label>Twitter</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="referralSource"
                  value="YouTube"
                  checked={referralSource === 'YouTube'}
                  onChange={handleReferralChange}
                />
                <label>YouTube</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="referralSource"
                  value="Through family"
                  checked={referralSource === 'Through family'}
                  onChange={handleReferralChange}
                />
                <label>Through family</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="referralSource"
                  value="I am a referral"
                  checked={referralSource === 'I am a referral'}
                  onChange={handleReferralChange}
                />
                <label>I am a referral</label>
              </div>
              {renderReferralFields()}
            </div>
            <button type="submit">Submit</button>
          </div>
        );
      default:
        return null;
    }
  };

  const getCurrentTabSection = () => {
    switch (activeTab) {
      case 1:
        return 'personalDetails';
      case 2:
        return 'guardianDetails';
      case 3:
        return 'programDetails';
      default:
        return '';
    }
  };

  return (
    <div >
      <h1>Multi-Tab Form</h1>
      <div className="card col-12">
        <div className="tab-navigation">
          {[1, 2, 3, 4].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
            >
              Tab {tab}
            </button>
          ))}
        </div>
    
        <form onSubmit={handleSubmit}>
          {renderTabContent()}
          <div className="form-navigation">
            {activeTab > 1 && (
              <button type="button" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {activeTab < 4 && (
              <button type="button" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </form>
        {isLoading && <div className="loader">Loading...</div>}
      </div>

      <div className="col-12">
      <h2>Applicant's Data</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Nationality</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Guardian</th>
            <th>Program</th>
            <th>Referral</th>
            <th>Address</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{new Date(data.dob).toLocaleDateString('en-GB')}</td>
              <td>{data.nationality}</td>
              <td>{data.mobile}</td>
              <td>{data.email}</td>
              <td onClick={() => handlePopup('guardianDetail', data?.guardian_detail)}
                style={{ cursor: data?.guardian_detail ? 'pointer' : 'default', color: data?.guardian_detail ? 'blue' : 'inherit' }}
              >{data?.guardian_detail?.name || 'N/A'}</td>
              <td  onClick={() => handlePopup('programDetail', data?.program_detail)}
                style={{ cursor: data?.program_detail ? 'pointer' : 'default', color: data?.program_detail ? 'blue' : 'inherit' }}
              >{data?.program_detail?.program || 'N/A'}</td>
              <td  onClick={() => handlePopup('referralDetail', data?.referral_detail)}
                style={{ cursor: data?.referral_detail ? 'pointer' : 'default', color: data?.referral_detail ? 'blue' : 'inherit' }}
              >{data?.referraltype || 'N/A'}</td>
              <td>{data.address},{data.city},{data.state},{data.pincode}</td>
              <td>{new Date(data.created_at).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
     
    {popupData && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h2>{popupType === 'guardianDetail' ? 'Guardian Details' : popupType === 'programDetail' ? 'Program Details' : 'Referral Details'}</h2>
            {popupType === 'guardianDetail' && (
              <>
                <p><strong>Name:</strong> {popupData.name}</p>
                <p><strong>Relation:</strong> {popupData.relation}</p>
                <p><strong>Contact No:</strong> {popupData.mobile}</p>
                <p><strong>Email:</strong> {popupData.email || 'N/A'}</p>
              </>
            )}
            {popupType === 'programDetail' && (
              <>
                <p><strong>Program:</strong> {popupData.program}</p>
                <p><strong>Specialization:</strong> {popupData.specialization}</p>
                <p><strong>Mode:</strong> {popupData.mode}</p>
              </>
            )}
            {popupType === 'referralDetail' && (
              <>
                <p><strong>Name:</strong> {popupData.name}</p>
                <p><strong>Contact No:</strong> {popupData.mobile}</p>
                <p><strong>Program:</strong> {popupData.program}</p>
                <p><strong>Batch Year:</strong> {popupData.batchYear}</p>
              </>
            )}
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
   
      </div>
    </div>
  );
};

export default App;

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'darkslategray',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
  },
};
