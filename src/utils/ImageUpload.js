import React, { useState, useRef } from 'react';
import Loading from './Loading';

const ImageUpload = ({ onImageUpload }) => {
    const [image, setImage] = useState("");
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/duoumxdo6/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setImage(data.secure_url); // Store the URL of the uploaded image
            onImageUpload(data.secure_url); // Call the parent function with the image URL
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input value
            }   
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false); // Set loading to false after upload completes
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} onChange={uploadImage} />
            <Loading isLoading={loading} />
        </div>
    );
};

export default ImageUpload;