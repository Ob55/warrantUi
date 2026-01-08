import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WarrantyRegister = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    retailer: "",
    invoiceNumber: "",
  });
  const [warrantyData, setWarrantyData] = useState(null);

  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  useEffect(() => {
  document.body.style.margin = "0";
}, []);


  useEffect(() => {
    const fetchWarranty = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/warranty/${token}`);
        const data = await res.json();
        if (res.ok && data.registered) {
          setRegistered(true);
          setWarrantyData(data.warranty);
        } else {
          setRegistered(false);
        }
      } catch (err) {
        toast.error("Failed to fetch warranty data");
      } finally {
        setLoading(false);
      }
    };
    fetchWarranty();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/warranty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register warranty");
      toast.success("Warranty registered successfully 🎉");
      setWarrantyData({
        ...formData,
        purchaseDate: formData.purchaseDate,
        warrantyExpiry: new Date(
          new Date(formData.purchaseDate).setFullYear(
            new Date(formData.purchaseDate).getFullYear() + 1
          )
        ),
      });
      setRegistered(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "0 15px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "green",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{
        width: "100%",
        backgroundColor: "#2df52aff",
        color: "#fff",
        padding: "10px 0",
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
      }}>
        Welcome to Ignis Warranty Page
      </nav>

      {/* Content */}
      {registered && warrantyData ? (
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Warranty Status</h2>
          <p><strong>Name:</strong> {warrantyData.fullName}</p>
          <p><strong>Product Model:</strong> {warrantyData.model}</p>
          <p><strong>Serial Number:</strong> {warrantyData.serialNumber}</p>
          <p><strong>Purchase Date:</strong> {new Date(warrantyData.purchaseDate).toLocaleDateString()}</p>
          <p><strong>Warranty Expiry:</strong> {new Date(warrantyData.warrantyExpiry).toLocaleDateString()}</p>

          <div style={{
            height: "25px",
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "12px",
            overflow: "hidden",
            marginTop: "10px"
          }}>
            <div style={{
              height: "100%",
              width: `${Math.ceil(getDaysLeft(warrantyData.warrantyExpiry) / 365 * 100)}%`,
              backgroundColor: "green",
              transition: "width 1s ease-in-out"
            }}></div>
          </div>
          <p style={{ marginTop: "5px", textAlign: "center" }}>
            {getDaysLeft(warrantyData.warrantyExpiry)} day(s) remaining
          </p>
        </div>
      ) : (
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Warranty Registration</h2>
          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
             <h3>Personal Information</h3>
            <input style={inputStyle} name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input style={inputStyle} name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input style={inputStyle} name="phone" placeholder="Phone Number" onChange={handleChange} required />

            {/* Product Info */}
                <h3>Product Information</h3>
            <input style={inputStyle} name="model" placeholder="Product Model" onChange={handleChange} required />
            <input style={inputStyle} name="serialNumber" placeholder="Serial Number" onChange={handleChange} required />
            <input style={inputStyle} name="purchaseDate" type="date" onChange={handleChange} required />
            <input style={inputStyle} name="retailer" placeholder="Retailer" onChange={handleChange} />
            <input style={inputStyle} name="invoiceNumber" placeholder="Invoice Number" onChange={handleChange} />

            <button style={buttonStyle} type="submit">Register Warranty</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WarrantyRegister;
